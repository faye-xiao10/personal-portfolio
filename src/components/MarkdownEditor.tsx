import React, { useRef, useState } from "react";
import { Markdown } from "@/components/Markdown";

type Props = {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onUploadImage?: (file: File) => Promise<string>;
};

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end);

  const next =
    textarea.value.slice(0, start) +
    before +
    selected +
    after +
    textarea.value.slice(end);

  const cursorStart = start + before.length;
  const cursorEnd = cursorStart + selected.length;

  textarea.value = next;
  textarea.focus();
  textarea.setSelectionRange(cursorStart, cursorEnd);

  return next;
}

export default function MarkdownEditor({ value, onChange, onUploadImage }: Props) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  function apply(before: string, after = before) {
    const ta = taRef.current;
    if (!ta) return;
    const next = wrapSelection(ta, before, after);
    onChange(next);
  }

  async function handlePickImage(file: File) {
    if (!onUploadImage) return;
    setUploading(true);

    try {
      const url = await onUploadImage(file);
      const snippet = `\n![${file.name}](${url})\n`;
      onChange((prev) => prev + snippet);
      taRef.current?.focus();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`px-3 py-1 rounded border ${mode === "edit" ? "opacity-60" : ""}`}
          onClick={() => setMode("edit")}
          disabled={mode === "edit"}
        >
          Edit
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded border ${mode === "preview" ? "opacity-60" : ""}`}
          onClick={() => setMode("preview")}
          disabled={mode === "preview"}
        >
          Preview
        </button>

        <span className="w-3" />

        <button type="button" className="px-3 py-1 rounded border" onClick={() => apply("**", "**")}>
          Bold
        </button>
        <button type="button" className="px-3 py-1 rounded border" onClick={() => apply("*", "*")}>
          Italic
        </button>
        <button type="button" className="px-3 py-1 rounded border" onClick={() => apply("`", "`")}>
          Code
        </button>
        <button type="button" className="px-3 py-1 rounded border" onClick={() => apply("\n- ", "")}>
          List
        </button>

        <button
          type="button"
          className="px-3 py-1 rounded border"
          onClick={() => onChange((prev) => prev + "\n[link text](https://)\n")}
        >
          Link
        </button>

        <button
          type="button"
          className="px-3 py-1 rounded border"
          onClick={() => fileRef.current?.click()}
          disabled={!onUploadImage || uploading}
        >
          {uploading ? "Uploading…" : "Image"}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handlePickImage(f);
          }}
        />
      </div>

      {mode === "edit" ? (
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={18}
          className="w-full rounded border p-3 bg-transparent"
          placeholder="Write markdown…"
        />
      ) : (
        <div className="rounded border p-4">
          <Markdown content={value} />
        </div>
      )}
    </div>
  );
}
