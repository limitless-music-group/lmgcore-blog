"use client";

import type { MouseEvent } from "react";
import { useCallback, useState } from "react";
import { cn } from "tailwind-variants";
import { AppIcons } from "../app-icons";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export interface MultiSelectOption {
  label: string;
  value: string;
}

function SelectedChip({
  label,
  onRemove,
  value,
}: {
  label: string;
  onRemove: (value: string) => void;
  value: string;
}) {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onRemove(value);
    },
    [onRemove, value]
  );

  return (
    <Button
      className="cursor-pointer gap-1 pr-1 opacity-60 hover:opacity-100"
      onClick={handleClick}
      variant="secondary"
    >
      {label}
      <AppIcons.Common.X className="size-3" />
    </Button>
  );
}

function MultiSelectListItem({
  isSelected,
  label,
  onToggle,
  value,
}: {
  isSelected: boolean;
  label: string;
  onToggle: (value: string) => void;
  value: string;
}) {
  const handleSelect = useCallback(() => onToggle(value), [onToggle, value]);

  return (
    <CommandItem onSelect={handleSelect} value={label}>
      <AppIcons.Common.Check
        className={cn("mr-2 size-4", isSelected ? "opacity-100" : "opacity-0")}
      />
      {label}
    </CommandItem>
  );
}

export function FormMultiSelect({
  options,
  placeholder = "Select...",
  emptyText = "No results found.",
  searchPlaceholder = "Search...",
  ...props
}: FormControlProps & {
  options: MultiSelectOption[];
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
}) {
  const field = useFieldContext<string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [open, setOpen] = useState(false);

  const selected = field.state.value ?? [];

  const toggle = useCallback(
    (value: string) => {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      field.handleChange(next);
    },
    [selected, field]
  );

  const remove = useCallback(
    (value: string) => {
      field.handleChange(selected.filter((v) => v !== value));
    },
    [selected, field]
  );

  return (
    <FormBase {...props}>
      <Popover onOpenChange={setOpen} open={open}>
        {/* div trigger avoids nested <button> inside <button> */}
        <PopoverTrigger asChild>
          <div
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-invalid={isInvalid}
            className={cn(
              "flex h-auto min-h-9 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isInvalid && "border-destructive ring-2 ring-destructive/20",
              "select-none"
            )}
            id={field.name}
            onBlur={field.handleBlur}
            role="combobox"
            tabIndex={0}
          >
            <div className="flex flex-wrap gap-1">
              {selected.length > 0 ? (
                selected.map((val) => {
                  const opt = options.find((o) => o.value === val);
                  return (
                    <SelectedChip
                      key={val}
                      label={opt?.label ?? val}
                      onRemove={remove}
                      value={val}
                    />
                  );
                })
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <AppIcons.Directional.ChevronsUpDown className="mt-0.5 ml-2 size-4 shrink-0 self-start text-muted-foreground" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <MultiSelectListItem
                    isSelected={selected.includes(opt.value)}
                    key={opt.value}
                    label={opt.label}
                    onToggle={toggle}
                    value={opt.value}
                  />
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}
