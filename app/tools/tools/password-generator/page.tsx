"use client";

import { useMemo, useState } from "react";
import { Check, Copy, RefreshCw, Ruler, ShieldCheck } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { ModeToggle } from "@/components/toolbox/ModeToggle";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}";
const AMBIGUOUS = /[il1Lo0O]/;

function strengthOf(length: number, charsetSize: number): { label: string; color: string } {
  const entropyBits = length * Math.log2(Math.max(charsetSize, 2));
  if (entropyBits < 40) return { label: "Weak", color: "bg-red-500" };
  if (entropyBits < 70) return { label: "Fair", color: "bg-amber-500" };
  if (entropyBits < 100) return { label: "Strong", color: "bg-emerald-500" };
  return { label: "Very strong", color: "bg-emerald-600" };
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const charset = useMemo(() => {
    let set = "";
    if (useLower) set += LOWER;
    if (useUpper) set += UPPER;
    if (useDigits) set += DIGITS;
    if (useSymbols) set += SYMBOLS;
    if (excludeAmbiguous) set = set.replace(AMBIGUOUS, "");
    return set;
  }, [useLower, useUpper, useDigits, useSymbols, excludeAmbiguous]);

  const strength = strengthOf(length, charset.length || 1);

  function generate() {
    if (!charset) return;
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
      <ConfigPanel>
        <ConfigRow icon={<Ruler size={16} />} title="Length" description="Number of characters">
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-40"
          />
          <span className="font-data w-6 text-right text-sm">{length}</span>
        </ConfigRow>

        <ConfigRow icon={<span className="font-data text-sm">a-z</span>} title="Lowercase" description="Include a-z">
          <ModeToggle checked={useLower} onChange={setUseLower} />
        </ConfigRow>
        <ConfigRow icon={<span className="font-data text-sm">A-Z</span>} title="Uppercase" description="Include A-Z">
          <ModeToggle checked={useUpper} onChange={setUseUpper} />
        </ConfigRow>
        <ConfigRow icon={<span className="font-data text-sm">0-9</span>} title="Digits" description="Include 0-9">
          <ModeToggle checked={useDigits} onChange={setUseDigits} />
        </ConfigRow>
        <ConfigRow icon={<span className="font-data text-sm">#!$</span>} title="Symbols" description="Include !@#$%^&*()_+-=[]{}">
          <ModeToggle checked={useSymbols} onChange={setUseSymbols} />
        </ConfigRow>
        <ConfigRow
          icon={<ShieldCheck size={16} />}
          title="Exclude ambiguous"
          description="Remove characters easily confused: i, l, 1, L, o, 0, O"
        >
          <ModeToggle checked={excludeAmbiguous} onChange={setExcludeAmbiguous} />
        </ConfigRow>
      </ConfigPanel>

      <div className="mt-4 flex flex-col gap-3">
        <button
          onClick={generate}
          disabled={!charset}
          className="flex w-fit items-center gap-1.5 rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          <RefreshCw size={13} /> Generate
        </button>
        {!charset && <p className="text-xs text-red-600">Select at least one character set.</p>}

        {password && (
          <div className="flex flex-col gap-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="font-data break-all text-sm">{password}</span>
              <button onClick={copy} className="ml-3 shrink-0 text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))]">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[rgb(var(--border))]">
                <div className={`h-full ${strength.color}`} style={{ width: `${Math.min(length * 4, 100)}%` }} />
              </div>
              <span className="text-xs text-[rgb(var(--muted))]">{strength.label}</span>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
