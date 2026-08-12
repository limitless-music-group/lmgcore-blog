import { useCallback } from "react";
import { Switch } from "../switch";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export function FormSwitch(props: FormControlProps) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const handleCheckedChange = useCallback(
    (checked: boolean) => field.handleChange(checked === true),
    [field]
  );

  return (
    <FormBase controlFirst horizontal {...props}>
      <Switch
        aria-invalid={isInvalid}
        checked={field.state.value}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onCheckedChange={handleCheckedChange}
      />
    </FormBase>
  );
}
