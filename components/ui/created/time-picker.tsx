"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packages/ui/components/select";
import { cn } from "tailwind-variants";

interface TimePickerProps {
  className?: string;
  defaultValue?: string;
  onValueChange?: (time: string) => void;
  value?: string;
}

const pad = (n: number) => n.toString().padStart(2, "0");
const hGreaterThan = (h: number) => (h > 12 ? h - 12 : h);
const to12h = (h: number) => (h === 0 ? 12 : hGreaterThan);
const toAmPm = (h: number) => (h < 12 ? "am" : "pm");

const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  const value = `${pad(hour)}:${pad(minute)}`;
  const label = `${to12h(hour)}:${pad(minute)} ${toAmPm(hour)}`;
  return { label, value };
});

export default function TimePicker({
  value,
  onValueChange,
  defaultValue,
  className,
}: TimePickerProps) {
  return (
    <Select
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
      value={value}
    >
      <SelectTrigger
        className={cn(
          "w-full justify-between font-normal shadow-none",
          className
        )}
      >
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent className="max-h-60" position="popper">
        {TIME_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
