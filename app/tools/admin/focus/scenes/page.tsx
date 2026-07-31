"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import type { Scene } from "@/lib/focus/types";

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const emptyForm = { name: "", key: "" };

export default function AdminFocusScenesPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Scene | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [keyEdited, setKeyEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/focus/scenes", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { scenes?: Scene[] } }>)
      .then((json) => setScenes(json?.data?.scenes ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setKeyEdited(false);
    setError(null);
    setCreating(true);
  }

  function errorMessage(json: { error?: string; issues?: { path: string; message: string }[] }) {
    if (json.error === "KEY_TAKEN") return "Key này đã được dùng.";
    if (json.error === "INVALID_INPUT" && json.issues?.length) {
      return json.issues.map((i) => `${i.path}: ${i.message}`).join(" · ");
    }
    return "Something went wrong.";
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/focus/scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, key: form.key, isEnabled: true, sortOrder: scenes.length }),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string; issues?: { path: string; message: string }[] };
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

  async function handleToggle(s: Scene) {
    setTogglingId(s.id);
    try {
      await fetch(`/api/admin/focus/scenes/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: !s.isEnabled }),
        credentials: "include",
      });
      setScenes((prev) => prev.map((x) => (x.id === s.id ? { ...x, isEnabled: !x.isEnabled } : x)));
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/focus/scenes/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Focus: Scenes</h1>
        <Link href="/focus/backgrounds" className="text-xs text-[rgb(var(--accent))] hover:underline">
          ← Live Backgrounds
        </Link>
      </div>
      <p className="mb-6 text-sm text-[rgb(var(--muted))]">
        Danh sách cảnh nền hiện trong Ambience. Thêm cảnh mới ở đây rồi qua Live Backgrounds để gắn
        ảnh/video — cảnh không có ảnh/video riêng sẽ dùng hoạt ảnh mặc định chung.
      </p>

      <div className="mb-4">
        <button
          onClick={openCreate}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add scene
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {loading ? (
          <p className="text-center text-sm text-[rgb(var(--muted))]">Loading...</p>
        ) : (
          scenes.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-2 rounded-xl border border-[rgb(var(--border))] p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="font-data text-xs text-[rgb(var(--muted))]">{s.key}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(s)}
                  disabled={togglingId === s.id}
                  className={`relative h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${
                    s.isEnabled ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--border))]"
                  }`}
                  aria-label={s.isEnabled ? "Disable scene" : "Enable scene"}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                      s.isEnabled ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <button
                  onClick={() => setDeleteTarget(s)}
                  className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {creating && (
        <Modal title="Thêm cảnh mới" onClose={() => setCreating(false)}>
          <div className="flex flex-col gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Tên hiển thị</span>
              <input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ name, key: keyEdited ? f.key : slugify(name) }));
                }}
                placeholder="vd: Bãi biển ban ngày"
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Key (slug, dùng nội bộ)</span>
              <input
                value={form.key}
                onChange={(e) => {
                  setKeyEdited(true);
                  setForm((f) => ({ ...f, key: e.target.value }));
                }}
                placeholder="beach-day"
                className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={saving || !form.name || !form.key}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Xóa cảnh" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Xóa <strong>{deleteTarget.name}</strong>? Ảnh/video nền đã gắn cho cảnh này (nếu có) cũng sẽ bị xóa.
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
