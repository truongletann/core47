"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface RssSource {
  id: string;
  name: string;
  url: string;
  category: string | null;
  enabled: boolean;
}

const emptyForm = { name: "", url: "", category: "", enabled: true };
type FormState = typeof emptyForm;

function SourceForm({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Name</span>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">RSS URL</span>
        <input
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://..."
          className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Category (optional)</span>
        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="forex, macro, crypto..."
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
        />
        <span>Enabled</span>
      </label>
    </div>
  );
}

export default function AdminMarketNewsSourcesPage() {
  const [sources, setSources] = useState<RssSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<RssSource | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RssSource | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/market/news-sources", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { sources?: RssSource[] } }>)
      .then((json) => setSources(json?.data?.sources ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setError(null);
    setCreating(true);
  }

  function openEdit(s: RssSource) {
    setForm({ name: s.name, url: s.url, category: s.category ?? "", enabled: s.enabled });
    setError(null);
    setEditing(s);
  }

  function errorMessage(json: {
    error?: string;
    issues?: { path: string; message: string }[];
    message?: string;
  }) {
    if (json.error === "URL_TAKEN") return "This RSS URL is already added.";
    if (json.error === "INVALID_INPUT" && json.issues?.length) {
      return json.issues.map((i) => `${i.path}: ${i.message}`).join(" · ");
    }
    if (json.error === "SERVER_ERROR" && json.message) return `Server error: ${json.message}`;
    return "Something went wrong.";
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/market/news-sources", {
        method: "POST",
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
      setCreating(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/market/news-sources/${editing.id}`, {
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
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleEnabled(s: RssSource) {
    setTogglingId(s.id);
    try {
      await fetch(`/api/admin/market/news-sources/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: s.name, url: s.url, category: s.category, enabled: !s.enabled }),
        credentials: "include",
      });
      setSources((prev) => prev.map((x) => (x.id === s.id ? { ...x, enabled: !x.enabled } : x)));
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/market/news-sources/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Market: News Sources</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add source
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">URL</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Enabled</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  Loading...
                </td>
              </tr>
            ) : sources.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  No sources yet.
                </td>
              </tr>
            ) : (
              sources.map((s) => (
                <tr key={s.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="font-data max-w-xs truncate px-4 py-2 text-xs">{s.url}</td>
                  <td className="px-4 py-2 text-xs">{s.category ?? "—"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleToggleEnabled(s)}
                      disabled={togglingId === s.id}
                      className={`relative h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${
                        s.enabled ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--border))]"
                      }`}
                      aria-label={s.enabled ? "Disable source" : "Enable source"}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                          s.enabled ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {creating && (
        <Modal title="Add RSS source" onClose={() => setCreating(false)}>
          <SourceForm form={form} setForm={setForm} />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={saving || !form.name || !form.url}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit: ${editing.name}`} onClose={() => setEditing(null)}>
          <SourceForm form={form} setForm={setForm} />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete source" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Delete <strong>{deleteTarget.name}</strong>? Its already-fetched articles will also be removed.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-sm hover:bg-[rgb(var(--border)/0.5)]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
