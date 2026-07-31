"use client";

import { useEffect, useState } from "react";

const emptyForm = { oandaApiKey: "", oandaAccountId: "", oandaEnvironment: "practice" as "practice" | "live" };
type FormState = typeof emptyForm;

export default function AdminMarketPriceSettingsPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [hasKey, setHasKey] = useState(false);
  const [keyPreview, setKeyPreview] = useState<string | null>(null);
  const [clearKey, setClearKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    fetch("/api/admin/market/price-settings", { credentials: "include" })
      .then(
        (r) =>
          r.json() as Promise<{
            data?: {
              settings?: {
                hasOandaApiKey: boolean;
                oandaApiKeyPreview: string | null;
                oandaAccountId: string | null;
                oandaEnvironment: "practice" | "live";
              };
            };
          }>,
      )
      .then((json) => {
        const s = json?.data?.settings;
        if (s) {
          setForm({
            oandaApiKey: "",
            oandaAccountId: s.oandaAccountId ?? "",
            oandaEnvironment: s.oandaEnvironment ?? "practice",
          });
          setHasKey(s.hasOandaApiKey);
          setKeyPreview(s.oandaApiKeyPreview);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function errorMessage(json: {
    error?: string;
    issues?: { path: string; message: string }[];
    message?: string;
  }) {
    if (json.error === "INVALID_INPUT" && json.issues?.length) {
      return json.issues.map((i) => `${i.path}: ${i.message}`).join(" · ");
    }
    if (json.error === "SERVER_ERROR" && json.message) return `Server error: ${json.message}`;
    return "Something went wrong.";
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/market/price-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, clearOandaApiKey: clearKey }),
        credentials: "include",
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        issues?: { path: string; message: string }[];
        message?: string;
      };
      if (!json.success) {
        setError(errorMessage(json));
        return;
      }
      setSaved(true);
      if (clearKey) {
        setHasKey(false);
        setKeyPreview(null);
      } else if (form.oandaApiKey) {
        setHasKey(true);
        setKeyPreview(`••••${form.oandaApiKey.slice(-4)}`);
      }
      setForm((f) => ({ ...f, oandaApiKey: "" }));
      setClearKey(false);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[rgb(var(--muted))]">Loading...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Market: Price Settings</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        API key OANDA (oanda.com) — dùng để lấy giá vàng/forex (snapshot + live stream) cho trang
        /market/prices. Cần token cá nhân (Manage API Access trong tài khoản OANDA) và Account ID.
      </p>

      <div className="mt-6 flex max-w-xl flex-col gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">
            OANDA API key (token)
            {hasKey && !clearKey && (
              <span className="ml-2 text-xs text-emerald-600">đã lưu {keyPreview}</span>
            )}
          </span>
          <div className="flex gap-2">
            <input
              type={reveal ? "text" : "password"}
              value={form.oandaApiKey}
              onChange={(e) => setForm({ ...form, oandaApiKey: e.target.value })}
              disabled={clearKey}
              placeholder={hasKey ? "Để trống nếu không muốn đổi key" : "Nhập API key"}
              className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setReveal(!reveal)}
              className="shrink-0 rounded-md border border-[rgb(var(--border))] px-3 py-2 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            >
              {reveal ? "Ẩn" : "Hiện"}
            </button>
          </div>
          {hasKey && (
            <label className="mt-1 flex items-center gap-2 text-xs text-[rgb(var(--muted))]">
              <input
                type="checkbox"
                checked={clearKey}
                onChange={(e) => {
                  setClearKey(e.target.checked);
                  if (e.target.checked) setForm((f) => ({ ...f, oandaApiKey: "" }));
                }}
              />
              Xoá key đã lưu
            </label>
          )}
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">OANDA Account ID</span>
          <input
            value={form.oandaAccountId}
            onChange={(e) => setForm({ ...form, oandaAccountId: e.target.value })}
            placeholder="101-004-xxxxxxx-001"
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Môi trường</span>
          <select
            value={form.oandaEnvironment}
            onChange={(e) => setForm({ ...form, oandaEnvironment: e.target.value as "practice" | "live" })}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          >
            <option value="practice">Practice (fxPractice / demo)</option>
            <option value="live">Live (fxTrade)</option>
          </select>
        </label>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {saved && <p className="text-xs text-emerald-600">Đã lưu.</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-1 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
