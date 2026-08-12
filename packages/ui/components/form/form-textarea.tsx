import type { ChangeEvent } from "react";
import { useCallback } from "react";
import { Textarea } from "../textarea";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export function FormTextarea({
  placeholder,
  disabled,
  className,
  ...props
}: FormControlProps & {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => field.handleChange(e.target.value),
    [field]
  );

  return (
    <FormBase {...props}>
      <Textarea
        aria-invalid={isInvalid}
        className={className}
        disabled={disabled}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        value={field.state.value}
      />
    </FormBase>
  );
}
