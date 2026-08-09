"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Key, ShieldCheck, ShieldX } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { EditorPanel } from "@/components/toolbox/EditorPanel";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { decodeJwt, verifyHmacSignature } from "@/lib/toolbox/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function formatClaimTime(value: unknown): string | null {
  if (typeof value !== "number") return null;
  const d = new Date(value * 1000);
  if (Number.isNaN(d.getTime())) return null;
  return d.toUTCString();
}

export default function JwtPage() {
  const [token, setToken] = useState(SAMPLE);
  const [secret, setSecret] = useState("");
  const [verifyResult, setVerifyResult] = useState<"idle" | "valid" | "invalid" | "error">("idle");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const { header, payload, signingInput, signatureB64, error } = useMemo(() => {
    try {
      const decoded = decodeJwt(token);
      return { ...decoded, error: null as string | null };
    } catch (e) {
      return {
        header: null,
        payload: null,
        signingInput: "",
        signatureB64: "",
        error: e instanceof Error ? e.message : "Invalid JWT.",
      };
    }
  }, [token]);

  const alg = header && typeof header === "object" && "alg" in header ? String((header as { alg: unknown }).alg) : null;

  useEffect(() => {
    setVerifyResult("idle");
    setVerifyError(null);
  }, [token, secret]);

  async function handleVerify() {
    if (!alg || !secret) return;
    try {
      const ok = await verifyHmacSignature(alg, signingInput, signatureB64, secret);
      setVerifyResult(ok ? "valid" : "invalid");
      setVerifyError(null);
    } catch (e) {
      setVerifyResult("error");
      setVerifyError(e instanceof Error ? e.message : "Could not verify.");
    }
  }

  const exp = payload && typeof payload === "object" && "exp" in payload ? formatClaimTime((payload as { exp: unknown }).exp) : null;
  const iat = payload && typeof payload === "object" && "iat" in payload ? formatClaimTime((payload as { iat: unknown }).iat) : null;
  const isExpired =
    payload && typeof payload === "object" && "exp" in payload && typeof (payload as { exp: unknown }).exp === "number"
      ? (payload as { exp: number }).exp * 1000 < Date.now()
      : false;

  return (
    <ToolShell slug="jwt" title="JWT Encoder / Decoder" description="Encode and decode JSON Web Token.">
      <div className="mt-1">
        <EditorPanel label="JWT" value={token} onChange={setToken} placeholder="Paste a JWT..." />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {!error && (
        <>
          {(exp || iat) && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[rgb(var(--muted))]">
              {iat && (
                <span className="flex items-center gap-1">
                  <Clock size={12} /> Issued: {iat}
                </span>
              )}
              {exp && (
                <span className={`flex items-center gap-1 ${isExpired ? "text-red-600" : ""}`}>
                  <Clock size={12} /> Expires: {exp} {isExpired ? "(expired)" : ""}
                </span>
              )}
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EditorPanel label="Header" value={JSON.stringify(header, null, 2)} readOnly />
            <EditorPanel label="Payload" value={JSON.stringify(payload, null, 2)} readOnly />
          </div>

          <div className="mt-4">
            <ConfigPanel>
              <ConfigRow
                icon={<Key size={16} />}
                title="Verify signature"
                description={alg ? `Algorithm: ${alg} — HS256/384/512 only` : "Unknown algorithm"}
              >
                <input
                  type="text"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="your-256-bit-secret"
                  className="w-56 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
                />
                <button
                  onClick={handleVerify}
                  disabled={!secret}
                  className="rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  Verify
                </button>
              </ConfigRow>
            </ConfigPanel>

            {verifyResult === "valid" && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                <ShieldCheck size={14} /> Signature verified.
              </p>
            )}
            {verifyResult === "invalid" && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <ShieldX size={14} /> Signature does not match.
              </p>
            )}
            {verifyResult === "error" && verifyError && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <ShieldX size={14} /> {verifyError}
              </p>
            )}
          </div>
        </>
      )}
    </ToolShell>
  );
}
