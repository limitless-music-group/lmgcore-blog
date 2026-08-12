"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packages/ui/components/select";
import { useMemo } from "react";

interface TimezoneProps {
  defaultValue?: string;
  onValueChange?: (timezone: string) => void;
  value?: string;
}

const regex = /GMT([+-]?)(\d+)(?::(\d+))?/;
export default function Timezone({
  value,
  onValueChange,
  defaultValue,
}: TimezoneProps) {
  const timezones = Intl.supportedValuesOf("timeZone");

  const formattedTimezones = useMemo(
    () =>
      timezones
        .map((timezone) => {
          const formatter = new Intl.DateTimeFormat("en", {
            timeZone: timezone,
            timeZoneName: "shortOffset",
          });
          const parts = formatter.formatToParts(new Date());
          const offset =
            parts.find((part) => part.type === "timeZoneName")?.value || "";
          const modifiedOffset = offset === "GMT" ? "GMT+0" : offset;

          const offsetMatch = offset.match(regex);
          const sign = offsetMatch?.[1] === "-" ? -1 : 1;
          const hours = Number.parseInt(offsetMatch?.[2] || "0", 10);
          const minutes = Number.parseInt(offsetMatch?.[3] || "0", 10);
          const totalMinutes = sign * (hours * 60 + minutes);

          return {
            label: `(${modifiedOffset}) ${timezone.replace(/_/g, " ")}`,
            numericOffset: totalMinutes,
            value: timezone,
          };
        })
        .sort((a, b) => a.numericOffset - b.numericOffset),
    [timezones]
  );

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const defaultTz = defaultValue ?? userTimezone;

  return (
    <Select
      defaultValue={value === undefined ? defaultTz : undefined}
      onValueChange={onValueChange}
      value={value}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select timezone..." />
      </SelectTrigger>
      <SelectContent className="max-h-60" position="popper">
        {formattedTimezones.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
