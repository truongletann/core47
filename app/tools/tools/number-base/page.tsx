"use client";

import { useMemo, useState } from "react";
import { Hash } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";

const BASES = [
  { base: 2, label: "Binary" },
  { base: 8, label: "Octal" },
  { base: 10, label: "Decimal" },
  { base: 16, label: "Hexadecimal" },
];

function sanitizeForBase(value: string, base: number): string {
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, base);
  const re = new RegExp(`[^${digits}]`, "gi");
  return value.replace(re, "");
}

export default function NumberBaseConverterPage() {
  const [inputBase, setInputBase] = useState(10);
  const [value, setValue] = useState("42");

  const { parsed, error } = useMemo(() => {
    if (!value.trim()) return { parsed: null as bigint | null, error: null as string | null };
    const clean = sanitizeForBase(value.trim(), inputBase);
    if (!clean) return { parsed: null, error: "No valid digits for this base." };
    try {
      let n = BigInt(0);
      const base = BigInt(inputBase);
      for (const ch of clean.toLowerCase()) {
        const digit = BigInt(parseInt(ch, 36));
        n = n * base + digit;
      }
      return { parsed: n, error: null };
    } catch {
      return { parsed: null, error: "Invalid number." };
    }
  }, [value, inputBase]);

  return (
    <ToolShell
      slug="number-base"
      title="Number Base Converter"
      description="Convert numbers from one base to another."
    >
      <ConfigPanel>
        <ConfigRow icon={<Hash size={16} />} title="Input base" description="Base of the number you're typing">
          <select
            value={inputBase}
            onChange={(e) => setInputBase(Number(e.target.value))}
            className="rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
          >
            {BASES.map((b) => (
              <option key={b.base} value={b.base}>
                {b.label} (base {b.base})
              </option>
            ))}
          </select>
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4">
        <p className="mb-1 text-sm text-[rgb(var(--muted))]">Value</p>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a number..."
          className="font-data w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {parsed !== null && (
        <div className="mt-4 overflow-hidden rounded-xl border border-[rgb(var(--border))]">
          {BASES.map((b) => (
            <div key={b.base} className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-2 last:border-0">
              <span className="text-xs font-semibold text-[rgb(var(--muted))]">
                {b.label} (base {b.base})
              </span>
              <span className="font-data break-all text-sm">{parsed.toString(b.base)}</span>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
