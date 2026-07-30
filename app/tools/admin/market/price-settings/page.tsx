"use client";

import { useEffect, useState } from "react";

const emptyForm = { twelveDataApiKey: "" };
type FormState = typeof emptyForm;

export default function AdminMarketPriceSettingsPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    fetch("/api/admin/market/price-settings", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { settings?: { twelveDataApiKey: string | null } } }>)
      .then((json) => {
        const s = json?.data?.settings;
        if (s) setForm({ twelveDataApiKey: s.twelveDataApiKey ?? "" });
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
        body: JSON.stringify(form),
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
        API key Twelve Data (twelvedata.com) — dùng để lấy giá vàng/forex cho trang /market/prices.
        Free tier: 800 request/ngày. Lưu ý: Silver (XAG/USD) không khả dụng ở gói free.
      </p>

      <div className="mt-6 flex max-w-xl flex-col gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Twelve Data API key</span>
          <div className="flex gap-2">
            <input
              type={reveal ? "text" : "password"}
              value={form.twelveDataApiKey}
              onChange={(e) => setForm({ twelveDataApiKey: e.target.value })}
              className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setReveal(!reveal)}
              className="shrink-0 rounded-md border border-[rgb(var(--border))] px-3 py-2 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            >
              {reveal ? "Ẩn" : "Hiện"}
            </button>
          </div>
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
