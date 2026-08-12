import { useId } from "react";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../field";
import { Input } from "../input";
import type { FormControlProps } from "./form-base";

/**
 * FormLockedField — a read-only "permanent value" display (org name/slug/id,
 * etc.). Deliberately does not route through `FormBase`: that component
 * unconditionally calls `useFieldContext()`, which only resolves inside a
 * `fieldComponent` rendered via `form.AppField` — this is a `formComponent`
 * (see `hooks.tsx`'s `formComponents` map), rendered directly under
 * `form.AppForm` with no field context to read. A locked value also has no
 * validation state (isTouched/isValid/errors) to show, so there's nothing
 * `FormBase`'s field-derived bits would add here anyway.
 */
export function FormLockedField({
  value,
  prefix,
  label,
  description,
}: FormControlProps & {
  value: string;
  prefix?: string;
  controlFirst?: boolean;
}) {
  const id = useId();
  return (
    <Field className="h-full" orientation="vertical">
          <FieldContent>
            <FieldLabel htmlFor={id}>{label}
            {description ? (
                <FieldDescription>{description}</FieldDescription>
            ) : null}
            </FieldLabel>
            
            </FieldContent>
          <Input
            className="truncate font-mono"
            disabled
            id={id}
            readOnly
            value={prefix ? `${prefix}${value}` : value}
            />
    </Field>
  );
}
