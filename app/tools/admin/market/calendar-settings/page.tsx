"use client";

import { useEffect, useState } from "react";

const emptyForm = { thisWeekFeedUrl: "" };
type FormState = typeof emptyForm;

export default function AdminMarketCalendarSettingsPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/market/calendar-settings", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { settings?: { thisWeekFeedUrl: string } } }>)
      .then((json) => {
        const s = json?.data?.settings;
        if (s) setForm({ thisWeekFeedUrl: s.thisWeekFeedUrl });
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
      const res = await fetch("/api/admin/market/calendar-settings", {
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
      <h1 className="font-display text-2xl font-semibold">Market: Calendar Settings</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        URL nguồn lịch kinh tế (fxtin.com) — đổi ở đây không cần deploy lại code. Trang /market/calendar
        gọi endpoint này 7 lần/lần refresh (mỗi ngày trong tuần 1 lần, vì API chỉ trả dữ liệu theo ngày).
      </p>

      <div className="mt-6 flex max-w-xl flex-col gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Calendar API URL</span>
          <input
            value={form.thisWeekFeedUrl}
            onChange={(e) => setForm({ ...form, thisWeekFeedUrl: e.target.value })}
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {saved && <p className="text-xs text-emerald-600">Đã lưu.</p>}

        <button
          onClick={handleSave}
          disabled={saving || !form.thisWeekFeedUrl}
          className="mt-1 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
