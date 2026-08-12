"use client";

import { cn } from "tailwind-variants";
import { Button } from "@/packages/ui/components/button";
import { Spinner } from "@/packages/ui/components/spinner";

export interface SaveBarProps {
  className?: string;
  /** Whether there are unsaved changes — drives the message and enables actions. */
  dirty: boolean;
  /** Copy overrides for non-settings contexts. */
  dirtyMessage?: string;
  discardLabel?: string;
  onDiscard: () => void;
  onSave: () => void;
  savedMessage?: string;
  saveLabel?: string;
  /** In-flight save — disables both actions and shows a spinner on Save. */
  saving?: boolean;
}

/**
 * SaveBar — a sticky footer that announces unsaved changes and offers
 * Discard / Save. Stays disabled until `dirty`. Save callbacks are plain
 * handlers (type="button"), so it drops into a tanstack form (onSave =>
 * form.handleSubmit) or any local dirty-state editor alike.
 */
export function SaveBar({
  dirty,
  saving = false,
  onSave,
  onDiscard,
  dirtyMessage = "You have unsaved changes.",
  savedMessage = "All changes saved.",
  saveLabel = "Save changes",
  discardLabel = "Discard",
  className,
}: SaveBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-4 flex items-center justify-between gap-3 rounded-xl border bg-background/80 px-4 py-3 shadow-lg backdrop-blur",
        className
      )}
    >
      <p className="text-muted-foreground text-sm">
        {
          // biome-ignore lint/suspicious/noLeakedRender: dirtyMessage/savedMessage are defaulted string props, not leak-prone types.
          dirty ? dirtyMessage : savedMessage
        }
      </p>
      <div className="flex items-center gap-2">
        <Button
          disabled={!dirty || saving}
          onClick={onDiscard}
          type="button"
          variant="ghost"
        >
          {discardLabel}
        </Button>
        <Button disabled={!dirty || saving} onClick={onSave} type="button">
          {saving ? <Spinner className="size-4" /> : null}
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}
