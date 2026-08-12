"use client";

import { useStore } from "@tanstack/react-form";
import { useCallback } from "react";
import {
  SaveBar as SaveBarPrimitive,
  type SaveBarProps as SaveBarPrimitiveProps,
} from "../created/save-bar";
import { useFormContext } from "./hooks";

type FormSaveBarProps = Omit<
  SaveBarPrimitiveProps,
  "dirty" | "onDiscard" | "onSave" | "saving"
> & {
  /** Defaults to `form.reset()`. */
  onDiscard?: () => void;
  /** Defaults to `form.handleSubmit()`. */
  onSave?: () => void;
};

/**
 * FormSaveBar — `SaveBar` wired straight to the enclosing form's dirty/
 * submitting state, so call sites don't each hand-write a
 * `form.Subscribe(selector => ({isDirty, isSubmitting}))` wrapper. Must be
 * rendered inside `<form.AppForm>` (like any other form-level component) so
 * `useFormContext` resolves.
 */
export function FormSaveBar({ onDiscard, onSave, ...props }: FormSaveBarProps) {
  const form = useFormContext();
  const isDirty = useStore(form.store, (state) => state.isDirty);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  const handleDiscard = useCallback(() => {
    if (onDiscard) {
      onDiscard();
      return;
    }
    form.reset();
  }, [form, onDiscard]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave();
      return;
    }
    form.handleSubmit();
  }, [form, onSave]);

  return (
    <SaveBarPrimitive
      {...props}
      dirty={isDirty}
      onDiscard={handleDiscard}
      onSave={handleSave}
      saving={isSubmitting}
    />
  );
}
