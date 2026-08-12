"use client";

import { MiB } from "effect/FileSystem";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export interface PresignedUploadResult {
  key: string;
  url: string;
}

export interface UsePresignedImageUploadConfig {
  /** Presign action — resolves a PUT url + storage key for the file. */
  getUploadUrl: (args: {
    contentType: string;
    name: string;
    size: number;
  }) => Promise<PresignedUploadResult>;
  maxSizeMb: number;
  messages: { error: string; loading: string; success: string };
  /** Fire-and-forget cleanup for a url no longer referenced (a previous
   * value being replaced, or an explicit `remove`) — the caller decides
   * whether/how to actually discard it (e.g. only when it isn't the
   * last-committed value a record still points at). */
  onDiscard?: (url: string) => void;
  /** Called with the new public CDN url once a pick finishes uploading. */
  onUploaded: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  /** PUTs the file to the presigned url with progress reporting. Injected
   * rather than imported so this hook (and anything built on it, like
   * `FormImageUpload`) has no direct `@/packages/storage` dependency — see
   * `@/packages/storage/upload-with-progress`'s `putWithProgress` for the
   * real implementation every current caller passes. */
  putFile: (
    url: string,
    file: File,
    onProgress: (percent: number) => void
  ) => Promise<void>;
  /** Derives the public CDN url for a stored object key, or `null` if asset
   * serving isn't configured. Injected for the same reason as `putFile` —
   * see `@/packages/storage/r2/implementations/public-object-url.effect`'s
   * `publicObjectUrl` for the real implementation. */
  resolvePublicUrl: (key: string) => string | null;
}

/**
 * usePresignedImageUpload — the presigned direct-to-object-storage upload
 * engine: presign → PUT-with-progress → resolve the public CDN url →
 * report, plus a size guard and a loading/success/error toast lifecycle.
 * Shared by `FormImageUpload` (./form/form-image-upload.tsx, the
 * `field.ImageUpload` adapter) and apps/app's `EntityImageUploadButton` —
 * both previously re-implemented this same sequence by hand. Neither
 * `@/packages/storage` primitive is imported here; `putFile`/
 * `resolvePublicUrl` are injected (matching `field.Slug`'s
 * `checkAvailability` pattern), which is what lets this hook — and
 * `FormImageUpload`, which calls it internally — live in the
 * framework-agnostic `packages/ui` package with zero `@/packages/storage`
 * imports of its own.
 *
 * Picking a new file and explicitly removing the current one are kept as
 * two separate concerns: `pick` reports the new url through `onUploaded`
 * (and discards whatever `previousValue` was passed, if any); `remove` only
 * runs the discard side effect for `currentValue` — it does NOT also call
 * `onUploaded("")`, since "clearing the value" is a differently-shaped
 * operation per caller (`field.handleChange("")` for a form field vs. a
 * dedicated no-arg `onRemoveAction()` for `EntityImageUploadButton`).
 * Callers are expected to call their own clear-callback alongside `remove`.
 */
export function usePresignedImageUpload({
  getUploadUrl,
  maxSizeMb,
  messages,
  onDiscard,
  onUploaded,
  onUploadingChange,
  putFile,
  resolvePublicUrl,
}: UsePresignedImageUploadConfig) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pick = useCallback(
    async (file: File | undefined, previousValue: string) => {
      if (!file) {
        return;
      }
      if (file.size > Number(MiB(maxSizeMb))) {
        toast.error(`Image must be under ${maxSizeMb} MB`);
        return;
      }

      setUploading(true);
      onUploadingChange?.(true);
      setProgress(0);
      const toastId = toast.loading(messages.loading);
      try {
        const { url, key } = await getUploadUrl({
          contentType: file.type,
          name: file.name,
          size: file.size,
        });
        await putFile(url, file, setProgress);
        const publicUrl = resolvePublicUrl(key);
        if (!publicUrl) {
          throw new Error("Asset serving is not configured");
        }
        onUploaded(publicUrl);
        if (previousValue) {
          onDiscard?.(previousValue);
        }
        toast.success(messages.success, { id: toastId });
      } catch (error) {
        const message = error instanceof Error ? error.message : messages.error;
        toast.error(message, { id: toastId });
      } finally {
        setUploading(false);
        onUploadingChange?.(false);
      }
    },
    [
      getUploadUrl,
      maxSizeMb,
      messages,
      onDiscard,
      onUploaded,
      onUploadingChange,
      putFile,
      resolvePublicUrl,
    ]
  );

  const remove = useCallback(
    (currentValue: string) => {
      if (currentValue) {
        onDiscard?.(currentValue);
      }
    },
    [onDiscard]
  );

  return { pick, progress, remove, uploading };
}
