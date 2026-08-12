"use client";

import { format } from "date-fns";
import { useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";
import { AppIcons } from "../app-icons";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Separator } from "../separator";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

function getDisplayText(value?: DateRange): string | null {
  if (value?.from && value?.to) {
    return `${format(value.from, "PP")} – ${format(value.to, "PP")}`;
  }
  if (value?.from) {
    return format(value.from, "PP");
  }
  return null;
}

export function FormDateRangePicker({
  placeholder = "Pick a date range",
  ...props
}: FormControlProps & { placeholder?: string }) {
  const field = useFieldContext<DateRange | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) {
        setDraft(field.state.value);
      }
      setOpen(next);
    },
    [field]
  );

  const handleApply = useCallback(() => {
    field.handleChange(draft);
    setOpen(false);
  }, [draft, field]);

  const handleReset = useCallback(() => {
    setDraft(undefined);
    field.handleChange(undefined);
    setOpen(false);
  }, [field]);

  const displayText = getDisplayText(field.state.value);

  return (
    <FormBase {...props}>
      <Popover onOpenChange={handleOpenChange} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-invalid={isInvalid}
            className="w-full justify-start font-normal"
            id={field.name}
            onBlur={field.handleBlur}
            variant="outline"
          >
            <AppIcons.OneOff.Calendar className="mr-2 size-4 text-muted-foreground" />
            {displayText ?? (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            numberOfMonths={2}
            onSelect={setDraft}
            selected={draft}
          />
          <Separator />
          <div className="flex items-center justify-between gap-2 p-3">
            <Button
              onClick={handleReset}
              size="sm"
              type="button"
              variant="ghost"
            >
              Reset
            </Button>
            <Button
              disabled={!draft?.from}
              onClick={handleApply}
              size="sm"
              type="button"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}
