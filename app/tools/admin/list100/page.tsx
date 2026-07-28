"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface List100Item {
  id: string;
  rank: number;
  name: string;
  description: string;
  longDescription: string | null;
  url: string;
  imageUrl: string | null;
  category: string | null;
  tags: string;
  score: number | null;
  status: "published" | "draft";
}

const emptyForm = {
  rank: "1",
  name: "",
  description: "",
  longDescription: "",
  url: "",
  imageUrl: "",
  category: "",
  tags: "",
  score: "",
  status: "draft" as List100Item["status"],
};

export default function AdminList100Page() {
  const [items, setItems] = useState<List100Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<List100Item | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<List100Item | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/admin/list100", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { items?: List100Item[] } }>)
      .then((json) => setItems(json?.data?.items ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    const nextRank = items.length > 0 ? Math.max(...items.map((i) => i.rank)) + 1 : 1;
    setForm({ ...emptyForm, rank: String(Math.min(nextRank, 100)) });
    setError(null);
    setCreating(true);
  }

  function openEdit(i: List100Item) {
    setForm({
      rank: String(i.rank),
      name: i.name,
      description: i.description,
      longDescription: i.longDescription ?? "",
      url: i.url,
      imageUrl: i.imageUrl ?? "",
      category: i.category ?? "",
      tags: i.tags ?? "",
      score: i.score !== null ? String(i.score) : "",
      status: i.status,
    });
    setError(null);
    setEditing(i);
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/list100", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean };
      if (!json.success) {
        setError("Something went wrong.");
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
      const res = await fetch(`/api/admin/list100/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean };
      if (!json.success) {
        setError("Something went wrong.");
        return;
      }
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/list100/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleteTarget(null);
    load();
  }

  function FormFields() {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Rank (1-100)</span>
            <input
              type="number"
              min={1}
              max={100}
              value={form.rank}
              onChange={(e) => setForm({ ...form, rank: e.target.value })}
              className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Status</span>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as List100Item["status"] })
              }
              className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Name</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Short description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Long description (optional)</span>
          <textarea
            value={form.longDescription}
            onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
            rows={4}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">URL</span>
          <input
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://example.com"
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Image URL (optional)</span>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Category (optional)</span>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Score 0-10 (optional)</span>
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={form.score}
              onChange={(e) => setForm({ ...form, score: e.target.value })}
              className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
          </label>
        </div>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Tags (comma-separated, optional)</span>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="ai, free, cli"
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">List 100</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add item
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  No items yet.
                </td>
              </tr>
            ) : (
              items.map((i) => (
                <tr key={i.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="font-data px-4 py-2 text-xs">{i.rank}</td>
                  <td className="px-4 py-2">{i.name}</td>
                  <td className="px-4 py-2 text-xs">{i.category ?? "—"}</td>
                  <td className="px-4 py-2 text-xs">{i.score ?? "—"}</td>
                  <td className="px-4 py-2 text-xs">{i.status}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(i)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(i)}
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
        <Modal title="Add List 100 item" onClose={() => setCreating(false)}>
          <FormFields />
          <button
            onClick={handleCreate}
            disabled={saving || !form.name || !form.description || !form.url}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit: ${editing.name}`} onClose={() => setEditing(null)}>
          <FormFields />
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
        <Modal title="Delete item" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Delete <strong>{deleteTarget.name}</strong>? This cannot be undone.
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
