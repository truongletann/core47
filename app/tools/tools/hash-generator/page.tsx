"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Fingerprint } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { getRelatedTools } from "@/lib/toolbox/registry";

const ALGORITHMS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algo = (typeof ALGORITHMS)[number];

async function hash(text: string, algo: Algo): Promise<string> {
  if (algo === "MD5") return md5Hex(text);
  const enc = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algo, enc);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Minimal MD5 (RFC 1321) — Web Crypto doesn't support MD5, so it's hand-rolled here
// purely for legacy-checksum compatibility; never used for anything security-sensitive.
function md5Hex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const rotl = (x: number, c: number) => (x << c) | (x >>> (32 - c));
  const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);
  const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

  const msgLen = bytes.length;
  const totalLen = ((msgLen + 8) >> 6) * 64 + 64;
  const buf = new Uint8Array(totalLen);
  buf.set(bytes);
  buf[msgLen] = 0x80;
  const bitLen = BigInt(msgLen) * BigInt(8);
  const mask32 = BigInt(0xffffffff);
  const view = new DataView(buf.buffer);
  view.setUint32(totalLen - 8, Number(bitLen & mask32), true);
  view.setUint32(totalLen - 4, Number((bitLen >> BigInt(32)) & mask32), true);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let chunkStart = 0; chunkStart < totalLen; chunkStart += 64) {
    const M = new Array(16);
    for (let j = 0; j < 16; j++) M[j] = view.getUint32(chunkStart + j * 4, true);

    let [A, B, C, D] = [a0, b0, c0, d0];
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + rotl(F, S[i])) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }

  const toLE = (n: number) => {
    const out = new Uint8Array(4);
    new DataView(out.buffer).setUint32(0, n, true);
    return out;
  };
  return [a0, b0, c0, d0]
    .flatMap((n) => Array.from(toLE(n)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const suggestions = getRelatedTools("hash-generator");

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Partial<Record<Algo, string>>>({});
  const [copiedAlgo, setCopiedAlgo] = useState<Algo | null>(null);

  useEffect(() => {
    if (!input) {
      setResults({});
      return;
    }
    let cancelled = false;
    Promise.all(ALGORITHMS.map(async (algo) => [algo, await hash(input, algo)] as const)).then((entries) => {
      if (!cancelled) setResults(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [input]);

  function copy(algo: Algo, value: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedAlgo(algo);
      setTimeout(() => setCopiedAlgo(null), 1200);
    });
  }

  return (
    <ToolShell
      slug="hash-generator"
      title="Hash / Checksum Generator"
      description="Calculate hash from text using Web Crypto API."
    >
      <ConfigPanel>
        <ConfigRow icon={<Fingerprint size={16} />} title="Algorithms" description="Computed live as you type">
          <span className="text-sm text-[rgb(var(--muted))]">{ALGORITHMS.join(", ")}</span>
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4">
        <EditorPanel label="Text" value={input} onChange={setInput} placeholder="Type or paste text..." suggestions={suggestions} />
      </div>

      {input && (
        <div className="mt-4 overflow-hidden rounded-xl border border-[rgb(var(--border))]">
          {ALGORITHMS.map((algo) => (
            <div
              key={algo}
              className="flex items-center justify-between gap-3 border-b border-[rgb(var(--border))] px-4 py-2 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[rgb(var(--muted))]">{algo}</p>
                <p className="font-data break-all text-sm">{results[algo] ?? "…"}</p>
              </div>
              <button
                onClick={() => results[algo] && copy(algo, results[algo])}
                className="shrink-0 text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))]"
                aria-label={`Copy ${algo}`}
              >
                {copiedAlgo === algo ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
