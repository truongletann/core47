"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([crypto.randomUUID()]);
  const [count, setCount] = useState(5);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function generate() {
    setUuids(Array.from({ length: count }, () => crypto.randomUUID()));
  }

  function copy(value: string, i: number) {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedIndex(i);
      setTimeout(() => setCopiedIndex(null), 1200);
    });
  }

  return (
    <ToolShell slug="uuid-generator" title="UUID Generator" description="Generate UUID v4 identifiers.">
      <div className="flex items-center gap-3">
        <label className="text-sm text-[rgb(var(--muted))]">
          Count
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="ml-2 w-16 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-2 py-1 text-sm outline-none"
          />
        </label>
        <button
          onClick={generate}
          className="flex items-center gap-1.5 rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          <RefreshCw size={13} /> Generate
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[rgb(var(--border))]">
        {uuids.map((u, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-2 last:border-0"
          >
            <span className="font-data text-sm">{u}</span>
            <button onClick={() => copy(u, i)} className="text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))]">
              {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
