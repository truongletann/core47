"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}";

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    let charset = LOWER;
    if (useUpper) charset += UPPER;
    if (useDigits) charset += DIGITS;
    if (useSymbols) charset += SYMBOLS;

    const bytes = crypto.getRandomValues(new Uint32Array(length));
    const result = Array.from(bytes, (b) => charset[b % charset.length]).join("");
    setPassword(result);
  }

  function copy() {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <ToolShell slug="password-generator" title="Password Generator" description="Generate strong random passwords.">
      <div className="flex flex-col gap-4">
        <label className="text-sm">
          Length: <span className="font-data">{length}</span>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-1 block w-full"
          />
        </label>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} />
            Uppercase (A-Z)
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={useDigits} onChange={(e) => setUseDigits(e.target.checked)} />
            Digits (0-9)
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
            Symbols (!@#...)
          </label>
        </div>

        <button
          onClick={generate}
          className="flex w-fit items-center gap-1.5 rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          <RefreshCw size={13} /> Generate
        </button>

        {password && (
          <div className="flex items-center justify-between rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-3">
            <span className="font-data break-all text-sm">{password}</span>
            <button onClick={copy} className="ml-3 shrink-0 text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))]">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
