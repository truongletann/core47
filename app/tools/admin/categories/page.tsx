"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [form, setForm] = useState({ id: "", name: "", sortOrder: "0" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/admin/categories", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { categories?: Category[] } }>)
      .then((json) => setCategories(json?.data?.categories ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm({ id: "", name: "", sortOrder: "0" });
    setError(null);
    setCreating(true);
  }

  function openEdit(c: Category) {
    setForm({ id: c.id, name: c.name, sortOrder: String(c.sortOrder) });
    setError(null);
    setEditing(c);
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setError(json.error === "ID_TAKEN" ? "This ID already exists." : "Failed to create.");
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
      const res = await fetch(`/api/admin/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, sortOrder: form.sortOrder }),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean };
      if (!json.success) {
        setError("Failed to update.");
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
    setError(null);
    const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const json = (await res.json()) as { success: boolean; error?: string };
    if (!json.success) {
      setError(
        json.error === "CATEGORY_IN_USE"
          ? "Cannot delete: some tools still use this category."
          : "Failed to delete.",
      );
      return;
    }
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Categories</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add category
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Sort order</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  Loading...
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="font-data px-4 py-2 text-xs">{c.id}</td>
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.sortOrder}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
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
        <Modal title="Add category" onClose={() => setCreating(false)}>
          <div className="flex flex-col gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">ID (slug)</span>
              <input
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                placeholder="e.g. media"
                className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Sort order</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              onClick={handleCreate}
              disabled={saving || !form.id || !form.name}
              className="mt-1 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create"}
            </button>
          </div>
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit category: ${editing.id}`} onClose={() => setEditing(null)}>
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
              <span className="mb-1 block text-[rgb(var(--muted))]">Sort order</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="mt-1 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete category" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Delete category <strong>{deleteTarget.name}</strong>? This cannot be undone.
          </p>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
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
