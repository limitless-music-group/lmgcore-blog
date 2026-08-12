import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export interface RadioOption {
  label: string;
  value: string;
}

export function FormRadioGroup({
  options,
  ...props
}: FormControlProps & { options: RadioOption[] }) {
  const field = useFieldContext<string>();

  return (
    <FormBase {...props}>
      <RadioGroup
        id={field.name}
        onBlur={field.handleBlur}
        onValueChange={field.handleChange}
        value={field.state.value}
      >
        {options.map((opt) => (
          <div className="flex items-center gap-2" key={opt.value}>
            <RadioGroupItem
              className="cursor-pointer"
              id={`${field.name}-${opt.value}`}
              value={opt.value}
            />
            <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </FormBase>
  );
}
