"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";

export default function Base64ImagePage() {
  const [encode, setEncode] = useState(true);
  const [dataUri, setDataUri] = useState("");
  const [textInput, setTextInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setDataUri(String(reader.result));
    reader.onerror = () => setError("Could not read this file.");
    reader.readAsDataURL(file);
  }

  const previewSrc = useMemo(() => {
    if (encode) return dataUri;
    return textInput.trim().startsWith("data:image/") ? textInput.trim() : null;
  }, [encode, dataUri, textInput]);

  function copy() {
    navigator.clipboard.writeText(dataUri).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <ToolShell
      slug="base64-image"
      title="Base64 Image Encoder / Decoder"
      description="Encode and decode Base64 image data."
    >
      <ConfigPanel>
        <ConfigRow icon={<Upload size={16} />} title="Conversion" description="Select which conversion mode you want to use">
          <span className="text-sm text-[rgb(var(--muted))]">{encode ? "Encode (image → Base64)" : "Decode (Base64 → image)"}</span>
          <ModeToggle
            checked={encode}
            onChange={(v) => {
              setEncode(v);
              setError(null);
            }}
          />
        </ConfigRow>
      </ConfigPanel>

      {encode ? (
        <div className="mt-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[rgb(var(--border))] p-10 text-center hover:border-[rgb(var(--accent))]">
            <Upload size={20} className="text-[rgb(var(--muted))]" />
            <span className="text-sm text-[rgb(var(--muted))]">Click to choose an image, or drag & drop</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>

          {dataUri && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUri} alt="Preview" className="max-h-48 w-auto rounded-lg border border-[rgb(var(--border))]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[rgb(var(--muted))]">Base64 data URI ({dataUri.length.toLocaleString()} chars)</p>
                  <button onClick={copy} className="flex items-center gap-1 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))]">
                    {copied ? <Check size={13} /> : <Copy size={13} />} Copy
                  </button>
                </div>
                <textarea
                  readOnly
                  value={dataUri}
                  rows={6}
                  className="font-data mt-1 w-full resize-none rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3 text-xs outline-none"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-[rgb(var(--muted))]">Base64 / data URI</p>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={10}
              placeholder="data:image/png;base64,..."
              className="font-data w-full resize-none rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-xs outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            />
          </div>
          <div>
            <p className="mb-1 text-sm text-[rgb(var(--muted))]">Preview</p>
            <div className="flex h-64 items-center justify-center rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
              {previewSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewSrc} alt="Preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <p className="text-xs text-[rgb(var(--muted))]">
                  {textInput.trim() ? "Paste a valid data:image/... URI" : "Nothing to preview yet"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </ToolShell>
  );
}
