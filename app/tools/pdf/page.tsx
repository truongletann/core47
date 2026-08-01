"use client";

import { useState } from "react";
import {
  FileStack,
  Scissors,
  Image as ImageIcon,
  FileInput,
  FileText,
  FileType2,
  Loader2,
  Download,
} from "lucide-react";
import JSZip from "jszip";
import { FileDropzone } from "@/components/converters/FileDropzone";
import { downloadBlob } from "@/lib/utils/download";
import { mergePdfs, extractPages, splitEachPage, parsePageRanges, getPageCount, imagesToPdf } from "@/lib/converters/pdf";
import { renderPdfPagesToImages } from "@/lib/converters/pdfRender";
import { docxToPdf, pdfToDocx } from "@/lib/converters/wordPdf";
import { cn } from "@/lib/utils/cn";

type Tab = "merge" | "split" | "pdf2img" | "img2pdf" | "pdf2word" | "word2pdf";

const TABS: { id: Tab; label: string; icon: typeof FileStack }[] = [
  { id: "merge", label: "Gộp PDF", icon: FileStack },
  { id: "split", label: "Tách trang", icon: Scissors },
  { id: "pdf2img", label: "PDF → Ảnh", icon: ImageIcon },
  { id: "img2pdf", label: "Ảnh → PDF", icon: FileInput },
  { id: "pdf2word", label: "PDF → Word", icon: FileText },
  { id: "word2pdf", label: "Word → PDF", icon: FileType2 },
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

export default function PdfToolkitPage() {
  const [tab, setTab] = useState<Tab>("merge");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <span className="font-data inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted))]">
          <span className="led-dot bg-[rgb(var(--accent))]" />
          pdf.core47.xyz
        </span>
        <h1 className="font-display mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          PDF <span className="text-[rgb(var(--accent))]">Toolkit</span>
        </h1>
        <p className="mt-3 text-[rgb(var(--muted))]">
          Gộp, tách, chuyển đổi PDF — xử lý hoàn toàn trên trình duyệt, file không upload lên máy chủ.
        </p>
      </div>

      <div className="mx-auto mt-8 flex w-fit flex-wrap justify-center gap-1 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              tab === t.id ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
            )}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">
        {tab === "merge" && <MergeTab />}
        {tab === "split" && <SplitTab />}
        {tab === "pdf2img" && <Pdf2ImgTab />}
        {tab === "img2pdf" && <Img2PdfTab />}
        {tab === "pdf2word" && <Pdf2WordTab />}
        {tab === "word2pdf" && <Word2PdfTab />}
      </div>
    </main>
  );
}

function MergeTab() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMerge() {
    setError(null);
    setLoading(true);
    try {
      const bytes = await mergePdfs(files);
      downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }), "gop-pdf.pdf");
    } catch {
      setError("Không gộp được — kiểm tra lại các file PDF đã chọn.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FileDropzone accept="application/pdf" multiple files={files} onFiles={setFiles} hint="Chọn từ 2 file PDF trở lên, theo đúng thứ tự cần gộp" />
      <ActionButton onClick={handleMerge} loading={loading} disabled={files.length < 2}>
        <Download size={16} /> Gộp {files.length > 0 ? `${files.length} file` : ""} thành 1 PDF
      </ActionButton>
      <ErrorNote error={error} />
    </div>
  );
}

function SplitTab() {
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExtract() {
    if (!files[0]) return;
    setError(null);
    setLoading(true);
    try {
      const count = await getPageCount(files[0]);
      const pages = parsePageRanges(range, count);
      if (pages.length === 0) {
        setError(`Không hợp lệ — nhập số trang trong khoảng 1-${count}, ví dụ: 1-3, 5`);
        return;
      }
      const bytes = await extractPages(files[0], pages);
      downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }), `${baseName(files[0].name)}-trich.pdf`);
    } catch {
      setError("Không tách được — kiểm tra lại file PDF.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSplitAll() {
    if (!files[0]) return;
    setError(null);
    setLoading(true);
    try {
      const parts = await splitEachPage(files[0]);
      const zip = new JSZip();
      parts.forEach((p) => zip.file(p.name, p.bytes));
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `${baseName(files[0].name)}-tach-trang.zip`);
    } catch {
      setError("Không tách được — kiểm tra lại file PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="Chọn 1 file PDF" />
      <div>
        <label className="text-sm font-medium">Trích trang cụ thể (tuỳ chọn)</label>
        <input
          value={range}
          onChange={(e) => setRange(e.target.value)}
          placeholder="Ví dụ: 1-3, 5"
          className="font-data mt-1.5 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <ActionButton onClick={handleExtract} loading={loading} disabled={!files[0] || !range.trim()}>
          <Download size={16} /> Trích trang đã chọn
        </ActionButton>
        <ActionButton onClick={handleSplitAll} loading={loading} disabled={!files[0]}>
          <Download size={16} /> Tách mỗi trang thành 1 file (.zip)
        </ActionButton>
      </div>
      <ErrorNote error={error} />
    </div>
  );
}

function Pdf2ImgTab() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert() {
    if (!files[0]) return;
    setError(null);
    setLoading(true);
    try {
      const images = await renderPdfPagesToImages(files[0], { mime: format, scale: 2 });
      const ext = format === "image/jpeg" ? "jpg" : "png";
      if (images.length === 1) {
        downloadBlob(images[0], `${baseName(files[0].name)}.${ext}`);
      } else {
        const zip = new JSZip();
        images.forEach((blob, i) => zip.file(`trang-${i + 1}.${ext}`, blob));
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, `${baseName(files[0].name)}-anh.zip`);
      }
    } catch {
      setError("Không chuyển được — kiểm tra lại file PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="Chọn 1 file PDF" />
      <div>
        <label className="text-sm font-medium">Định dạng ảnh</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as "image/jpeg" | "image/png")}
          className="mt-1.5 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        >
          <option value="image/jpeg">JPG</option>
          <option value="image/png">PNG</option>
        </select>
      </div>
      <ActionButton onClick={handleConvert} loading={loading} disabled={!files[0]}>
        <Download size={16} /> Chuyển sang ảnh
      </ActionButton>
      <ErrorNote error={error} />
    </div>
  );
}

function Img2PdfTab() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert() {
    setError(null);
    setLoading(true);
    try {
      const bytes = await imagesToPdf(files);
      downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }), "anh-thanh-pdf.pdf");
    } catch {
      setError("Không tạo được PDF — kiểm tra lại các ảnh đã chọn.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FileDropzone accept="image/*" multiple files={files} onFiles={setFiles} hint="Chọn 1 hoặc nhiều ảnh — mỗi ảnh sẽ thành 1 trang, theo thứ tự đã chọn" />
      <ActionButton onClick={handleConvert} loading={loading} disabled={files.length === 0}>
        <Download size={16} /> Tạo PDF từ {files.length > 0 ? `${files.length} ảnh` : "ảnh"}
      </ActionButton>
      <ErrorNote error={error} />
    </div>
  );
}

function Pdf2WordTab() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert() {
    if (!files[0]) return;
    setError(null);
    setLoading(true);
    try {
      const blob = await pdfToDocx(files[0]);
      downloadBlob(blob, `${baseName(files[0].name)}.docx`);
    } catch {
      setError("Không chuyển được — kiểm tra lại file PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="Chọn 1 file PDF" />
      <p className="text-xs text-[rgb(var(--muted))]">
        Lưu ý: chỉ trích nội dung chữ (text), không giữ được layout/hình ảnh/bảng biểu gốc.
      </p>
      <ActionButton onClick={handleConvert} loading={loading} disabled={!files[0]}>
        <Download size={16} /> Chuyển sang Word (.docx)
      </ActionButton>
      <ErrorNote error={error} />
    </div>
  );
}

function Word2PdfTab() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert() {
    if (!files[0]) return;
    setError(null);
    setLoading(true);
    try {
      const bytes = await docxToPdf(files[0]);
      downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }), `${baseName(files[0].name)}.pdf`);
    } catch {
      setError("Không chuyển được — chỉ hỗ trợ file .docx.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FileDropzone
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        files={files}
        onFiles={setFiles}
        hint="Chọn 1 file .docx (Word 2007 trở lên)"
      />
      <p className="text-xs text-[rgb(var(--muted))]">
        Lưu ý: chỉ trích nội dung chữ (text), không giữ được layout/hình ảnh/bảng biểu gốc.
      </p>
      <ActionButton onClick={handleConvert} loading={loading} disabled={!files[0]}>
        <Download size={16} /> Chuyển sang PDF
      </ActionButton>
      <ErrorNote error={error} />
    </div>
  );
}
