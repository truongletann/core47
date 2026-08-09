"use client";

import { useMemo, useState } from "react";
import { AlignLeft, Minus } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";
import { getRelatedTools } from "@/lib/toolbox/registry";
import { formatXml, minifyXml } from "@/lib/toolbox/xmlFormat";

const suggestions = getRelatedTools("xml-formatter");

export default function XmlFormatterPage() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(true);
  const [indentSize, setIndentSize] = useState(2);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      return { output: indent ? formatXml(input, indentSize) : minifyXml(input), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Invalid XML." };
    }
  }, [input, indent, indentSize]);

  return (
    <ToolShell slug="xml-formatter" title="XML Formatter" description="Indent or minify XML data.">
      <ConfigPanel>
        <ConfigRow icon={<AlignLeft size={16} />} title="Indent" description="Pretty-print with indentation instead of minifying">
          <span className="text-sm text-[rgb(var(--muted))]">{indent ? "On" : "Off"}</span>
          <ModeToggle checked={indent} onChange={setIndent} />
        </ConfigRow>
        {indent && (
          <ConfigRow icon={<Minus size={16} />} title="Indent size" description="Number of spaces per indent level">
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            >
              {[2, 4, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </ConfigRow>
        )}
      </ConfigPanel>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EditorPanel label="Input" value={input} onChange={setInput} placeholder="<root><child>value</child></root>" />
        <EditorPanel label="Output" value={output} readOnly suggestions={suggestions} />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </ToolShell>
  );
}
