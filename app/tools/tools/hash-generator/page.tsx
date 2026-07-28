"use client";

import { useState } from "react";
import { ToolShell } from "@/components/toolbox/ToolShell";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

async function hash(text: string, algo: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algo, enc);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});

  async function computeAll() {
    const entries = await Promise.all(
      ALGORITHMS.map(async (algo) => [algo, await hash(input, algo)] as const),
    );
    setResults(Object.fromEntries(entries));
  }

  return (
    <ToolShell slug="hash-generator" title="Hash Generator" description="Calculate SHA hash from text using Web Crypto API.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        placeholder="Type or paste text..."
        className="font-data w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
      />
      <button
        onClick={computeAll}
        disabled={!input}
        className="mt-2 rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        Compute hashes
      </button>

      {Object.keys(results).length > 0 && (
        <div className="mt-4 overflow-hidden rounded-xl border border-[rgb(var(--border))]">
          {ALGORITHMS.map((algo) => (
            <div key={algo} className="border-b border-[rgb(var(--border))] px-4 py-2 last:border-0">
              <p className="text-xs font-semibold text-[rgb(var(--muted))]">{algo}</p>
              <p className="font-data break-all text-sm">{results[algo]}</p>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
