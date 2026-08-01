"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Upload, FileText } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  fileType: "pdf" | "epub";
  fileSize: number;
  createdAt: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadForm({ onUploaded }: { onUploaded: () => void }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!file || !title) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      if (author) formData.append("author", author);

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
      setFile(null);
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
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
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
          placeholder="Tác giả (tuỳ chọn)"
          maxLength={120}
          className="font-data flex-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
        />
        <input
          type="file"
          accept=".pdf,.epub,application/pdf,application/epub+zip"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="font-data flex-1 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-[rgb(var(--accent)/0.1)] file:px-3 file:py-2 file:text-xs file:text-[rgb(var(--accent))]"
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

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {books === null ? (
          <p className="text-sm text-[rgb(var(--muted))]">Đang tải...</p>
        ) : books.length === 0 ? (
          <p className="text-sm text-[rgb(var(--muted))]">Chưa có sách nào — up thử 1 cuốn ở trên.</p>
        ) : (
          books.map((b) => (
            <Link
              key={b.id}
              href={`/${b.id}`}
              className="flex items-start gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 transition-colors hover:border-[rgb(var(--accent))]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--accent)/0.1)] text-[rgb(var(--accent))]">
                <FileText size={20} />
              </div>
              <div className="min-w-0 flex-1">
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
