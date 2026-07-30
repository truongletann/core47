"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface Playlist {
  id: string;
  name: string;
  spotifyEmbedUrl: string;
  category: string | null;
  isEnabled: boolean;
}

const emptyForm = { name: "", spotifyEmbedUrl: "", category: "" };
type FormState = typeof emptyForm;

export default function AdminFocusPlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Playlist | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/focus/playlists", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { playlists?: Playlist[] } }>)
      .then((json) => setPlaylists(json?.data?.playlists ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function errorMessage(json: { error?: string; issues?: { path: string; message: string }[] }) {
    if (json.error === "INVALID_INPUT" && json.issues?.length) {
      return json.issues.map((i) => `${i.path}: ${i.message}`).join(" · ");
    }
    return "Something went wrong.";
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/focus/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string; issues?: { path: string; message: string }[] };
      if (!json.success) {
        setError(errorMessage(json));
        return;
      }
      setCreating(false);
      setForm(emptyForm);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(p: Playlist) {
    setTogglingId(p.id);
    try {
      await fetch(`/api/admin/focus/playlists/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: !p.isEnabled }),
        credentials: "include",
      });
      setPlaylists((prev) => prev.map((x) => (x.id === p.id ? { ...x, isEnabled: !x.isEnabled } : x)));
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/focus/playlists/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Focus: Playlists</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
            setError(null);
            setCreating(true);
          }}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add playlist
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Embed URL</th>
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
            ) : (
              playlists.map((p) => (
                <tr key={p.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2 text-xs">{p.category ?? "—"}</td>
                  <td className="font-data max-w-xs truncate px-4 py-2 text-xs">{p.spotifyEmbedUrl}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleToggle(p)}
                      disabled={togglingId === p.id}
                      className={`relative h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${
                        p.isEnabled ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--border))]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                          p.isEnabled ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {creating && (
        <Modal title="Add Spotify playlist" onClose={() => setCreating(false)}>
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
              <span className="mb-1 block text-[rgb(var(--muted))]">Category</span>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="lofi, jazz, chill..."
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Spotify embed URL</span>
              <input
                value={form.spotifyEmbedUrl}
                onChange={(e) => setForm({ ...form, spotifyEmbedUrl: e.target.value })}
                placeholder="https://open.spotify.com/embed/playlist/..."
                className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={saving || !form.name || !form.spotifyEmbedUrl}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete playlist" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Delete <strong>{deleteTarget.name}</strong>?
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
