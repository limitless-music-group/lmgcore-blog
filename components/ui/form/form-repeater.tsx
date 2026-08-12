import type { ReactNode } from "react";
import { useCallback } from "react";
import { AppIcons } from "../app-icons";
import { Button } from "../button";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../field";
import { ScrollArea } from "../scroll-area";

function RepeaterRow({
  index,
  onRemove,
  renderItem,
}: {
  index: number;
  onRemove: (index: number) => void;
  renderItem: (index: number) => ReactNode;
}) {
  const handleRemove = useCallback(() => onRemove(index), [onRemove, index]);

  return (
    <div className="relative rounded-lg border bg-muted/20 p-4 pr-12">
      <div className="space-y-3">{renderItem(index)}</div>
      <Button
        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
        onClick={handleRemove}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <AppIcons.Common.Trash className="size-4" />
        <span className="sr-only">Remove item</span>
      </Button>
    </div>
  );
}

interface FormRepeaterProps<T> {
  addLabel?: string;
  description?: string;
  /** Disables the Add button (e.g. a seat/row cap was reached). Removing a row
   * stays enabled — that's how the user gets back under the cap. */
  disabled?: boolean;
  items: T[];
  label: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (index: number) => ReactNode;
  /** When set, the item list scrolls within this height instead of growing
   * unbounded — the Add button stays put below it, outside the scroll. */
  scrollAreaClassName?: string;
}

export function FormRepeater<T>({
  addLabel = "Add item",
  description,
  items,
  label,
  onAdd,
  onRemove,
  renderItem,
  disabled = false,
  scrollAreaClassName,
}: FormRepeaterProps<T>) {
  const rows = (
    <div className="space-y-3">
      {items.map((_, index) => (
        <RepeaterRow
          index={index}
          // biome-ignore lint/suspicious/noArrayIndexKey: items are generic and have no stable identity; caller supplies no key extractor.
          key={`repeater-item-${index}`}
          onRemove={onRemove}
          renderItem={renderItem}
        />
      ))}
    </div>
  );

  return (
    <Field>
      <FieldContent>
        <FieldLabel>{label}</FieldLabel>
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
      </FieldContent>

      <div className="space-y-3">
        {scrollAreaClassName ? (
          <ScrollArea className={scrollAreaClassName}>
            <div className="pr-3">{rows}</div>
          </ScrollArea>
        ) : (
          rows
        )}

        <Button
          className="w-full"
          disabled={disabled}
          onClick={onAdd}
          type="button"
          variant="outline"
        >
          <AppIcons.Common.Plus className="mr-2 size-4" />
          {addLabel}
        </Button>
      </div>
    </Field>
  );
}
