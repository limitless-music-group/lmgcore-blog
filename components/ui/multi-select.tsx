"use client";

import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "tailwind-variants";
import { AppIcons } from "./app-icons";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface MultiSelectContextProps {
  items: Map<string, ReactNode>;
  onItemAddedAction: (value: string, label: ReactNode) => void;
  open: boolean;
  selectedValues: Set<string>;
  setOpen: (open: boolean) => void;
  single?: boolean;
  toggleValue: (value: string) => void;
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null);

function useMultiSelectContext() {
  const context = useContext(MultiSelectContext);
  if (context === null) {
    throw new Error(
      "useMultiSelectContext must be used within a MultiSelectContext"
    );
  }
  return context;
}

function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

interface MultiSelectProps {
  children: ReactNode;
  defaultValues?: string[];
  onValuesChangeAction?: (values: string[]) => void;
  single?: boolean;
  values?: string[];
}
export function MultiSelect({
  children,
  defaultValues,
  single,
  values,
  onValuesChangeAction,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValues, setInternalValues] = useState(
    new Set<string>(values ?? defaultValues)
  );
  const selectedValues = values ? new Set(values) : internalValues;
  const [items, setItems] = useState<Map<string, ReactNode>>(new Map());

  function toggleValue(value: string) {
    const getNewSet = (prev: Set<string>) => {
      if (single) {
        return prev.has(value) ? new Set<string>() : new Set<string>([value]);
      }
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    };
    setInternalValues(getNewSet);
    onValuesChangeAction?.([...getNewSet(selectedValues)]);
    if (single) {
      setOpen(false);
    }
  }

  const onItemAddedAction = useCallback((value: string, label: ReactNode) => {
    setItems((prev) => {
      if (prev.get(value) === label) {
        return prev;
      }
      return new Map(prev).set(value, label);
    });
  }, []);

  return (
    <MultiSelectContext
      value={{
        items,
        onItemAddedAction,
        open,
        selectedValues,
        setOpen,
        single,
        toggleValue,
      }}
    >
      <Popover modal={true} onOpenChange={setOpen} open={open}>
        {children}
      </Popover>
    </MultiSelectContext>
  );
}

export function MultiSelectTrigger({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: ReactNode;
} & ComponentPropsWithoutRef<typeof Button>) {
  const { open } = useMultiSelectContext();

  return (
    <PopoverTrigger asChild>
      <Button
        {...props}
        aria-expanded={props["aria-expanded"] ?? open}
        className={cn(
          "flex h-auto min-h-9 w-fit items-center justify-between gap-2 overflow-hidden whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
          className
        )}
        role={props.role ?? "combobox"}
        variant={props.variant ?? "outline"}
      >
        {children}
        <AppIcons.Directional.ChevronsUpDown className="size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

export function MultiSelectValue({
  placeholder,
  clickToRemove = true,
  className,
  overflowBehavior = "wrap-when-open",
  ...props
}: {
  placeholder?: string;
  clickToRemove?: boolean;
  overflowBehavior?: "wrap" | "wrap-when-open" | "cutoff";
} & Omit<ComponentPropsWithoutRef<"div">, "children">) {
  const { selectedValues, toggleValue, items, open, single } =
    useMultiSelectContext();
  const [overflowAmount, setOverflowAmount] = useState(0);
  const valueRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);

  const shouldWrap =
    overflowBehavior === "wrap" ||
    (overflowBehavior === "wrap-when-open" && open);

  const checkOverflow = useCallback(() => {
    if (valueRef.current === null) {
      return;
    }

    const containerElement = valueRef.current;
    const overflowElement = overflowRef.current;
    const itemElements = containerElement.querySelectorAll<HTMLElement>(
      "[data-selected-item]"
    );

    if (overflowElement !== null) {
      overflowElement.style.display = "none";
    }
    // biome-ignore lint/complexity/noForEach: Needed
    // biome-ignore lint/suspicious/useIterableCallbackReturn: Needed
    itemElements.forEach((child) => child.style.removeProperty("display"));
    let amount = 0;
    for (let i = itemElements.length - 1; i >= 0; i -= 1) {
      const child = itemElements[i];
      if (!child) {
        continue;
      }
      if (containerElement.scrollWidth <= containerElement.clientWidth) {
        break;
      }
      amount = itemElements.length - i;
      child.style.display = "none";
      overflowElement?.style.removeProperty("display");
    }
    setOverflowAmount(amount);
  }, []);

  const handleResize = useCallback(
    (node: HTMLDivElement) => {
      valueRef.current = node;

      const mutationObserver = new MutationObserver(checkOverflow);
      const observer = new ResizeObserver(debounce(checkOverflow, 100));

      mutationObserver.observe(node, {
        attributeFilter: ["class", "style"],
        attributes: true,
        childList: true,
      });
      observer.observe(node);

      return () => {
        observer.disconnect();
        mutationObserver.disconnect();
        valueRef.current = null;
      };
    },
    [checkOverflow]
  );

  if (selectedValues.size === 0 && placeholder) {
    return (
      <span className="min-w-0 overflow-hidden font-normal text-muted-foreground">
        {placeholder}
      </span>
    );
  }

  if (single && selectedValues.size > 0) {
    const [firstValue] = selectedValues;
    return (
      <span className="min-w-0 overflow-hidden">
        {firstValue ? items.get(firstValue) : null}
      </span>
    );
  }

  return (
    <div
      {...props}
      className={cn(
        "flex w-full gap-1.5 overflow-hidden",
        shouldWrap && "h-full flex-wrap",
        className
      )}
      ref={handleResize}
    >
      {[...selectedValues]
        .filter((value) => items.has(value))
        .map((value) => (
          <Badge
            className="group flex items-center gap-1"
            data-selected-item
            key={value}
            onClick={
              clickToRemove
                ? (e) => {
                    e.stopPropagation();
                    toggleValue(value);
                  }
                : undefined
            }
            variant="outline"
          >
            {items.get(value)}
            {clickToRemove ? (
              <AppIcons.Common.X className="size-2 text-muted-foreground group-hover:text-destructive" />
            ) : null}
          </Badge>
        ))}
      <Badge
        ref={overflowRef}
        style={{
          display: overflowAmount > 0 && !shouldWrap ? "block" : "none",
        }}
        variant="outline"
      >
        +{overflowAmount}
      </Badge>
    </div>
  );
}

export function MultiSelectContent({
  search = true,
  children,
  ...props
}: {
  search?: boolean | { placeholder?: string; emptyMessage?: string };
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<typeof Command>, "children">) {
  const canSearch = typeof search === "object" ? true : search;

  return (
    <>
      <div style={{ display: "none" }}>
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>
      <PopoverContent className="min-w-(--radix-popover-trigger-width) p-0">
        <Command {...props}>
          {canSearch ? (
            <CommandInput
              placeholder={
                typeof search === "object" ? search.placeholder : undefined
              }
            />
          ) : (
            <button autoFocus className="sr-only" type="button" />
          )}
          <CommandList>
            {canSearch ? (
              <CommandEmpty>
                {
                  // biome-ignore lint/suspicious/noLeakedRender: emptyMessage is a string | undefined prop; rendering undefined is a no-op, not a leak.
                  typeof search === "object" ? search.emptyMessage : undefined
                }
              </CommandEmpty>
            ) : null}
            {children}
          </CommandList>
        </Command>
      </PopoverContent>
    </>
  );
}

export function MultiSelectItem({
  value,
  children,
  badgeLabel,
  onSelect,
  ...props
}: {
  badgeLabel?: ReactNode;
  value: string;
} & Omit<ComponentPropsWithoutRef<typeof CommandItem>, "value">) {
  const { toggleValue, selectedValues, onItemAddedAction } =
    useMultiSelectContext();
  const isSelected = selectedValues.has(value);

  useEffect(() => {
    onItemAddedAction(value, badgeLabel ?? children);
  }, [value, children, onItemAddedAction, badgeLabel]);

  const handleSelect = useCallback(() => {
    toggleValue(value);
    onSelect?.(value);
  }, [toggleValue, value, onSelect]);

  return (
    <CommandItem {...props} onSelect={handleSelect}>
      <AppIcons.Common.Check
        className={cn("mr-2 size-4", isSelected ? "opacity-100" : "opacity-0")}
      />
      {children}
    </CommandItem>
  );
}

export function MultiSelectGroup(
  props: ComponentPropsWithoutRef<typeof CommandGroup>
) {
  return <CommandGroup {...props} />;
}

export function MultiSelectSeparator(
  props: ComponentPropsWithoutRef<typeof CommandSeparator>
) {
  return <CommandSeparator {...props} />;
}
