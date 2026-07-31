"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import type { Scene } from "@/lib/focus/types";

interface SceneBackground {
  sceneKey: string;
  mediaType: "image" | "video";
  source: "r2" | "external" | "youtube";
  urlOrKey: string;
  startSeconds: number | null;
  endSeconds: number | null;
}

const emptyUrlForm = {
  source: "external" as "external" | "youtube",
  mediaType: "image" as "image" | "video",
  urlOrKey: "",
  startSeconds: "",
  endSeconds: "",
};

export default function AdminFocusBackgroundsPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [backgrounds, setBackgrounds] = useState<SceneBackground[]>([]);
  const [loading, setLoading] = useState(true);
  const [urlModal, setUrlModal] = useState<string | null>(null);
  const [uploadModal, setUploadModal] = useState<string | null>(null);
  const [urlForm, setUrlForm] = useState(emptyUrlForm);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/focus/scenes", { credentials: "include" }).then(
        (r) => r.json() as Promise<{ data?: { scenes?: Scene[] } }>,
      ),
      fetch("/api/admin/focus/backgrounds", { credentials: "include" }).then(
        (r) => r.json() as Promise<{ data?: { backgrounds?: SceneBackground[] } }>,
      ),
    ])
      .then(([scenesJson, bgJson]) => {
        setScenes(scenesJson?.data?.scenes ?? []);
        setBackgrounds(bgJson?.data?.backgrounds ?? []);
      })
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
    setUrlError(null);
    try {
      const res = await fetch("/api/admin/focus/backgrounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sceneKey: urlModal,
          source: urlForm.source,
          mediaType: urlForm.source === "youtube" ? "video" : urlForm.mediaType,
          urlOrKey: urlForm.urlOrKey,
          startSeconds: urlForm.source === "youtube" && urlForm.startSeconds ? Number(urlForm.startSeconds) : null,
          endSeconds: urlForm.source === "youtube" && urlForm.endSeconds ? Number(urlForm.endSeconds) : null,
        }),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setUrlError(
          json.error === "INVALID_YOUTUBE_URL" ? "Link YouTube không hợp lệ." : "Có lỗi xảy ra, thử lại.",
        );
        return;
      }
      setUrlModal(null);
      setUrlForm(emptyUrlForm);
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
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Focus: Live Backgrounds</h1>
        <Link href="/focus/scenes" className="text-xs text-[rgb(var(--accent))] hover:underline">
          Quản lý danh sách cảnh →
        </Link>
      </div>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Ảnh hoặc video nền cho từng cảnh, thay cho hoạt ảnh canvas mặc định. Video/ảnh nên quay/chụp
        loop được (không giật khi lặp lại).
      </p>

      {loading ? (
        <p className="mt-6 text-center text-sm text-[rgb(var(--muted))]">Loading...</p>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {scenes.map((s) => {
            const bg = backgroundFor(s.key);
            return (
              <div
                key={s.key}
                className="flex flex-col gap-2 rounded-xl border border-[rgb(var(--border))] p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-[rgb(var(--muted))]">
                    {bg
                      ? bg.source === "youtube"
                        ? `YouTube${bg.startSeconds != null ? ` · ${bg.startSeconds}s–${bg.endSeconds}s` : ""}`
                        : `${bg.mediaType} · ${bg.source}`
                      : "Mặc định (canvas)"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setUrlForm(emptyUrlForm);
                      setUrlError(null);
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
        <Modal title={`Đặt ảnh/video — ${scenes.find((s) => s.key === urlModal)?.name}`} onClose={() => setUrlModal(null)}>
          <div className="flex flex-col gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">Nguồn</span>
              <select
                value={urlForm.source}
                onChange={(e) => setUrlForm({ ...urlForm, source: e.target.value as "external" | "youtube" })}
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              >
                <option value="external">Link ảnh/video trực tiếp</option>
                <option value="youtube">YouTube</option>
              </select>
            </label>

            {urlForm.source === "external" && (
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
            )}

            <label className="text-sm">
              <span className="mb-1 block text-[rgb(var(--muted))]">
                {urlForm.source === "youtube" ? "Link YouTube" : "URL"}
              </span>
              <input
                value={urlForm.urlOrKey}
                onChange={(e) => setUrlForm({ ...urlForm, urlOrKey: e.target.value })}
                placeholder={urlForm.source === "youtube" ? "https://youtube.com/watch?v=..." : "https://..."}
                className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            </label>

            {urlForm.source === "youtube" && (
              <div className="flex gap-3">
                <label className="flex-1 text-sm">
                  <span className="mb-1 block text-[rgb(var(--muted))]">Bắt đầu (giây)</span>
                  <input
                    type="number"
                    min={0}
                    value={urlForm.startSeconds}
                    onChange={(e) => setUrlForm({ ...urlForm, startSeconds: e.target.value })}
                    placeholder="0"
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
                    placeholder="90"
                    className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
                  />
                </label>
              </div>
            )}
            {urlForm.source === "youtube" && (
              <p className="text-xs text-[rgb(var(--muted))]">
                Vd: bắt đầu 90 giây = phút 1:30. Để trống = chạy từ đầu / tới hết video. Video sẽ tự tắt
                tiếng và lặp lại đoạn này.
              </p>
            )}
          </div>
          {urlError && <p className="mt-2 text-xs text-red-600">{urlError}</p>}
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
        <Modal title={`Upload ảnh/video — ${scenes.find((s) => s.key === uploadModal)?.name}`} onClose={() => setUploadModal(null)}>
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
