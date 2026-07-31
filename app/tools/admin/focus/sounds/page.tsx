"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface SoundTrack {
  id: string;
  name: string;
  category: string;
  source: "bundled" | "r2" | "external";
  urlOrKey: string;
  isEnabled: boolean;
  sortOrder: number;
}

const emptyUrlForm = { name: "", category: "", spotifyUrl: "", urlOrKey: "" };

export default function AdminFocusSoundsPage() {
  const [tracks, setTracks] = useState<SoundTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingUrl, setAddingUrl] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SoundTrack | null>(null);
  const [urlForm, setUrlForm] = useState(emptyUrlForm);
  const [uploadForm, setUploadForm] = useState({ name: "", category: "" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/focus/sounds", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { tracks?: SoundTrack[] } }>)
      .then((json) => setTracks(json?.data?.tracks ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAddExternal() {
    setSaving(true);
    try {
      await fetch("/api/admin/focus/sounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: urlForm.name,
          category: urlForm.category,
          source: "external",
          urlOrKey: urlForm.urlOrKey,
          isEnabled: true,
          sortOrder: 0,
        }),
        credentials: "include",
      });
      setAddingUrl(false);
      setUrlForm(emptyUrlForm);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload() {
    if (!uploadFile) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      fd.append("name", uploadForm.name);
      fd.append("category", uploadForm.category);
      await fetch("/api/admin/focus/sounds/upload", { method: "POST", body: fd, credentials: "include" });
      setUploading(false);
      setUploadForm({ name: "", category: "" });
      setUploadFile(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(t: SoundTrack) {
    setTogglingId(t.id);
    try {
      await fetch(`/api/admin/focus/sounds/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: !t.isEnabled }),
        credentials: "include",
      });
      setTracks((prev) => prev.map((x) => (x.id === t.id ? { ...x, isEnabled: !x.isEnabled } : x)));
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/focus/sounds/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Focus: Sounds</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setAddingUrl(true)}
            className="rounded-lg border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold hover:bg-[rgb(var(--border)/0.5)]"
          >
            + Add URL
          </button>
          <button
            onClick={() => setUploading(true)}
            className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + Upload file
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Source</th>
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
              tracks.map((t) => (
                <tr key={t.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="px-4 py-2">{t.name}</td>
                  <td className="px-4 py-2 text-xs">{t.category}</td>
                  <td className="px-4 py-2 text-xs">{t.source}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleToggle(t)}
                      disabled={togglingId === t.id}
                      className={`relative h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${
                        t.isEnabled ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--border))]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                          t.isEnabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setDeleteTarget(t)}
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

      {addingUrl && (
        <Modal title="Add sound from URL" onClose={() => setAddingUrl(false)}>
          <div className="flex flex-col gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Name</span>
              <input
                value={urlForm.name}
                onChange={(e) => setUrlForm({ ...urlForm, name: e.target.value })}
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Category</span>
              <input
                value={urlForm.category}
                onChange={(e) => setUrlForm({ ...urlForm, category: e.target.value })}
                placeholder="rain, nature, ambience..."
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Audio URL</span>
              <input
                value={urlForm.urlOrKey}
                onChange={(e) => setUrlForm({ ...urlForm, urlOrKey: e.target.value })}
                placeholder="https://..."
                className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
          </div>
          <button
            onClick={handleAddExternal}
            disabled={saving || !urlForm.name || !urlForm.urlOrKey}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add"}
          </button>
        </Modal>
      )}

      {uploading && (
        <Modal title="Upload sound file" onClose={() => setUploading(false)}>
          <div className="flex flex-col gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Name</span>
              <input
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Category</span>
              <input
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                placeholder="rain, nature, ambience..."
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">File (mp3/wav/ogg, tối đa 8MB)</span>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm"
              />
            </label>
          </div>
          <button
            onClick={handleUpload}
            disabled={saving || !uploadFile || !uploadForm.name || !uploadForm.category}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Uploading..." : "Upload"}
          </button>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete sound" onClose={() => setDeleteTarget(null)}>
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
