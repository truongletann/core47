"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Upload, FileText } from "lucide-react";
import { detectFileType, extractEpubMeta, extractPdfMeta } from "@/lib/books/extractMeta";

interface Book {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  fileType: "pdf" | "epub";
  fileSize: number;
  coverKey: string | null;
  genre: string | null;
  createdAt: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadForm({ onUploaded }: { onUploaded: () => void }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(f: File | null) {
    setFile(f);
    setCoverBlob(null);
    setCoverPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (!f) return;

    const type = detectFileType(f);
    if (!type) return;

    setExtracting(true);
    try {
      const meta = type === "epub" ? await extractEpubMeta(f) : await extractPdfMeta(f);
      if (meta.title) setTitle(meta.title);
      if (meta.author) setAuthor(meta.author);
      if (meta.genre) setGenre(meta.genre);
      if (meta.coverBlob) {
        setCoverBlob(meta.coverBlob);
        setCoverPreview(URL.createObjectURL(meta.coverBlob));
      }
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit() {
    if (!file || !title) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      if (author) formData.append("author", author);
      if (genre) formData.append("genre", genre);
      if (coverBlob) formData.append("cover", coverBlob, "cover.jpg");

      const res = await fetch("/api/books", { method: "POST", body: formData });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setError(
          json.error === "TOO_LARGE"
            ? "File quá lớn (tối đa 80MB)."
            : json.error === "INVALID_TYPE"
              ? "Chỉ nhận file PDF hoặc EPUB."
              : json.error === "TOO_MANY_ATTEMPTS"
                ? "Upload quá nhiều, thử lại sau."
                : "Có lỗi xảy ra, thử lại.",
        );
        return;
      }
      setTitle("");
      setAuthor("");
      setGenre("");
      setFile(null);
      setCoverBlob(null);
      setCoverPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      onUploaded();
    } catch {
      setError("Có lỗi xảy ra, thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
      <h2 className="font-display flex items-center gap-2 text-sm font-semibold">
        <Upload size={16} /> Thêm sách
      </h2>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          type="file"
          accept=".pdf,.epub,application/pdf,application/epub+zip"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          className="font-data w-full text-xs file:mr-2 file:rounded-md file:border-0 file:bg-[rgb(var(--accent)/0.1)] file:px-3 file:py-2 file:text-xs file:text-[rgb(var(--accent))] sm:w-56"
        />

        {coverPreview && (
          // eslint-disable-next-line @next/next/no-img-element -- transient blob: preview URL, next/image can't optimize it
          <img
            src={coverPreview}
            alt=""
            className="h-20 w-14 shrink-0 rounded-md border border-[rgb(var(--border))] object-cover"
          />
        )}

        <div className="flex flex-1 flex-col gap-2">
          {extracting && (
            <p className="text-xs text-[rgb(var(--muted))]">Đang đọc thông tin từ file...</p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tên sách"
              maxLength={200}
              className="font-data flex-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Tác giả"
              maxLength={120}
              className="font-data flex-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Thể loại (tuỳ chọn)"
              maxLength={200}
              className="font-data flex-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !file || !title}
              className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Đang tải..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-[rgb(var(--muted))]">
        Chọn file EPUB/PDF — tên sách, tác giả, thể loại và ảnh bìa sẽ tự lấy từ metadata trong file (sửa lại được nếu cần).
      </p>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function BooksLibraryClient() {
  const [books, setBooks] = useState<Book[] | null>(null);

  function refresh() {
    fetch("/api/books")
      .then((r) => r.json() as Promise<{ data?: { books?: Book[] } }>)
      .then((json) => setBooks(json?.data?.books ?? []))
      .catch(() => setBooks([]));
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center gap-2">
        <BookOpen size={22} className="text-[rgb(var(--accent))]" />
        <h1 className="font-display text-2xl font-semibold">Books</h1>
      </div>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Thư viện ebook chung — đọc PDF/EPUB ngay trên trình duyệt.
      </p>

      <div className="mt-6">
        <UploadForm onUploaded={refresh} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {books === null ? (
          <p className="text-sm text-[rgb(var(--muted))]">Đang tải...</p>
        ) : books.length === 0 ? (
          <p className="text-sm text-[rgb(var(--muted))]">Chưa có sách nào — up thử 1 cuốn ở trên.</p>
        ) : (
          books.map((b) => (
            <Link
              key={b.id}
              href={`/${b.id}`}
              className="flex flex-col gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 transition-colors hover:border-[rgb(var(--accent))]"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-[rgb(var(--accent)/0.1)]">
                {b.coverKey ? (
                  // eslint-disable-next-line @next/next/no-img-element -- R2-served cover, next/image (sharp) isn't usable on Workers, see project convention
                  <img
                    src={`/api/books/${b.id}/cover`}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[rgb(var(--accent))]">
                    <FileText size={28} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-display truncate text-sm font-semibold">{b.title}</p>
                {b.author && <p className="truncate text-xs text-[rgb(var(--muted))]">{b.author}</p>}
                <p className="font-data mt-1 text-[10px] uppercase text-[rgb(var(--muted))]">
                  {b.fileType} · {formatSize(b.fileSize)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
