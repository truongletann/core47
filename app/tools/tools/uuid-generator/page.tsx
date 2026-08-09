"use client";

import { useState } from "react";
import { Check, Copy, Hash, RefreshCw } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([crypto.randomUUID()]);
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  function format(u: string) {
    const raw = hyphens ? u : u.replace(/-/g, "");
    return uppercase ? raw.toUpperCase() : raw;
  }

  function generate() {
    setUuids(Array.from({ length: count }, () => crypto.randomUUID()));
  }

  function copy(value: string, i: number) {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedIndex(i);
      setTimeout(() => setCopiedIndex(null), 1200);
    });
  }

  function copyAll() {
    navigator.clipboard.writeText(uuids.map(format).join("\n")).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1200);
    });
  }

  return (
    <ToolShell slug="uuid-generator" title="UUID Generator" description="Generate UUID v4 identifiers.">
      <ConfigPanel>
        <ConfigRow icon={<Hash size={16} />} title="Count" description="How many UUIDs to generate">
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="w-16 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
          />
        </ConfigRow>
        <ConfigRow icon={<span className="font-data text-sm">AB</span>} title="Uppercase" description="Render hex digits in uppercase">
          <ModeToggle checked={uppercase} onChange={setUppercase} />
        </ConfigRow>
        <ConfigRow icon={<span className="font-data text-sm">-</span>} title="Hyphens" description="Include dashes between groups">
          <ModeToggle checked={hyphens} onChange={setHyphens} />
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={generate}
          className="flex items-center gap-1.5 rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          <RefreshCw size={13} /> Generate
        </button>
        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--border)/0.5)]"
        >
          {copiedAll ? <Check size={13} /> : <Copy size={13} />} Copy all
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[rgb(var(--border))]">
        {uuids.map((u, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-2 last:border-0"
          >
            <span className="font-data text-sm">{format(u)}</span>
            <button onClick={() => copy(format(u), i)} className="text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))]">
              {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
