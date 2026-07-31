"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface Theme {
  id: string;
  name: string;
  category: string;
  kind: "canvas" | "image" | "youtube";
  source: "canvas" | "r2" | "external" | "youtube";
  urlOrKey: string;
  startSeconds: number | null;
  endSeconds: number | null;
  isEnabled: boolean;
}

const emptyUrlForm = {
  name: "",
  category: "",
  kind: "youtube" as "youtube" | "image",
  urlOrKey: "",
  startSeconds: "",
  endSeconds: "",
};

export default function AdminFocusThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Theme | null>(null);
  const [urlForm, setUrlForm] = useState(emptyUrlForm);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({ name: "", category: "" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/focus/themes", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { themes?: Theme[] } }>)
      .then((json) => setThemes(json?.data?.themes ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    setSaving(true);
    setUrlError(null);
    try {
      const res = await fetch("/api/admin/focus/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: urlForm.name,
          category: urlForm.category,
          kind: urlForm.kind,
          source: urlForm.kind === "youtube" ? "youtube" : "external",
          urlOrKey: urlForm.urlOrKey,
          startSeconds: urlForm.kind === "youtube" && urlForm.startSeconds ? Number(urlForm.startSeconds) : null,
          endSeconds: urlForm.kind === "youtube" && urlForm.endSeconds ? Number(urlForm.endSeconds) : null,
          isEnabled: true,
          sortOrder: 0,
        }),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setUrlError(json.error === "INVALID_YOUTUBE_URL" ? "Link YouTube không hợp lệ." : "Có lỗi xảy ra, thử lại.");
        return;
      }
      setCreating(false);
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
      await fetch("/api/admin/focus/themes/upload", { method: "POST", body: fd, credentials: "include" });
      setUploading(false);
      setUploadForm({ name: "", category: "" });
      setUploadFile(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(t: Theme) {
    setTogglingId(t.id);
    try {
      await fetch(`/api/admin/focus/themes/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: !t.isEnabled }),
        credentials: "include",
      });
      setThemes((prev) => prev.map((x) => (x.id === t.id ? { ...x, isEnabled: !x.isEnabled } : x)));
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/focus/themes/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Focus: Themes</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setUrlForm(emptyUrlForm);
              setUrlError(null);
              setCreating(true);
            }}
            className="rounded-lg border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold hover:bg-[rgb(var(--border)/0.5)]"
          >
            + Add YouTube/URL
          </button>
          <button
            onClick={() => setUploading(true)}
            className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + Upload image
          </button>
        </div>
      </div>
      <p className="mb-6 text-sm text-[rgb(var(--muted))]">
        Catalog nền Ambience — "canvas" là hoạt ảnh có sẵn trong code (không xóa/thêm được kiểu mới ở
        đây), "image"/"youtube" là nội dung do admin quản lý.
      </p>

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Kind</th>
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
              themes.map((t) => (
                <tr key={t.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="px-4 py-2">{t.name}</td>
                  <td className="px-4 py-2 text-xs">{t.category}</td>
                  <td className="px-4 py-2 text-xs">{t.kind}</td>
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
                    {t.kind !== "canvas" && (
                      <button
                        onClick={() => setDeleteTarget(t)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {creating && (
        <Modal title="Thêm theme (YouTube hoặc URL ảnh)" onClose={() => setCreating(false)}>
          <div className="flex flex-col gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Tên hiển thị</span>
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
                placeholder="Chill, City, Study..."
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Loại</span>
              <select
                value={urlForm.kind}
                onChange={(e) => setUrlForm({ ...urlForm, kind: e.target.value as "youtube" | "image" })}
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              >
                <option value="youtube">YouTube (video)</option>
                <option value="image">Ảnh (URL trực tiếp)</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">
                {urlForm.kind === "youtube" ? "Link YouTube" : "URL ảnh"}
              </span>
              <input
                value={urlForm.urlOrKey}
                onChange={(e) => setUrlForm({ ...urlForm, urlOrKey: e.target.value })}
                placeholder={urlForm.kind === "youtube" ? "https://youtube.com/watch?v=..." : "https://..."}
                className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            {urlForm.kind === "youtube" && (
              <div className="flex gap-3">
                <label className="flex-1 text-sm">
                  <span className="mb-1 block text-[rgb(var(--muted))]">Bắt đầu (giây)</span>
                  <input
                    type="number"
                    min={0}
                    value={urlForm.startSeconds}
                    onChange={(e) => setUrlForm({ ...urlForm, startSeconds: e.target.value })}
                    className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
                  />
                </label>
                <label className="flex-1 text-sm">
                  <span className="mb-1 block text-[rgb(var(--muted))]">Kết thúc (giây)</span>
                  <input
                    type="number"
                    min={0}
                    value={urlForm.endSeconds}
                    onChange={(e) => setUrlForm({ ...urlForm, endSeconds: e.target.value })}
                    className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
                  />
                </label>
              </div>
            )}
          </div>
          {urlError && <p className="mt-2 text-xs text-red-600">{urlError}</p>}
          <button
            onClick={handleCreate}
            disabled={saving || !urlForm.name || !urlForm.category || !urlForm.urlOrKey}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </Modal>
      )}

      {uploading && (
        <Modal title="Upload ảnh theme" onClose={() => setUploading(false)}>
          <div className="flex flex-col gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Tên hiển thị</span>
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
                placeholder="Chill, City, Study..."
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">File (jpg/png/webp, tối đa 8MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
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
        <Modal title="Xóa theme" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Xóa <strong>{deleteTarget.name}</strong>?
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
