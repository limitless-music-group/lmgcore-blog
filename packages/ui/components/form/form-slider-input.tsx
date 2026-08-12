import { useCallback } from "react";
import { Slider } from "../slider";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export function FormSliderInput({
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  formatValue,
  ...props
}: FormControlProps & {
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}) {
  const field = useFieldContext<number>();

  const display = showValue
    ? (formatValue?.(field.state.value) ?? String(field.state.value))
    : null;

  const handleValueChange = useCallback(
    ([val = min]: number[]) => field.handleChange(val),
    [field, min]
  );

  return (
    <FormBase {...props}>
      <div className="flex items-center gap-3">
        <Slider
          className="flex-1"
          max={max}
          min={min}
          onBlur={field.handleBlur}
          onValueChange={handleValueChange}
          step={step}
          value={[field.state.value ?? min]}
        />
        {display ? (
          <span className="w-10 shrink-0 text-right text-muted-foreground text-sm tabular-nums">
            {display}
          </span>
        ) : null}
      </div>
      <div className="flex justify-between text-muted-foreground text-xs">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </FormBase>
  );
}
