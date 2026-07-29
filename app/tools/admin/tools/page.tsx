"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  subdomain: string;
  icon: string;
  categoryId: string;
  status: "active" | "beta" | "soon";
  sortOrder: number;
}

interface Category {
  id: string;
  name: string;
}

const emptyForm = {
  slug: "",
  name: "",
  description: "",
  subdomain: "",
  icon: "Box",
  categoryId: "",
  status: "active" as Tool["status"],
  sortOrder: "0",
};

type FormState = typeof emptyForm;

function ToolForm({
  form,
  setForm,
  categories,
  error,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  categories: Category[];
  error: string | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Slug</span>
        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="e.g. genqr"
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
        <span className="mb-1 block text-[rgb(var(--muted))]">Description</span>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Subdomain</span>
        <input
          value={form.subdomain}
          onChange={(e) => setForm({ ...form, subdomain: e.target.value })}
          placeholder="e.g. genqr.core47.xyz"
          className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">
          Icon (Lucide icon name, e.g. QrCode)
        </span>
        <input
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Category</span>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Status</span>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Tool["status"] })}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          >
            <option value="active">Active</option>
            <option value="beta">Beta</option>
            <option value="soon">Coming soon</option>
          </select>
        </label>
      </div>
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
    </div>
  );
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Tool | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tool | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/tools", { credentials: "include" }).then(
        (r) => r.json() as Promise<{ data?: { tools?: Tool[] } }>,
      ),
      fetch("/api/admin/categories", { credentials: "include" }).then(
        (r) => r.json() as Promise<{ data?: { categories?: Category[] } }>,
      ),
    ])
      .then(([t, c]) => {
        setTools(t?.data?.tools ?? []);
        setCategories(c?.data?.categories ?? []);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setError(null);
    setCreating(true);
  }

  function openEdit(t: Tool) {
    setForm({
      slug: t.slug,
      name: t.name,
      description: t.description,
      subdomain: t.subdomain,
      icon: t.icon,
      categoryId: t.categoryId,
      status: t.status,
      sortOrder: String(t.sortOrder),
    });
    setError(null);
    setEditing(t);
  }

  function errorMessage(code?: string) {
    if (code === "SLUG_TAKEN") return "This slug already exists.";
    if (code === "SUBDOMAIN_TAKEN") return "This subdomain is already used.";
    return "Something went wrong.";
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setError(errorMessage(json.error));
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
      const res = await fetch(`/api/admin/tools/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setError(errorMessage(json.error));
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
    await fetch(`/api/admin/tools/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Tools</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add tool
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Subdomain</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Order</th>
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
            ) : (
              tools.map((t) => (
                <tr key={t.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="px-4 py-2">{t.name}</td>
                  <td className="font-data px-4 py-2 text-xs text-[rgb(var(--accent))]">
                    {t.subdomain}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {categories.find((c) => c.id === t.categoryId)?.name ?? t.categoryId}
                  </td>
                  <td className="px-4 py-2 text-xs">{t.status}</td>
                  <td className="px-4 py-2 text-xs">{t.sortOrder}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(t)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(t)}
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
        <Modal title="Add tool" onClose={() => setCreating(false)}>
          <ToolForm form={form} setForm={setForm} categories={categories} error={error} />
          <button
            onClick={handleCreate}
            disabled={saving || !form.slug || !form.name || !form.subdomain}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit tool: ${editing.name}`} onClose={() => setEditing(null)}>
          <ToolForm form={form} setForm={setForm} categories={categories} error={error} />
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
        <Modal title="Delete tool" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Delete tool <strong>{deleteTarget.name}</strong>? This cannot be undone.
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
