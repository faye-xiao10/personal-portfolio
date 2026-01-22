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

function insertAtCursor(textarea: HTMLTextAreaElement, insert: string) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
  
    const next = textarea.value.slice(0, start) + insert + textarea.value.slice(end);
  
    const cursor = start + insert.length;
    textarea.value = next;
    textarea.focus();
    textarea.setSelectionRange(cursor, cursor);
  
    return next;
  }



function getImageNaturalWidth(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
  
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img.naturalWidth);
      };
  
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to read image dimensions"));
      };
  
      img.src = url;
    });
  }

export default function MarkdownEditor({ value, onChange, onUploadImage }: Props) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  // for quick insert of image when using side-by-side button
  const [insertMode, setInsertMode] =
  useState<"inline" | "table-left" | "table-right">("inline");

  const MAX_IMAGE_WIDTH_PX = 720;


  function apply(before: string, after = before) {
    const ta = taRef.current;
    if (!ta) return;
    const next = wrapSelection(ta, before, after);
    onChange(next);
  }

  function insertTwoColumnTextTemplate() {
    const ta = taRef.current;
    if (!ta) return;
  
    const block =
  `|  |  |
  |---|---|
  | Left column text | Right column text |
  
  `;
  
    const next = insertAtCursor(ta, block);
    onChange(next);
  }
  
  function insertSideBySideTableTemplate() {
    const ta = taRef.current;
    if (!ta) return;
  
    const block =
    `|  |  |
    |---|---|
    | <img src="PASTE_IMAGE_URL_HERE" alt="Image" width="240" /> | Write your text here |
    
    `;
    
  
    const next = insertAtCursor(ta, block);
    onChange(next);
  }
  async function handlePickImage(
    file: File,
    mode: "inline" | "table-left" | "table-right"
  ) {
    if (!onUploadImage) return;
    setUploading(true);
  
    try {
      const url = await onUploadImage(file);
      const naturalWidth = await getImageNaturalWidth(file);
  
      const alt = file.name.replace(/\.[a-z0-9]+$/i, "");
      const imgTag =
        naturalWidth > MAX_IMAGE_WIDTH_PX
          ? `<img src="${url}" alt="${alt}" width="${MAX_IMAGE_WIDTH_PX}" />`
          : `<img src="${url}" alt="${alt}" />`;
  
      // normalize whitespace for table cells
      const oneLineImg = imgTag.replace(/\s+/g, " ").trim();
  
      if (mode === "inline") {
        onChange((prev) => prev + `\n${oneLineImg}\n`);
        return;
      }
  
      let tableBlock = "";
  
      if (mode === "table-left") {
        tableBlock = `
  |  |  |
  |---|---|
  | ${oneLineImg} | Write your text here |
  
  `;
      }
  
      if (mode === "table-right") {
        tableBlock = `
  |  |  |
  |---|---|
  | Write your text here | ${oneLineImg} |
  
  `;
      }
  
      const ta = taRef.current;
      if (!ta) {
        onChange((prev) => prev + tableBlock);
        return;
      }
  
      const next = insertAtCursor(ta, tableBlock);
      onChange(next);
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
            onClick={insertTwoColumnTextTemplate}
            >
            2-column text
        </button>


        <button
            type="button"
            className="px-3 py-1 rounded border"
            onClick={() => {
                setInsertMode("inline");
                fileRef.current?.click();
            }}
            disabled={!onUploadImage || uploading}
            >
            {uploading ? "Uploading…" : "Image"}
        </button>

        <button
            type="button"
            className="px-3 py-1 rounded border"
            onClick={() => {
                // If no uploader, just insert the template with placeholder URL
                if (!onUploadImage) {
                insertSideBySideTableTemplate();
                return;
                }
                setInsertMode("table-left");
                fileRef.current?.click();
            }}
            disabled={uploading}
            >
            Image + Text
        </button>

        <button
            type="button"
            className="px-3 py-1 rounded border"
            onClick={() => {
                if (!onUploadImage) return;
                setInsertMode("table-right");
                fileRef.current?.click();
            }}
            disabled={uploading}
            >
            Text + Image
            </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handlePickImage(f, insertMode);
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
