"use client";

import { useMemo, useState } from "react";
import { Check, Clock, Copy } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";

function parseInput(value: string, isMs: boolean): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^-?\d+$/.test(trimmed)) {
    const n = Number(trimmed);
    const ms = isMs ? n : n * 1000;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? null : d;
}

function relativeTime(d: Date): string {
  const diffMs = d.getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs < 60000) return rtf.format(Math.round(diffMs / 1000), "second");
  if (abs < 3600000) return rtf.format(Math.round(diffMs / 60000), "minute");
  if (abs < 86400000) return rtf.format(Math.round(diffMs / 3600000), "hour");
  if (abs < 2592000000) return rtf.format(Math.round(diffMs / 86400000), "day");
  if (abs < 31536000000) return rtf.format(Math.round(diffMs / 2592000000), "month");
  return rtf.format(Math.round(diffMs / 31536000000), "year");
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[rgb(var(--border))] px-4 py-2 last:border-0">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[rgb(var(--muted))]">{label}</p>
        <p className="font-data break-all text-sm">{value}</p>
      </div>
      <button
        onClick={() =>
          navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          })
        }
        className="shrink-0 text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))]"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export default function DateConverterPage() {
  const [input, setInput] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [isMs, setIsMs] = useState(false);

  const date = useMemo(() => parseInput(input, isMs), [input, isMs]);

  return (
    <ToolShell
      slug="date-converter"
      title="Date Converter"
      description="Convert date to human-readable date and vice versa."
    >
      <ConfigPanel>
        <ConfigRow
          icon={<Clock size={16} />}
          title="Unix timestamp unit"
          description="Interpret a plain integer input as milliseconds instead of seconds"
        >
          <span className="text-sm text-[rgb(var(--muted))]">{isMs ? "Milliseconds" : "Seconds"}</span>
          <ModeToggle checked={isMs} onChange={setIsMs} />
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          onClick={() => setInput(String(isMs ? Date.now() : Math.floor(Date.now() / 1000)))}
          className="w-fit rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--border)/0.5)]"
        >
          Now
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Unix timestamp or any parseable date string..."
          className="font-data flex-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
        />
      </div>

      {!date && input.trim() && <p className="mt-2 text-xs text-red-600">Could not parse this value.</p>}

      {date && (
        <div className="mt-4 overflow-hidden rounded-xl border border-[rgb(var(--border))]">
          <CopyRow label="ISO 8601" value={date.toISOString()} />
          <CopyRow label="Unix timestamp (seconds)" value={String(Math.floor(date.getTime() / 1000))} />
          <CopyRow label="Unix timestamp (milliseconds)" value={String(date.getTime())} />
          <CopyRow label="UTC string" value={date.toUTCString()} />
          <CopyRow label="Local string" value={date.toLocaleString()} />
          <CopyRow label="Relative" value={relativeTime(date)} />
        </div>
      )}
    </ToolShell>
  );
}
