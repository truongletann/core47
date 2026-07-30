"use client";

import { useEffect, useState } from "react";
import { DEFAULT_FIELD_MAPPING } from "@/lib/market/calendarFieldMapping";

const DEFAULT_MAPPING_JSON = JSON.stringify(DEFAULT_FIELD_MAPPING, null, 2);

const emptyForm = { todayFeedUrl: "", thisWeekFeedUrl: "", fieldMapping: "" };
type FormState = typeof emptyForm;

export default function AdminMarketCalendarSettingsPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/market/calendar-settings", { credentials: "include" })
      .then(
        (r) =>
          r.json() as Promise<{
            data?: {
              settings?: {
                todayFeedUrl: string | null;
                thisWeekFeedUrl: string;
                fieldMapping: string | null;
              };
            };
          }>,
      )
      .then((json) => {
        const s = json?.data?.settings;
        if (s) {
          setForm({
            todayFeedUrl: s.todayFeedUrl ?? "",
            thisWeekFeedUrl: s.thisWeekFeedUrl,
            fieldMapping: s.fieldMapping ?? "",
          });
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
        URL nguồn lịch kinh tế — đổi ở đây không cần deploy lại code. Trang /market/calendar dùng "This week
        feed URL" để tải dữ liệu (feed "today" hiện không ổn định, chỉ lưu lại để dùng sau nếu cần).
      </p>

      <div className="mt-6 flex max-w-xl flex-col gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">This week feed URL (đang dùng)</span>
          <input
            value={form.thisWeekFeedUrl}
            onChange={(e) => setForm({ ...form, thisWeekFeedUrl: e.target.value })}
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Today feed URL (dự phòng, chưa dùng)</span>
          <input
            value={form.todayFeedUrl}
            onChange={(e) => setForm({ ...form, todayFeedUrl: e.target.value })}
            placeholder="https://..."
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="text-sm">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[rgb(var(--muted))]">
              Field mapping (JSON) — để trống = dùng mặc định
            </span>
            <button
              type="button"
              onClick={() => setForm({ ...form, fieldMapping: DEFAULT_MAPPING_JSON })}
              className="text-xs text-[rgb(var(--accent))] hover:opacity-80"
            >
              Điền mặc định
            </button>
          </div>
          <textarea
            value={form.fieldMapping}
            onChange={(e) => setForm({ ...form, fieldMapping: e.target.value })}
            rows={12}
            placeholder={DEFAULT_MAPPING_JSON}
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-xs outline-none"
          />
          <p className="mt-1 text-xs text-[rgb(var(--muted))]">
            Khi nguồn đổi tên tag (vd &lt;date&gt; → &lt;event_date&gt;), sửa giá trị tương ứng ở đây —
            không cần deploy lại. itemPath là đường dẫn tới danh sách sự kiện trong XML đã parse (vd
            "weeklyevents.event"); các field còn lại là đường dẫn bên trong 1 event.
          </p>
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
