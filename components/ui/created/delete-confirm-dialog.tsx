"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@packages/ui/components/alert-dialog";
import { buttonVariants } from "@packages/ui/components/button";
import { type MouseEvent, useCallback } from "react";

interface DeleteConfirmDialogProps {
  confirmLabel?: string;
  description: string;
  /** Disables actions and shows a pending label while the delete is in flight. */
  loading?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  loading = false,
  confirmLabel = "Delete",
}: DeleteConfirmDialogProps) {
  const handleConfirm = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      onConfirm();
    },
    [onConfirm]
  );

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            disabled={loading}
            onClick={handleConfirm}
          >
            {
              // biome-ignore lint/suspicious/noLeakedRender: confirmLabel is a defaulted string prop, not a leak-prone type.
              loading ? "Deleting…" : confirmLabel
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
