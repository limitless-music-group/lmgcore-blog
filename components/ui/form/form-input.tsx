import type { ChangeEvent } from "react";
import { useCallback } from "react";
import { Input } from "../input";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export function FormInput({
  placeholder,
  type,
  disabled,
  ...props
}: FormControlProps & {
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value),
    [field]
  );

  return (
    <FormBase {...props}>
      <Input
        aria-invalid={isInvalid}
        disabled={disabled}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        value={field.state.value}
      />
    </FormBase>
  );
}
