"use client";

import { useEffect, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";
import { getRelatedTools } from "@/lib/toolbox/registry";
import { gzipCompress, gzipDecompress } from "@/lib/toolbox/gzip";

const suggestions = getRelatedTools("gzip");

export default function GzipPage() {
  const [input, setInput] = useState("");
  const [compress, setCompress] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    (compress ? gzipCompress(input) : gzipDecompress(input))
      .then((result) => {
        if (!cancelled) {
          setOutput(result);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setOutput("");
          setError(e instanceof Error ? e.message : compress ? "Could not compress this input." : "Invalid gzip Base64 data.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [input, compress]);

  return (
    <ToolShell slug="gzip" title="GZip Compress / Decompress" description="Compress or decompress a text in GZip.">
      <ConfigPanel>
        <ConfigRow
          icon={<ArrowRightLeft size={16} />}
          title="Conversion"
          description="Output/input is GZip data encoded as Base64"
        >
          <span className="text-sm text-[rgb(var(--muted))]">{compress ? "Compress" : "Decompress"}</span>
          <ModeToggle checked={compress} onChange={setCompress} />
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EditorPanel
          label={compress ? "Text to compress" : "Base64 GZip data"}
          value={input}
          onChange={setInput}
          placeholder={compress ? "Type or paste text..." : "H4sIAAAAAAAA..."}
        />
        <EditorPanel label={compress ? "Base64 GZip output" : "Decompressed text"} value={output} readOnly suggestions={suggestions} />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </ToolShell>
  );
}
