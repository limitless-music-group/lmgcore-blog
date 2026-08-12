"use client";

import { MiB } from "effect/FileSystem";
import type { ChangeEvent, DragEvent, MouseEvent } from "react";
import { useCallback, useState } from "react";
import { cn } from "tailwind-variants";
import { AppIcons } from "../app-icons";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

/** One picked file — its own component so the remove handler can be
 * memoized against the file's own identity instead of recreated in the
 * parent's `.map()`. */
function FileListItem({
  file,
  onRemove,
}: {
  file: File;
  onRemove: (file: File) => void;
}) {
  const handleRemove = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onRemove(file);
    },
    [file, onRemove]
  );

  return (
    <li className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
      <span className="truncate text-muted-foreground">{file.name}</span>
      <Button
        className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={handleRemove}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <AppIcons.Common.X className="size-3.5" />
      </Button>
    </li>
  );
}

export function FormFileUpload({
  accept,
  multiple = false,
  maxSizeMb = 10,
  ...props
}: FormControlProps & {
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
}) {
  const field = useFieldContext<File[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [dragging, setDragging] = useState(false);

  const files = field.state.value ?? [];

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) {
        return;
      }
      const valid = Array.from(incoming).filter(
        (f) => f.size <= Number(MiB(maxSizeMb))
      );
      field.handleChange(multiple ? [...files, ...valid] : valid.slice(0, 1));
    },
    [field, files, maxSizeMb, multiple]
  );

  const removeFile = useCallback(
    (target: File) => {
      field.handleChange(files.filter((f) => f !== target));
    },
    [field, files]
  );

  const handleDragLeave = useCallback(() => setDragging(false), []);
  const handleDragOver = useCallback((e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  const handleDrop = useCallback(
    (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files),
    [handleFiles]
  );

  return (
    <FormBase {...props}>
      {/* A <label> associated with the hidden file input is natively
          click- and keyboard-activatable — no custom onClick/onKeyDown
          needed to open the picker. The drag handlers are a progressive
          enhancement on top of that already-accessible baseline; there's
          no more semantically-correct element for a drop target. */}
      <Label
        aria-invalid={isInvalid}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-input border-dashed p-8 text-center transition-colors",
          dragging && "border-primary bg-primary/5",
          isInvalid && "border-destructive",
          "cursor-pointer hover:border-primary hover:bg-muted/30"
        )}
        htmlFor={field.name}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Input
          accept={accept}
          className="sr-only"
          id={field.name}
          multiple={multiple}
          onBlur={field.handleBlur}
          onChange={handleInputChange}
          type="file"
        />
        <AppIcons.Common.Upload className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">
            Drop files here or{" "}
            <span className="text-primary underline underline-offset-2">
              browse
            </span>
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            Max {maxSizeMb}MB per file
            {/* {accept ? ` · ${accept}` : null} */}
          </p>
        </div>
      </Label>

      {files.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {files.map((file) => (
            <FileListItem
              file={file}
              key={`${file.name}-${file.lastModified}-${file.size}`}
              onRemove={removeFile}
            />
          ))}
        </ul>
      ) : null}
    </FormBase>
  );
}
