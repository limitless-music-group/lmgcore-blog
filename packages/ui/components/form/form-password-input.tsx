import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { AppIcons } from "../app-icons";
import { Button } from "../button";
import { Input } from "../input";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export function FormPasswordInput({
  placeholder = "••••••••",
  ...props
}: FormControlProps & { placeholder?: string }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [show, setShow] = useState(false);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value),
    [field]
  );

  const handleToggleShow = useCallback(() => setShow((s) => !s), []);

  return (
    <FormBase {...props}>
      <div className="relative">
        <Input
          aria-invalid={isInvalid}
          className="pr-10"
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={handleChange}
          placeholder={placeholder}
          type={show ? "text" : "password"}
          value={field.state.value}
        />
        <Button
          className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={handleToggleShow}
          size="icon-sm"
          tabIndex={-1}
          type="button"
          variant="ghost"
        >
          {show ? (
            <AppIcons.OneOff.EyeOff className="size-4" />
          ) : (
            <AppIcons.OneOff.Eye className="size-4" />
          )}
          <span className="sr-only">{show ? "Hide" : "Show"} password</span>
        </Button>
      </div>
    </FormBase>
  );
}
