"use client";

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

export interface ComboboxOption {
  label: string;
  value: string;
}

function ComboboxListItem({
  isSelected,
  label,
  onSelect,
  value,
}: {
  isSelected: boolean;
  label: string;
  onSelect: (value: string) => void;
  value: string;
}) {
  const handleSelect = useCallback(() => onSelect(value), [onSelect, value]);

  return (
    <CommandItem onSelect={handleSelect} value={label}>
      <AppIcons.Common.Check
        className={cn("mr-2 size-4", isSelected ? "opacity-100" : "opacity-0")}
      />
      {label}
    </CommandItem>
  );
}

export function FormCombobox({
  options,
  placeholder = "Select...",
  emptyText = "No results found.",
  searchPlaceholder = "Search...",
  disabled = false,
  ...props
}: FormControlProps & {
  options: ComboboxOption[];
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === field.state.value);

  // This form only validates on blur/submit (no `onChange` validator — see
  // use-onboarding.ts), and selecting an item closes the popover by
  // returning focus to the trigger, not blurring it — so nothing re-runs
  // validation afterward. Without this, a field that got touched+invalid
  // from any earlier blur (e.g. the open/close guard below) stays showing
  // invalid even after a valid selection, until some later unrelated blur
  // happens to fire. Explicitly re-validating right after the value changes
  // closes that gap regardless of blur timing.
  const handleSelect = useCallback(
    (value: string) => {
      field.handleChange(value === field.state.value ? "" : value);
      field.handleBlur();
      setOpen(false);
    },
    [field]
  );

  // Opening the popover auto-focuses `CommandInput`, which blurs this
  // trigger before the user has picked anything — a native `onBlur` wired
  // straight to `field.handleBlur` would mark the field touched (and, if
  // required/empty, invalid) the instant it's opened. Only treat it as a
  // real blur once the popover isn't open.
  const handleTriggerBlur = useCallback(() => {
    if (!open) {
      field.handleBlur();
    }
  }, [field, open]);

  return (
    <FormBase {...props}>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-invalid={isInvalid}
            className="w-full justify-between font-normal"
            disabled={disabled}
            id={field.name}
            onBlur={handleTriggerBlur}
            role="combobox"
            variant="outline"
          >
            {selected ? (
              selected.label
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <AppIcons.Directional.ChevronsUpDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <ComboboxListItem
                    isSelected={field.state.value === opt.value}
                    key={opt.value}
                    label={opt.label}
                    onSelect={handleSelect}
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
