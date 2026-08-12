import { type ReactNode, useCallback, useState } from "react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../select";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export function FormSelect({
  children,
  ...props
}: FormControlProps & { children: ReactNode }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [open, setOpen] = useState(false);

  // Opening the listbox moves focus onto the highlighted item, which blurs
  // this trigger before the user has picked anything — a native `onBlur`
  // wired straight to `field.handleBlur` would mark the field touched (and,
  // if required/empty, invalid) the instant it's opened. Only treat it as a
  // real blur once the listbox isn't open.
  const handleTriggerBlur = useCallback(() => {
    if (!open) {
      field.handleBlur();
    }
  }, [field, open]);

  // This form only validates on blur/submit (no `onChange` validator — see
  // use-onboarding.ts), and selecting an item closes the listbox by
  // returning focus to the trigger, not blurring it — so nothing re-runs
  // validation afterward. Without this, a field that got touched+invalid
  // from any earlier blur (e.g. the open/close above) stays showing invalid
  // even after a valid selection, until some later unrelated blur happens to
  // fire. Explicitly re-validating right after the value changes closes that
  // gap regardless of blur timing.
  const handleValueChange = useCallback(
    (value: string) => {
      field.handleChange(value);
      field.handleBlur();
    },
    [field]
  );

  return (
    <FormBase {...props}>
      <Select
        defaultValue={field.state.value}
        onOpenChange={setOpen}
        onValueChange={handleValueChange}
        open={open}
        value={field.state.value}
      >
        <SelectTrigger
          aria-invalid={isInvalid}
          id={field.name}
          onBlur={handleTriggerBlur}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">{children}</SelectContent>
      </Select>
    </FormBase>
  );
}
