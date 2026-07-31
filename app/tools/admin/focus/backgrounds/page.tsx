"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { SCENES } from "@/lib/focus/types";

interface SceneBackground {
  sceneKey: string;
  mediaType: "image" | "video";
  source: "r2" | "external";
  urlOrKey: string;
}

export default function AdminFocusBackgroundsPage() {
  const [backgrounds, setBackgrounds] = useState<SceneBackground[]>([]);
  const [loading, setLoading] = useState(true);
  const [urlModal, setUrlModal] = useState<string | null>(null);
  const [uploadModal, setUploadModal] = useState<string | null>(null);
  const [urlForm, setUrlForm] = useState({ mediaType: "image" as "image" | "video", urlOrKey: "" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/admin/focus/backgrounds", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { backgrounds?: SceneBackground[] } }>)
      .then((json) => setBackgrounds(json?.data?.backgrounds ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function backgroundFor(sceneKey: string) {
    return backgrounds.find((b) => b.sceneKey === sceneKey);
  }

  async function handleSetUrl() {
    if (!urlModal) return;
    setSaving(true);
    try {
      await fetch("/api/admin/focus/backgrounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sceneKey: urlModal, source: "external", ...urlForm }),
        credentials: "include",
      });
      setUrlModal(null);
      setUrlForm({ mediaType: "image", urlOrKey: "" });
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload() {
    if (!uploadModal || !uploadFile) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      fd.append("sceneKey", uploadModal);
      await fetch("/api/admin/focus/backgrounds/upload", { method: "POST", body: fd, credentials: "include" });
      setUploadModal(null);
      setUploadFile(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(sceneKey: string) {
    await fetch(`/api/admin/focus/backgrounds/${sceneKey}`, { method: "DELETE", credentials: "include" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Focus: Live Backgrounds</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Ảnh hoặc video nền cho từng cảnh, thay cho hoạt ảnh canvas mặc định. Video/ảnh nên quay/chụp
        loop được (không giật khi lặp lại).
      </p>

      {loading ? (
        <p className="mt-6 text-center text-sm text-[rgb(var(--muted))]">Loading...</p>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {SCENES.map((s) => {
            const bg = backgroundFor(s.key);
            return (
              <div
                key={s.key}
                className="flex flex-col gap-2 rounded-xl border border-[rgb(var(--border))] p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-[rgb(var(--muted))]">
                    {bg ? `${bg.mediaType} · ${bg.source}` : "Mặc định (canvas)"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setUrlForm({ mediaType: "image", urlOrKey: "" });
                      setUrlModal(s.key);
                    }}
                    className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                  >
                    + URL
                  </button>
                  <button
                    onClick={() => setUploadModal(s.key)}
                    className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                  >
                    + Upload
                  </button>
                  {bg && (
                    <button
                      onClick={() => handleRemove(s.key)}
                      className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {urlModal && (
        <Modal title={`Đặt ảnh/video từ URL — ${SCENES.find((s) => s.key === urlModal)?.name}`} onClose={() => setUrlModal(null)}>
          <div className="flex flex-col gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Loại</span>
              <select
                value={urlForm.mediaType}
                onChange={(e) => setUrlForm({ ...urlForm, mediaType: e.target.value as "image" | "video" })}
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              >
                <option value="image">Ảnh</option>
                <option value="video">Video</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">URL</span>
              <input
                value={urlForm.urlOrKey}
                onChange={(e) => setUrlForm({ ...urlForm, urlOrKey: e.target.value })}
                placeholder="https://..."
                className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>
          </div>
          <button
            onClick={handleSetUrl}
            disabled={saving || !urlForm.urlOrKey}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </Modal>
      )}

      {uploadModal && (
        <Modal title={`Upload ảnh/video — ${SCENES.find((s) => s.key === uploadModal)?.name}`} onClose={() => setUploadModal(null)}>
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">File (jpg/png/webp/mp4/webm, tối đa 20MB)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
          </label>
          <button
            onClick={handleUpload}
            disabled={saving || !uploadFile}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Uploading..." : "Upload"}
          </button>
        </Modal>
      )}
    </div>
  );
}
