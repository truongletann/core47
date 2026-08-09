"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Table2 } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { getRelatedTools } from "@/lib/toolbox/registry";

const suggestions = getRelatedTools("json-to-table");
const SAMPLE = '[\n  {"id": 1, "name": "Alice", "role": "Admin"},\n  {"id": 2, "name": "Bob", "role": "Editor"}\n]';

function cellToString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function toDelimited(columns: string[], rows: Record<string, unknown>[], delimiter: string): string {
  const escape = (v: string) =>
    delimiter === "," && /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  const header = columns.map(escape).join(delimiter);
  const body = rows.map((row) => columns.map((c) => escape(cellToString(row[c]))).join(delimiter));
  return [header, ...body].join("\n");
}

export default function JsonToTablePage() {
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const { columns, rows, error } = useMemo(() => {
    if (!input.trim()) return { columns: [] as string[], rows: [] as Record<string, unknown>[], error: null as string | null };
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) throw new Error("Input must be a JSON array.");
      if (parsed.some((r) => typeof r !== "object" || r === null || Array.isArray(r))) {
        throw new Error("Every array item must be a JSON object.");
      }
      const cols = Array.from(new Set(parsed.flatMap((r) => Object.keys(r as object))));
      return { columns: cols, rows: parsed as Record<string, unknown>[], error: null };
    } catch (e) {
      return { columns: [], rows: [], error: e instanceof Error ? e.message : "Invalid JSON." };
    }
  }, [input]);

  function download(delimiter: string, ext: string) {
    const text = toDelimited(columns, rows, delimiter);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `table.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyTsv() {
    navigator.clipboard.writeText(toDelimited(columns, rows, "\t")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <ToolShell
      slug="json-to-table"
      title="JSON Array to Table"
      description="Convert a JSON array to tabular format, export to CSV or TSV."
    >
      <ConfigPanel>
        <ConfigRow icon={<Table2 size={16} />} title="Rows" description={rows.length ? `${rows.length} row(s), ${columns.length} column(s)` : "Paste a JSON array of objects"}>
          <button
            onClick={() => download(",", "csv")}
            disabled={rows.length === 0}
            className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--border)/0.5)] disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => download("\t", "tsv")}
            disabled={rows.length === 0}
            className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--border)/0.5)] disabled:opacity-50"
          >
            Export TSV
          </button>
          <button
            onClick={copyTsv}
            disabled={rows.length === 0}
            className="flex items-center gap-1 rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--border)/0.5)] disabled:opacity-50"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />} Copy TSV
          </button>
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4">
        <EditorPanel label="JSON array" value={input} onChange={setInput} placeholder={SAMPLE} suggestions={suggestions} />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {rows.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
                {columns.map((c) => (
                  <th key={c} className="whitespace-nowrap px-3 py-2 font-semibold text-[rgb(var(--muted))]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-[rgb(var(--border))] last:border-0">
                  {columns.map((c) => (
                    <td key={c} className="font-data whitespace-nowrap px-3 py-2">
                      {cellToString(row[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ToolShell>
  );
}
