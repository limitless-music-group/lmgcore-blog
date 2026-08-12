"use client";

import { useCallback, useState } from "react";
import { AppIcons } from "../app-icons";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { ScrollArea } from "../scroll-area";
import { Separator } from "../separator";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

function parseTime(val: string): { h: string; m: string } {
  const [h = "00", m = "00"] = val.split(":");
  return { h, m };
}

/** One hour/minute option button — memoizes its click handler against its
 * own value instead of recreating a closure in the parent's `.map()`. */
function TimeOption({
  active,
  onSelect,
  value,
}: {
  active: boolean;
  onSelect: (value: string) => void;
  value: string;
}) {
  const handleClick = useCallback(() => onSelect(value), [onSelect, value]);

  return (
    <button
      className={`w-full rounded-md px-2 py-1.5 text-center text-sm transition-colors hover:bg-accent ${
        active ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
      }`}
      onClick={handleClick}
      type="button"
    >
      {value}
    </button>
  );
}

export function FormTimePicker({
  placeholder = "Pick a time",
  ...props
}: FormControlProps & { placeholder?: string }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string>("");

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) {
        setDraft(field.state.value ?? "");
      }
      setOpen(next);
    },
    [field]
  );

  const { h, m } = parseTime(draft);

  const handleSelectHour = useCallback(
    (hour: string) => setDraft(`${hour}:${m}`),
    [m]
  );
  const handleSelectMinute = useCallback(
    (minute: string) => setDraft(`${h}:${minute}`),
    [h]
  );

  const handleApply = useCallback(() => {
    if (draft) {
      field.handleChange(draft);
    }
    setOpen(false);
  }, [draft, field]);

  const handleReset = useCallback(() => {
    setDraft("");
    field.handleChange("");
    setOpen(false);
  }, [field]);

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
            <AppIcons.OneOff.Clock className="mr-2 size-4 text-muted-foreground" />
            {field.state.value ? (
              field.state.value
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <div className="flex divide-x">
            <ScrollArea className="no-scrollbar h-52 w-24 overflow-y-hidden">
              <div className="px-1">
                {HOURS.map((hour) => (
                  <TimeOption
                    active={h === hour}
                    key={hour}
                    onSelect={handleSelectHour}
                    value={hour}
                  />
                ))}
              </div>
            </ScrollArea>
            <ScrollArea className="no-scrollbar h-52 w-24 overflow-y-hidden">
              <div className="px-1">
                {MINUTES.map((min) => (
                  <TimeOption
                    active={m === min}
                    key={min}
                    onSelect={handleSelectMinute}
                    value={min}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
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
              disabled={!draft}
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
