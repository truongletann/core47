"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, FileText, ShieldCheck, ShieldQuestion, ShieldX } from "lucide-react";
import { ToolShell } from "@/components/toolbox/ToolShell";
import { ConfigPanel, ConfigRow } from "@/components/toolbox/ConfigPanel";
import { decodeCertificate, verifyCertificateSignature } from "@/lib/toolbox/x509";

const SAMPLE_PLACEHOLDER = "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----";

function Row({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-[rgb(var(--border))] px-4 py-2 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-xs font-semibold text-[rgb(var(--muted))]">{label}</span>
      <span className={`font-data break-all text-sm ${warn ? "text-red-600" : ""}`}>{value}</span>
    </div>
  );
}

export default function CertificateDecoderPage() {
  const [pem, setPem] = useState("");
  const [issuerPem, setIssuerPem] = useState("");
  const [verify, setVerify] = useState<{ status: "idle" | "checking" | "done"; ok?: boolean; message?: string }>({
    status: "idle",
  });

  const { info, error } = useMemo(() => {
    if (!pem.trim()) return { info: null, error: null as string | null };
    try {
      return { info: decodeCertificate(pem), error: null };
    } catch (e) {
      return { info: null, error: e instanceof Error ? e.message : "Could not decode this certificate." };
    }
  }, [pem]);

  useEffect(() => {
    setVerify({ status: "idle" });
  }, [pem, issuerPem]);

  async function runVerify() {
    if (!pem.trim()) return;
    setVerify({ status: "checking" });
    const result = await verifyCertificateSignature(pem, issuerPem);
    setVerify({ status: "done", ok: result.ok, message: result.message });
  }

  return (
    <ToolShell slug="certificate-decoder" title="Certificate Decoder" description="Decode a PEM-encoded X.509 certificate.">
      <div>
        <p className="mb-1 text-sm text-[rgb(var(--muted))]">PEM certificate</p>
        <textarea
          value={pem}
          onChange={(e) => setPem(e.target.value)}
          rows={10}
          placeholder={SAMPLE_PLACEHOLDER}
          className="font-data w-full resize-none rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-xs outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
        />
      </div>

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <AlertTriangle size={13} /> {error}
        </p>
      )}

      {info && (
        <div className="mt-4 overflow-hidden rounded-xl border border-[rgb(var(--border))]">
          <div className="flex items-center gap-2 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2">
            <FileText size={14} className="text-[rgb(var(--muted))]" />
            <span className="text-xs font-semibold text-[rgb(var(--muted))]">X.509 v{info.version}</span>
          </div>
          <Row label="Subject" value={info.subject || "(empty)"} />
          <Row label="Issuer" value={info.issuer || "(empty)"} />
          <Row label="Serial number" value={info.serialNumber} />
          <Row label="Not before" value={info.notBefore.toUTCString()} />
          <Row label="Not after" value={info.notAfter.toUTCString()} warn={info.isExpired} />
          {info.isExpired && <Row label="Status" value="EXPIRED" warn />}
          <Row label="Signature algorithm" value={info.signatureAlgorithm} />
          <Row label="Public key algorithm" value={info.publicKeyAlgorithm} />
          <Row label="Self-signed" value={info.isSelfSigned ? "Yes (subject = issuer)" : "No"} />
        </div>
      )}

      {info && (
        <div className="mt-4">
          <ConfigPanel>
            <ConfigRow
              icon={<ShieldQuestion size={16} />}
              title="Verify signature"
              description={
                info.isSelfSigned
                  ? "No issuer certificate provided — will check this certificate's self-signature"
                  : "No issuer certificate provided — will check the signature against this certificate's own key (only meaningful if it's self-signed)"
              }
            >
              <button
                onClick={runVerify}
                disabled={verify.status === "checking"}
                className="rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {verify.status === "checking" ? "Verifying…" : "Verify"}
              </button>
            </ConfigRow>
          </ConfigPanel>

          <div className="mt-3">
            <p className="mb-1 text-sm text-[rgb(var(--muted))]">Issuer / CA certificate (optional, PEM)</p>
            <textarea
              value={issuerPem}
              onChange={(e) => setIssuerPem(e.target.value)}
              rows={6}
              placeholder="Paste the issuing CA's certificate here to verify against its public key instead of self-signature..."
              className="font-data w-full resize-none rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-xs outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            />
          </div>

          {verify.status === "done" && (
            <p className={`mt-2 flex items-center gap-1.5 text-xs ${verify.ok ? "text-emerald-600" : "text-red-600"}`}>
              {verify.ok ? <ShieldCheck size={14} /> : <ShieldX size={14} />} {verify.message}
            </p>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-[rgb(var(--muted))]">
        Verifies one signature (self-signed, or against a supplied issuer certificate) using Web Crypto — RSA and EC
        (P-256/384/521) only. This does not build or validate a full certificate chain against a trust store, and does
        not check revocation.
      </p>
    </ToolShell>
  );
}
