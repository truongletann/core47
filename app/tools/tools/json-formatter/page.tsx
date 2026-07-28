"use client";

import { useState } from "react";
import { ToolShell } from "@/components/toolbox/ToolShell";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function format(minify: boolean) {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
      setError(null);
    } catch {
      setError("Invalid JSON.");
      setOutput("");
    }
  }

  return (
    <ToolShell slug="json-formatter" title="JSON Formatter" description="Indent or minify JSON data.">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-sm text-[rgb(var(--muted))]">Input</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={14}
            placeholder='{"hello":"world"}'
            className="font-data w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => format(false)}
              className="rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              Indent
            </button>
            <button
              onClick={() => format(true)}
              className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--border)/0.5)]"
            >
              Minify
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
        <div>
          <p className="mb-1 text-sm text-[rgb(var(--muted))]">Output</p>
          <textarea
            readOnly
            value={output}
            rows={14}
            className="font-data w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3 text-sm outline-none"
          />
        </div>
      </div>
    </ToolShell>
  );
}
