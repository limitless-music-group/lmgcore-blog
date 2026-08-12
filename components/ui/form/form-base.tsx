import type { ReactNode } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../field";
import { useFieldContext } from "./hooks";

export interface FormControlProps {
  description?: string;
  label?: ReactNode;
}

type FormBaseProps = FormControlProps & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
};

export function FormBase({
  children,
  label,
  description,
  controlFirst,
  horizontal,
}: FormBaseProps) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const labelElement = (
    <>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </>
  );
  // Always-rendered, fixed-height slot: the message swaps into reserved space
  // instead of inserting a new row, so a validation error appearing (or
  // clearing) never shifts the controls below it.
  const errorElem = (
    <div className="min-h-5" data-slot="field-error-slot">
      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </div>
  );

  return (
    <Field
      data-invalid={isInvalid}
      orientation={horizontal ? "horizontal" : undefined}
    >
      {controlFirst ? (
        <>
          {children}
          <FieldContent>
            {labelElement}
            {errorElem}
          </FieldContent>
        </>
      ) : (
        <>
          <FieldContent>{labelElement}</FieldContent>
          {children}
          {errorElem}
        </>
      )}
    </Field>
  );
}
