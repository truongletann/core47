"use client";

import { useCallback, useId, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function FileDropzone({
  accept,
  multiple = false,
  files,
  onFiles,
  hint,
}: {
  accept: string;
  multiple?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
  hint?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputId = useId();

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      onFiles(multiple ? [...files, ...Array.from(list)] : [Array.from(list)[0]]);
    },
    [files, multiple, onFiles],
  );

  function removeAt(index: number) {
    onFiles(files.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging
            ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.05)]"
            : "border-[rgb(var(--border))] hover:border-[rgb(var(--accent)/0.5)]",
        )}
      >
        <UploadCloud size={28} className="text-[rgb(var(--muted))]" />
        <p className="text-sm font-medium">Kéo thả file vào đây, hoặc bấm để chọn</p>
        {hint && <p className="text-xs text-[rgb(var(--muted))]">{hint}</p>}
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {files.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
            >
              <span className="truncate">{f.name}</span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-[rgb(var(--muted))]">
                {(f.size / 1024).toFixed(0)} KB
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="text-[rgb(var(--muted))] hover:text-red-600"
                  aria-label="Xoá file"
                >
                  <X size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
