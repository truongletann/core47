"use client";

import { useEffect, useState } from "react";

const emptyForm = { apiBaseUrl: "", apiKey: "" };
type FormState = typeof emptyForm;

export default function AdminDownloadSettingsPage() {
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
    fetch("/api/admin/download-settings", { credentials: "include" })
      .then(
        (r) =>
          r.json() as Promise<{
            data?: { settings?: { apiBaseUrl: string | null; hasApiKey: boolean; apiKeyPreview: string | null } };
          }>,
      )
      .then((json) => {
        const s = json?.data?.settings;
        if (s) {
          setForm({ apiBaseUrl: s.apiBaseUrl ?? "", apiKey: "" });
          setHasKey(s.hasApiKey);
          setKeyPreview(s.apiKeyPreview);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/download-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, clearApiKey: clearKey }),
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setError("Something went wrong.");
        return;
      }
      setSaved(true);
      if (clearKey) {
        setHasKey(false);
        setKeyPreview(null);
      } else if (form.apiKey) {
        setHasKey(true);
        setKeyPreview(`••••${form.apiKey.slice(-4)}`);
      }
      setForm((f) => ({ ...f, apiKey: "" }));
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
      <h1 className="font-display text-2xl font-semibold">Downloader: Settings</h1>
      <p className="mt-1 max-w-xl text-sm text-[rgb(var(--muted))]">
        Cloudflare Workers can't run yt-dlp/ffmpeg, so yt.core47.xyz calls out to an external
        Cobalt-API-compatible resolver (self-hosted at{" "}
        <a href="https://github.com/imputnet/cobalt" target="_blank" rel="noopener noreferrer" className="underline">
          github.com/imputnet/cobalt
        </a>{" "}
        or another compatible instance — the public api.cobalt.tools instance explicitly disallows
        third-party programmatic use). Leave the base URL empty to keep the downloader disabled.
      </p>

      <div className="mt-6 flex max-w-xl flex-col gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Resolver API base URL</span>
          <input
            value={form.apiBaseUrl}
            onChange={(e) => setForm({ ...form, apiBaseUrl: e.target.value })}
            placeholder="https://your-cobalt-instance.example.com"
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">
            API key (optional)
            {hasKey && !clearKey && <span className="ml-2 text-xs text-emerald-600">saved {keyPreview}</span>}
          </span>
          <div className="flex gap-2">
            <input
              type={reveal ? "text" : "password"}
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              disabled={clearKey}
              placeholder={hasKey ? "Leave blank to keep current key" : "Only if your instance requires one"}
              className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setReveal(!reveal)}
              className="shrink-0 rounded-md border border-[rgb(var(--border))] px-3 py-2 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            >
              {reveal ? "Hide" : "Show"}
            </button>
          </div>
          {hasKey && (
            <label className="mt-1 flex items-center gap-2 text-xs text-[rgb(var(--muted))]">
              <input
                type="checkbox"
                checked={clearKey}
                onChange={(e) => {
                  setClearKey(e.target.checked);
                  if (e.target.checked) setForm((f) => ({ ...f, apiKey: "" }));
                }}
              />
              Clear saved key
            </label>
          )}
        </label>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {saved && <p className="text-xs text-emerald-600">Saved.</p>}

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
