"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, ChevronDown, Link2 } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";
import { getRelatedTools } from "@/lib/toolbox/registry";

function toBase64(text: string, urlSafe: boolean) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const base64 = btoa(binary);
  return urlSafe ? base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : base64;
}

function fromBase64(text: string, urlSafe: boolean) {
  let normalized = text;
  if (urlSafe) {
    normalized = normalized.replace(/-/g, "+").replace(/_/g, "/");
    while (normalized.length % 4 !== 0) normalized += "=";
  }
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

const suggestions = getRelatedTools("base64");

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [encode, setEncode] = useState(true);
  const [urlSafe, setUrlSafe] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      const result = encode ? toBase64(input, urlSafe) : fromBase64(input, urlSafe);
      return { output: result, error: null };
    } catch {
      return { output: "", error: encode ? "Could not encode this input." : "Invalid Base64 string." };
    }
  }, [input, encode, urlSafe]);

  return (
    <ToolShell
      slug="base64"
      title="Base64 Text Encoder / Decoder"
      description="Encode and decode Base64 text data."
    >
      <ConfigPanel>
        <ConfigRow
          icon={<ArrowRightLeft size={16} />}
          title="Conversion"
          description="Select which conversion mode you want to use"
        >
          <span className="text-sm text-[rgb(var(--muted))]">{encode ? "Encode" : "Decode"}</span>
          <ModeToggle checked={encode} onChange={setEncode} />
          <button
            type="button"
            onClick={() => setShowOptions((v) => !v)}
            aria-label="More options"
            className="text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            <ChevronDown size={16} className={`transition-transform ${showOptions ? "rotate-180" : ""}`} />
          </button>
        </ConfigRow>

        {showOptions && (
          <ConfigRow
            icon={<Link2 size={16} />}
            title="URL-safe alphabet"
            description="Use - and _ instead of + and /, no padding"
          >
            <ModeToggle checked={urlSafe} onChange={setUrlSafe} />
          </ConfigRow>
        )}
      </ConfigPanel>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EditorPanel
          label="Input"
          value={input}
          onChange={setInput}
          placeholder={encode ? "Type or paste text to encode..." : "Type or paste Base64 to decode..."}
        />
        <EditorPanel label="Output" value={output} readOnly suggestions={suggestions} />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </ToolShell>
  );
}
