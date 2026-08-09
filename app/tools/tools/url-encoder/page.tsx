"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, Component } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";
import { getRelatedTools } from "@/lib/toolbox/registry";

const suggestions = getRelatedTools("url-encoder");

export default function UrlEncoderPage() {
  const [input, setInput] = useState("");
  const [encode, setEncode] = useState(true);
  const [componentMode, setComponentMode] = useState(true);

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      if (encode) {
        return { output: componentMode ? encodeURIComponent(input) : encodeURI(input), error: null };
      }
      return { output: componentMode ? decodeURIComponent(input) : decodeURI(input), error: null };
    } catch {
      return { output: "", error: "Invalid encoded string." };
    }
  }, [input, encode, componentMode]);

  return (
    <ToolShell slug="url-encoder" title="URL Encoder / Decoder" description="Encode or decode URL components.">
      <ConfigPanel>
        <ConfigRow
          icon={<ArrowRightLeft size={16} />}
          title="Conversion"
          description="Select which conversion mode you want to use"
        >
          <span className="text-sm text-[rgb(var(--muted))]">{encode ? "Encode" : "Decode"}</span>
          <ModeToggle checked={encode} onChange={setEncode} />
        </ConfigRow>

        <ConfigRow
          icon={<Component size={16} />}
          title="Component mode"
          description="Escape reserved URI characters (&, =, ?, /, ...) too, not just unsafe ones"
        >
          <ModeToggle checked={componentMode} onChange={setComponentMode} />
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EditorPanel
          label="Input"
          value={input}
          onChange={setInput}
          placeholder={encode ? "Type or paste text to encode..." : "Type or paste URL to decode..."}
        />
        <EditorPanel label="Output" value={output} readOnly suggestions={suggestions} />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </ToolShell>
  );
}
