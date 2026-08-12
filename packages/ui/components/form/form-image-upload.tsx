"use client";

import type { ChangeEvent } from "react";
import { useCallback, useRef } from "react";
import {
  type PresignedUploadResult,
  usePresignedImageUpload,
} from "../../hooks/use-presigned-image-upload";
import { AppIcons } from "../app-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import { Progress } from "../progress";
import { Spinner } from "../spinner";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export interface FormImageUploadMessages {
  error: string;
  hint: string;
  loading: string;
  success: string;
}

/**
 * FormImageUpload — presigned direct-to-R2 image upload backing a string URL
 * form field. Picks an image, PUTs it to a presigned URL with a live
 * progress bar, then writes the resulting public CDN URL onto the field.
 * The engine (presign -> PUT-with-progress -> resolve url -> report) lives in
 * `usePresignedImageUpload` (../../hooks), shared with apps/app's
 * `EntityImageUploadButton` — this component is a thin presentational
 * adapter over it. `getUploadUrl` is the domain-specific presign action;
 * `putFile`/`resolvePublicUrl` are the `@/packages/storage` primitives,
 * injected (not imported) so this framework-agnostic package stays free of
 * a storage-package dependency — every caller passes
 * `putWithProgress`/`publicObjectUrl` straight through.
 */
export function FormImageUpload({
  accept,
  maxSizeMb,
  fallback,
  alt,
  committedValue,
  getUploadUrl,
  messages,
  putFile,
  resolvePublicUrl,
  uploadLabel = "Upload image",
  replaceLabel = "Replace image",
  onDiscardUnsaved,
  onUploadingChange,
  ...props
}: FormControlProps & {
  accept: string;
  maxSizeMb: number;
  /** Initials shown when there's no image yet. */
  fallback: string;
  alt: string;
  /** The last-saved value — the baseline an unsaved replacement is compared
   * against, so `onDiscardUnsaved` doesn't orphan the upload the record still
   * points at. */
  committedValue: string;
  getUploadUrl: (args: {
    contentType: string;
    name: string;
    size: number;
  }) => Promise<PresignedUploadResult>;
  messages: FormImageUploadMessages;
  /** PUTs to a presigned url with progress reporting — pass
   * `putWithProgress` from `@/packages/storage/upload-with-progress`. */
  putFile: (
    url: string,
    file: File,
    onProgress: (percent: number) => void
  ) => Promise<void>;
  /** Derives an object key's public CDN url — pass `publicObjectUrl` from
   * `@/packages/storage/r2/implementations/public-object-url.effect`. */
  resolvePublicUrl: (key: string) => string | null;
  uploadLabel?: string;
  replaceLabel?: string;
  /** Fire-and-forget cleanup for an unsaved upload being replaced/removed. */
  onDiscardUnsaved?: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const field = useFieldContext<string>();
  const { value } = field.state;
  const inputRef = useRef<HTMLInputElement>(null);

  const discardIfUnsaved = useCallback(
    (candidateUrl: string) => {
      if (candidateUrl === committedValue) {
        return;
      }
      onDiscardUnsaved?.(candidateUrl);
    },
    [committedValue, onDiscardUnsaved]
  );

  const { pick, progress, remove, uploading } = usePresignedImageUpload({
    getUploadUrl,
    maxSizeMb,
    messages,
    onDiscard: discardIfUnsaved,
    onUploaded: field.handleChange,
    onUploadingChange,
    putFile,
    resolvePublicUrl,
  });

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      pick(e.target.files?.[0], value);
      e.target.value = "";
    },
    [pick, value]
  );

  const handlePick = useCallback(() => inputRef.current?.click(), []);

  const handleRemove = useCallback(() => {
    remove(value);
    field.handleChange("");
  }, [field, remove, value]);

  const pickLabel = value ? replaceLabel : uploadLabel;

  return (
    <FormBase {...props}>
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage alt={alt} className="rounded-sm" src={value} />
          <AvatarFallback className="rounded-sm text-lg">
            {fallback}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={uploading}
              onClick={handlePick}
              size="sm"
              type="button"
              variant="outline"
            >
              {uploading ? (
                <Spinner className="size-4" />
              ) : (
                <AppIcons.Common.Upload className="size-4" />
              )}
              {pickLabel}
            </Button>
            {value && !uploading ? (
              <Button
                onClick={handleRemove}
                size="sm"
                type="button"
                variant="destructive"
              >
                <AppIcons.Common.X className="size-4" />
                Remove
              </Button>
            ) : null}
          </div>

          {uploading ? (
            <div className="flex items-center gap-2">
              <Progress className="h-1.5 max-w-48" value={progress} />
              <span className="text-muted-foreground text-xs tabular-nums">
                {progress}%
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">{messages.hint}</p>
          )}
        </div>

        <input
          accept={accept}
          className="sr-only"
          onChange={handleInputChange}
          ref={inputRef}
          tabIndex={-1}
          type="file"
        />
      </div>
    </FormBase>
  );
}
