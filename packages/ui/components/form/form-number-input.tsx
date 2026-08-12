import type { ChangeEvent } from "react";
import { useCallback } from "react";
import { AppIcons } from "../app-icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../input-group";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export function FormNumberInput({
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  placeholder = "0",
  ...props
}: FormControlProps & {
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}) {
  const field = useFieldContext<number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const increment = useCallback(() => {
    field.handleChange(Math.min(max, (field.state.value ?? 0) + step));
  }, [field, max, step]);

  const decrement = useCallback(() => {
    field.handleChange(Math.max(min, (field.state.value ?? 0) - step));
  }, [field, min, step]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.valueAsNumber;
      if (!Number.isNaN(val)) {
        field.handleChange(val);
      }
    },
    [field]
  );

  return (
    <FormBase {...props}>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupButton
            disabled={field.state.value <= min}
            onClick={decrement}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <AppIcons.OneOff.Minus />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          aria-invalid={isInvalid}
          className="text-center"
          id={field.name}
          max={max}
          min={min}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={handleChange}
          placeholder={placeholder}
          step={step}
          type="number"
          value={field.state.value ?? ""}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            disabled={field.state.value >= max}
            onClick={increment}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <AppIcons.Common.Plus />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </FormBase>
  );
}
