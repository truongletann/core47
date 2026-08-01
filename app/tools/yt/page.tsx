"use client";

import { useState } from "react";
import { Download, Loader2, Music, Video, Image as ImageIcon, AlertCircle } from "lucide-react";
import {
  VIDEO_QUALITIES,
  AUDIO_FORMATS,
  DOWNLOAD_MODES,
  type ResolveDownloadInput,
} from "@/lib/downloader/schema";

type DownloadMode = (typeof DOWNLOAD_MODES)[number];

interface PickerItem {
  type: string;
  url: string;
  thumb?: string;
}

interface ResolveData {
  status: "tunnel" | "redirect" | "picker" | "error";
  url?: string;
  filename?: string;
  items?: PickerItem[];
  audioUrl?: string;
  errorMessage?: string;
}

const MODE_LABELS: Record<DownloadMode, { label: string; icon: typeof Video }> = {
  auto: { label: "Video + Audio", icon: Video },
  mute: { label: "Video only", icon: Video },
  audio: { label: "Audio only", icon: Music },
};

function errorText(code: string | undefined): string {
  if (code === "DOWNLOADER_NOT_CONFIGURED") {
    return "Downloader chưa được cấu hình — admin cần đặt resolver API trong trang admin.";
  }
  if (code === "content.post.unavailable" || code === "fetch.fail") {
    return "Không lấy được nội dung từ link này — link có thể riêng tư hoặc đã bị xoá.";
  }
  return code || "Có lỗi xảy ra, thử lại sau.";
}

export default function DownloaderPage() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<DownloadMode>("auto");
  const [quality, setQuality] = useState<(typeof VIDEO_QUALITIES)[number]>("1080");
  const [audioFormat, setAudioFormat] = useState<(typeof AUDIO_FORMATS)[number]>("mp3");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResolveData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body: ResolveDownloadInput = {
        url: url.trim(),
        videoQuality: quality,
        audioFormat,
        downloadMode: mode,
      };
      const res = await fetch("/api/download/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { success: boolean; data?: ResolveData; error?: string };
      if (!json.success) {
        setError(errorText(json.error));
        return;
      }
      if (json.data?.status === "error") {
        setError(errorText(json.data.errorMessage));
        return;
      }
      setResult(json.data ?? null);
    } catch {
      setError("Không kết nối được, thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Universal Downloader</h1>
        <p className="mt-3 text-[rgb(var(--muted))]">
          Dán link YouTube, Instagram, Facebook, TikTok, Twitter/X... — chọn chất lượng, tải trực tiếp.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Dán link video/ảnh vào đây..."
          className="font-data w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {DOWNLOAD_MODES.map((m) => {
            const Icon = MODE_LABELS[m].icon;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  mode === m
                    ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
                    : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                }`}
              >
                <Icon size={13} /> {MODE_LABELS[m].label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {mode !== "audio" && (
            <label className="text-xs">
              <span className="mb-1 block text-[rgb(var(--muted))]">Video quality</span>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as (typeof VIDEO_QUALITIES)[number])}
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              >
                {VIDEO_QUALITIES.map((q) => (
                  <option key={q} value={q}>
                    {q === "max" ? "Best available" : `${q}p`}
                  </option>
                ))}
              </select>
            </label>
          )}
          {mode !== "mute" && (
            <label className="text-xs">
              <span className="mb-1 block text-[rgb(var(--muted))]">Audio format</span>
              <select
                value={audioFormat}
                onChange={(e) => setAudioFormat(e.target.value as (typeof AUDIO_FORMATS)[number])}
                className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              >
                {AUDIO_FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !url.trim()}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[rgb(var(--accent))] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {loading ? "Đang xử lý..." : "Lấy link tải"}
        </button>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (result.status === "tunnel" || result.status === "redirect") && result.url && (
          <div className="mt-5 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-4">
            <p className="text-sm text-[rgb(var(--muted))]">Sẵn sàng tải.</p>
            <a
              href={result.url}
              download={result.filename}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[rgb(var(--accent))] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <Download size={15} /> {result.filename || "Download"}
            </a>
          </div>
        )}

        {result && result.status === "picker" && result.items && (
          <div className="mt-5">
            <p className="mb-2 text-sm text-[rgb(var(--muted))]">
              {result.items.length} items found — download individually:
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {result.items.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))]"
                >
                  {item.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumb} alt="" className="h-full w-full object-cover" />
                  ) : item.type === "photo" ? (
                    <ImageIcon size={24} className="text-[rgb(var(--muted))]" />
                  ) : (
                    <Video size={24} className="text-[rgb(var(--muted))]" />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Download size={20} className="text-white" />
                  </span>
                </a>
              ))}
            </div>
            {result.audioUrl && (
              <a
                href={result.audioUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-[rgb(var(--border))] px-4 py-2.5 text-sm font-semibold hover:bg-[rgb(var(--border)/0.5)]"
              >
                <Music size={15} /> Download audio track
              </a>
            )}
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-[rgb(var(--muted))]">
        Dùng cho nội dung bạn có quyền tải. Tôn trọng bản quyền và điều khoản của từng nền tảng.
      </p>
    </main>
  );
}
