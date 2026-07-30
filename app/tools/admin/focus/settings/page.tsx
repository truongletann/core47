"use client";

import { useEffect, useState } from "react";

const emptyForm = { workMinutes: 25, breakMinutes: 5, longBreakMinutes: 15, sessionsBeforeLongBreak: 4 };
type FormState = typeof emptyForm;

export default function AdminFocusSettingsPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/focus/settings", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { settings?: FormState } }>)
      .then((json) => {
        if (json?.data?.settings) setForm(json.data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/focus/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-[rgb(var(--muted))]">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Focus: Settings</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Thời lượng Pomodoro mặc định — áp dụng cho người dùng chưa từng đổi timer của họ.
      </p>

      <div className="mt-6 flex max-w-sm flex-col gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Work (phút)</span>
          <input
            type="number"
            value={form.workMinutes}
            onChange={(e) => setForm({ ...form, workMinutes: Number(e.target.value) })}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Break (phút)</span>
          <input
            type="number"
            value={form.breakMinutes}
            onChange={(e) => setForm({ ...form, breakMinutes: Number(e.target.value) })}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Long break (phút)</span>
          <input
            type="number"
            value={form.longBreakMinutes}
            onChange={(e) => setForm({ ...form, longBreakMinutes: Number(e.target.value) })}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Số phiên trước long break</span>
          <input
            type="number"
            value={form.sessionsBeforeLongBreak}
            onChange={(e) => setForm({ ...form, sessionsBeforeLongBreak: Number(e.target.value) })}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>

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
