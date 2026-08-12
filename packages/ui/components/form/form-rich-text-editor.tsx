"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect } from "react";
import { cn } from "tailwind-variants";
import { AppIcons } from "../app-icons";
import { Toggle } from "../toggle";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

interface ToolbarProps {
  editor: ReturnType<typeof useEditor>;
}

function Toolbar({ editor }: ToolbarProps) {
  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);
  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);
  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);
  const toggleHeading = useCallback(() => {
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  }, [editor]);
  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);
  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-0.5 rounded-t-md border border-input border-b-0 bg-muted/40 p-1">
      <Toggle
        aria-label="Bold"
        data-state={editor.isActive("bold") ? "on" : "off"}
        onPressedChange={toggleBold}
        pressed={editor.isActive("bold")}
        size="default"
        variant="outline"
      >
        <AppIcons.Text.Bold className="size-4" />
      </Toggle>
      <Toggle
        aria-label="Italic"
        data-state={editor.isActive("italic") ? "on" : "off"}
        onPressedChange={toggleItalic}
        pressed={editor.isActive("italic")}
        size="default"
        variant="outline"
      >
        <AppIcons.Text.Italic className="size-4" />
      </Toggle>
      <Toggle
        aria-label="Strikethrough"
        data-state={editor.isActive("strike") ? "on" : "off"}
        onPressedChange={toggleStrike}
        pressed={editor.isActive("strike")}
        size="sm"
      >
        <AppIcons.Text.Strikethrough className="size-3.5" />
      </Toggle>
      <Toggle
        aria-label="Heading"
        data-state={editor.isActive("heading", { level: 2 }) ? "on" : "off"}
        onPressedChange={toggleHeading}
        pressed={editor.isActive("heading", { level: 2 })}
        size="sm"
      >
        <AppIcons.Text.Heading2 className="size-3.5" />
      </Toggle>
      <Toggle
        aria-label="Bullet list"
        data-state={editor.isActive("bulletList") ? "on" : "off"}
        onPressedChange={toggleBulletList}
        pressed={editor.isActive("bulletList")}
        size="sm"
      >
        <AppIcons.Text.List className="size-3.5" />
      </Toggle>
      <Toggle
        aria-label="Ordered list"
        data-state={editor.isActive("orderedList") ? "on" : "off"}
        onPressedChange={toggleOrderedList}
        pressed={editor.isActive("orderedList")}
        size="sm"
      >
        <AppIcons.Text.ListOrdered className="size-3.5" />
      </Toggle>
    </div>
  );
}

export function FormRichTextEditor({
  placeholder = "Write something...",
  minHeight = 160,
  ...props
}: FormControlProps & { placeholder?: string; minHeight?: number }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const editor = useEditor({
    content: field.state.value ?? "",
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    onBlur() {
      field.handleBlur();
    },
    onUpdate({ editor: e }) {
      field.handleChange(e.getHTML());
    },
  });

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (!editor) {
      return;
    }
    const current = editor.getHTML();
    if (field.state.value !== current) {
      editor.commands.setContent(field.state.value ?? "");
    }
  }, [field.state.value, editor]);

  return (
    <FormBase {...props}>
      <div
        className={cn(
          "rounded-md border border-input transition-colors",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          isInvalid && "border-destructive ring-2 ring-destructive/20"
        )}
      >
        <Toolbar editor={editor} />
        <EditorContent
          className={cn(
            "[&_.tiptap]:px-3 [&_.tiptap]:py-2 [&_.tiptap]:text-sm",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:float-left",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:h-0",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground",
            "[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
            "[&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5",
            "[&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5",
            "[&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:text-lg"
          )}
          editor={editor}
          id={field.name}
          style={{ minHeight }}
        />
      </div>
    </FormBase>
  );
}
