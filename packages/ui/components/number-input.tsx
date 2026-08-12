import type { ChangeEvent, ComponentProps } from "react";
import { useCallback } from "react";
import { cn } from "tailwind-variants";
import { Input } from "./input";

export function NumberInput({
  onChange,
  value,
  ...props
}: Omit<ComponentProps<typeof Input>, "type" | "onChange" | "value"> & {
  onChange: (value: number | null) => void;
  value: undefined | null | number;
}) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const number = e.target.valueAsNumber;
      onChange(Number.isNaN(number) ? null : number);
    },
    [onChange]
  );

  return (
    <Input
      {...props}
      onChange={handleChange}
      type="number"
      value={value ?? ""}
    />
  );
}

export function InputGroupNumberInput({
  className,
  ...props
}: ComponentProps<typeof NumberInput>) {
  return (
    <NumberInput
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      data-slot="input-group-control"
      {...props}
    />
  );
}
