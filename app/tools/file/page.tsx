"use client";

import { useState } from "react";
import { Image as ImageIcon, FileText, Loader2, Download, Clock } from "lucide-react";
import JSZip from "jszip";
import { FileDropzone } from "@/components/converters/FileDropzone";
import { downloadBlob } from "@/lib/utils/download";
import { convertImage, extensionForMime, type ImageMime } from "@/lib/converters/images";
import { docxToPdf, pdfToDocx } from "@/lib/converters/wordPdf";
import { cn } from "@/lib/utils/cn";

type Tab = "image" | "document";

const TABS: { id: Tab; label: string; icon: typeof ImageIcon }[] = [
  { id: "image", label: "Ảnh", icon: ImageIcon },
  { id: "document", label: "Tài liệu", icon: FileText },
];

function ActionButton({ onClick, loading, disabled, children }: { onClick: () => void; loading: boolean; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center justify-center gap-2 rounded-lg bg-[rgb(var(--accent))] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
      {children}
    </button>
  );
}

function ErrorNote({ error }: { error: string | null }) {
  if (!error) return null;
  return <p className="mt-3 text-sm text-red-600">{error}</p>;
}

function baseName(name: string) {
  return name.replace(/\.[^.]+$/, "");
}

export default function FileConverterPage() {
  const [tab, setTab] = useState<Tab>("image");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <span className="font-data inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted))]">
          <span className="led-dot bg-[rgb(var(--accent))]" />
          file.core47.xyz
        </span>
        <h1 className="font-display mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          File <span className="text-[rgb(var(--accent))]">Converter</span>
        </h1>
        <p className="mt-3 text-[rgb(var(--muted))]">
          Chuyển đổi định dạng ảnh và tài liệu — xử lý hoàn toàn trên trình duyệt, file không upload lên máy chủ.
        </p>
      </div>

      <div className="mx-auto mt-8 flex w-fit gap-1 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
            )}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">
        {tab === "image" && <ImageTab />}
        {tab === "document" && <DocumentTab />}
      </div>

      <p className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-xs text-[rgb(var(--muted))]">
        <Clock size={13} /> Chuyển đổi video (mp4/webm...) đang được phát triển — sẽ có sau.
      </p>
    </main>
  );
}

function ImageTab() {
  const [files, setFiles] = useState<File[]>([]);
  const [target, setTarget] = useState<ImageMime>("image/png");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert() {
    if (files.length === 0) return;
    setError(null);
    setLoading(true);
    try {
      const ext = extensionForMime(target);
      if (files.length === 1) {
        const blob = await convertImage(files[0], target);
        downloadBlob(blob, `${baseName(files[0].name)}.${ext}`);
      } else {
        const zip = new JSZip();
        for (const file of files) {
          const blob = await convertImage(file, target);
          zip.file(`${baseName(file.name)}.${ext}`, blob);
        }
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, "anh-da-chuyen-doi.zip");
      }
    } catch {
      setError("Không chuyển được — kiểm tra lại các ảnh đã chọn.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FileDropzone accept="image/*" multiple files={files} onFiles={setFiles} hint="Chọn 1 hoặc nhiều ảnh — JPG, PNG, WebP, GIF, BMP..." />
      <div>
        <label className="text-sm font-medium">Chuyển sang định dạng</label>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value as ImageMime)}
          className="mt-1.5 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        >
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPG</option>
          <option value="image/webp">WebP</option>
          <option value="image/bmp">BMP</option>
        </select>
      </div>
      <ActionButton onClick={handleConvert} loading={loading} disabled={files.length === 0}>
        <Download size={16} /> Chuyển {files.length > 1 ? `${files.length} ảnh` : "ảnh"}
      </ActionButton>
      <ErrorNote error={error} />
    </div>
  );
}

type DocDirection = "docx2pdf" | "pdf2docx";

function DocumentTab() {
  const [direction, setDirection] = useState<DocDirection>("docx2pdf");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert() {
    if (!files[0]) return;
    setError(null);
    setLoading(true);
    try {
      if (direction === "docx2pdf") {
        const bytes = await docxToPdf(files[0]);
        downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }), `${baseName(files[0].name)}.pdf`);
      } else {
        const blob = await pdfToDocx(files[0]);
        downloadBlob(blob, `${baseName(files[0].name)}.docx`);
      }
    } catch {
      setError("Không chuyển được — kiểm tra lại định dạng file đã chọn.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit gap-1 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-1">
        <button
          type="button"
          onClick={() => {
            setDirection("docx2pdf");
            setFiles([]);
          }}
          className={cn(
            "rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
            direction === "docx2pdf" ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
          )}
        >
          Word → PDF
        </button>
        <button
          type="button"
          onClick={() => {
            setDirection("pdf2docx");
            setFiles([]);
          }}
          className={cn(
            "rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
            direction === "pdf2docx" ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
          )}
        >
          PDF → Word
        </button>
      </div>

      <FileDropzone
        accept={direction === "docx2pdf" ? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "application/pdf"}
        files={files}
        onFiles={setFiles}
        hint={direction === "docx2pdf" ? "Chọn 1 file .docx (Word 2007 trở lên)" : "Chọn 1 file PDF"}
      />
      <p className="text-xs text-[rgb(var(--muted))]">
        Lưu ý: chỉ trích nội dung chữ (text), không giữ được layout/hình ảnh/bảng biểu gốc.
      </p>
      <ActionButton onClick={handleConvert} loading={loading} disabled={!files[0]}>
        <Download size={16} /> Chuyển đổi
      </ActionButton>
      <ErrorNote error={error} />
    </div>
  );
}
