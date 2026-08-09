"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";
import { getRelatedTools } from "@/lib/toolbox/registry";

const NAMED_ENTITIES: [string, string][] = [
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ['"', "&quot;"],
  ["'", "&#39;"],
];

function encodeHtml(text: string): string {
  let out = text;
  for (const [char, entity] of NAMED_ENTITIES) {
    out = out.split(char).join(entity);
  }
  return out;
}

// Decoding via a detached <textarea> is safe: browsers never execute markup placed
// inside a textarea's innerHTML, they only decode entities in its text content.
function decodeHtml(text: string): string {
  if (typeof document === "undefined") return text;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

const suggestions = getRelatedTools("html-encoder");

export default function HtmlEncoderPage() {
  const [input, setInput] = useState("");
  const [encode, setEncode] = useState(true);

  const output = useMemo(() => (encode ? encodeHtml(input) : decodeHtml(input)), [input, encode]);

  return (
    <ToolShell
      slug="html-encoder"
      title="HTML Text Encoder / Decoder"
      description="Encode and decode HTML text data."
    >
      <ConfigPanel>
        <ConfigRow
          icon={<ArrowRightLeft size={16} />}
          title="Conversion"
          description="Select which conversion mode you want to use"
        >
          <span className="text-sm text-[rgb(var(--muted))]">{encode ? "Encode" : "Decode"}</span>
          <ModeToggle checked={encode} onChange={setEncode} />
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EditorPanel
          label="Input"
          value={input}
          onChange={setInput}
          placeholder={encode ? "<div class=\"a\">Hello & world</div>" : "&lt;div&gt;Hello &amp; world&lt;/div&gt;"}
        />
        <EditorPanel label="Output" value={output} readOnly suggestions={suggestions} />
      </div>
    </ToolShell>
  );
}
