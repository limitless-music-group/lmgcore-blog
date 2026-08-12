"use client";

import type { ChangeEvent } from "react";
import { useCallback, useRef } from "react";
import { cn } from "tailwind-variants";
import { Input } from "../input";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

const hexRegex = /^#[0-9a-fA-F]{6}$/;
function isValidHex(val: string) {
  return hexRegex.test(val);
}

export function FormColorPicker(props: FormControlProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const nativeRef = useRef<HTMLInputElement>(null);

  const value = field.state.value ?? "#000000";

  const handleSwatchClick = useCallback(() => nativeRef.current?.click(), []);

  const handleNativeColorChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value),
    [field]
  );

  const handleHexInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.startsWith("#")
        ? e.target.value
        : `#${e.target.value}`;
      field.handleChange(raw);
    },
    [field]
  );

  return (
    <FormBase {...props}>
      <div className="flex items-center gap-2">
        <button
          aria-label="Open color picker"
          className={cn(
            "size-9 shrink-0 rounded-md border border-input shadow-sm transition-shadow hover:ring-2 hover:ring-ring hover:ring-offset-2",
            isInvalid && "border-destructive"
          )}
          onClick={handleSwatchClick}
          style={{ backgroundColor: isValidHex(value) ? value : "#000000" }}
          type="button"
        >
          <input
            className="sr-only"
            id={field.name}
            onBlur={field.handleBlur}
            onChange={handleNativeColorChange}
            ref={nativeRef}
            tabIndex={-1}
            type="color"
            value={value}
          />
        </button>
        <Input
          aria-invalid={isInvalid}
          className="font-mono uppercase"
          maxLength={7}
          onBlur={field.handleBlur}
          onChange={handleHexInputChange}
          placeholder="#000000"
          value={value}
        />
      </div>
    </FormBase>
  );
}
