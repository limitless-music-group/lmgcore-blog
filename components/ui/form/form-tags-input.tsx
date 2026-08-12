"use client";

import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { cn } from "tailwind-variants";
import { AppIcons } from "../app-icons";
import { Button } from "../button";
import { Label } from "../label";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

/** One removable tag chip — memoizes its remove handler against its own
 * value instead of recreating a closure in the parent's `.map()`. */
function TagChip({
  disabled,
  onRemove,
  tag,
}: {
  disabled: boolean;
  onRemove: (tag: string) => void;
  tag: string;
}) {
  const handleRemove = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onRemove(tag);
    },
    [onRemove, tag]
  );

  return (
    <Button
      className="gap-1 pr-1 opacity-60 hover:opacity-100"
      disabled={disabled}
      onClick={handleRemove}
      variant="secondary"
    >
      {tag}
      <AppIcons.Common.X className="size-3" />
    </Button>
  );
}

export function FormTagsInput({
  placeholder = "Add tag...",
  delimiter = "Enter",
  disabled = false,
  ...props
}: FormControlProps & {
  placeholder?: string;
  delimiter?: string;
  disabled?: boolean;
}) {
  const field = useFieldContext<string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = field.state.value ?? [];

  const addTag = useCallback(
    (raw: string) => {
      const tag = raw.trim();
      if (tag && !tags.includes(tag)) {
        field.handleChange([...tags, tag]);
      }
      setInputValue("");
    },
    [field, tags]
  );

  const removeTag = useCallback(
    (tag: string) => {
      field.handleChange(tags.filter((t) => t !== tag));
    },
    [field, tags]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === delimiter) {
        e.preventDefault();
        addTag(inputValue);
      }
      if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        const last = tags.at(-1);
        if (last) {
          removeTag(last);
        }
      }
    },
    [addTag, delimiter, inputValue, removeTag, tags]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value),
    []
  );

  const handleInputBlur = useCallback(
    (_e: FocusEvent<HTMLInputElement>) => {
      if (inputValue) {
        addTag(inputValue);
      }
      field.handleBlur();
    },
    [addTag, field, inputValue]
  );

  return (
    <FormBase {...props}>
      {/* A <label> associated with the text input is natively click- and
          keyboard-activatable — clicking anywhere in the chip row focuses
          the input without a custom onClick/onKeyDown handler. */}
      <Label
        className={cn(
          "flex min-h-9 w-full flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          isInvalid && "border-destructive ring-2 ring-destructive/20",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
        )}
        htmlFor={field.name}
      >
        {tags.map((tag) => (
          <TagChip
            disabled={disabled}
            key={tag}
            onRemove={removeTag}
            tag={tag}
          />
        ))}
        <input
          aria-invalid={isInvalid}
          className="min-w-24 flex-1 bg-transparent outline-none"
          disabled={disabled}
          id={field.name}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          value={inputValue}
        />
      </Label>
    </FormBase>
  );
}
