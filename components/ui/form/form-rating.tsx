"use client";

import { useCallback, useState } from "react";
import { cn } from "tailwind-variants";
import { AppIcons } from "../app-icons";
import { Button } from "../button";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

/** One star — memoizes its click/hover handlers against its own value
 * instead of recreating closures in the parent's `.map()`. */
function RatingStar({
  filled,
  onHover,
  onSelect,
  selected,
  starValue,
}: {
  filled: boolean;
  onHover: (value: number) => void;
  onSelect: (value: number) => void;
  selected: boolean;
  starValue: number;
}) {
  const handleClick = useCallback(
    () => onSelect(starValue),
    [onSelect, starValue]
  );
  const handleMouseEnter = useCallback(
    () => onHover(starValue),
    [onHover, starValue]
  );

  return (
    <Button
      aria-checked={selected}
      aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
      className={cn(
        "rounded-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        filled ? "text-yellow-400" : "text-muted-foreground/40"
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      type="button"
    >
      <AppIcons.OneOff.Star
        className="size-6"
        fill={filled ? "currentColor" : "none"}
      />
    </Button>
  );
}

export function FormRating({
  max = 5,
  ...props
}: FormControlProps & { max?: number }) {
  const field = useFieldContext<number>();
  const [hovered, setHovered] = useState<number | null>(null);

  const display = hovered ?? field.state.value ?? 0;

  const handleSelect = useCallback(
    (starValue: number) =>
      field.handleChange(field.state.value === starValue ? 0 : starValue),
    [field]
  );
  const handleMouseLeave = useCallback(() => setHovered(null), []);

  return (
    <FormBase {...props}>
      <div
        className="flex gap-1"
        onMouseLeave={handleMouseLeave}
        role="radiogroup"
      >
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          return (
            <RatingStar
              filled={starValue <= display}
              key={starValue}
              onHover={setHovered}
              onSelect={handleSelect}
              selected={field.state.value === starValue}
              starValue={starValue}
            />
          );
        })}
      </div>
    </FormBase>
  );
}
