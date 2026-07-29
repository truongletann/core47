"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface EditorInitial {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageKey: string | null;
  tags: string;
  status: "draft" | "published";
}

const emptyInitial: EditorInitial = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImageKey: null,
  tags: "",
  status: "draft",
};

function slugify(v: string): string {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "") // bỏ dấu (Vietnamese diacritics)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function BlogEditor({
  mode,
  postId,
  initial,
}: {
  mode: "create" | "edit";
  postId?: string;
  initial?: EditorInitial;
}) {
  const router = useRouter();
  const [form, setForm] = useState<EditorInitial>(initial ?? emptyInitial);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!form.content) {
      setPreviewHtml("");
      return;
    }
    let cancelled = false;
    setPreviewLoading(true);
    const timer = setTimeout(() => {
      fetch("/api/admin/blog/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: form.content }),
        credentials: "include",
      })
        .then((r) => r.json() as Promise<{ success: boolean; data?: { html: string } }>)
        .then((json) => {
          if (!cancelled && json.success && json.data) setPreviewHtml(json.data.html);
        })
        .finally(() => {
          if (!cancelled) setPreviewLoading(false);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [form.content]);

  function onTitleChange(title: string) {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  }

  async function handleCoverUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("cover", file);
      const res = await fetch("/api/admin/blog/cover", {
        method: "POST",
        body,
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; data?: { key: string } };
      if (!json.success || !json.data) {
        setError("Upload ảnh thất bại.");
        return;
      }
      setForm((f) => ({ ...f, coverImageKey: json.data!.key }));
    } finally {
      setUploading(false);
    }
  }

  async function handleImportFile(file: File) {
    setImporting(true);
    setError(null);
    try {
      const raw = await file.text();
      const res = await fetch("/api/admin/blog/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw }),
        credentials: "include",
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: { title: string | null; tags: string | null; content: string };
      };
      if (!json.success || !json.data) {
        setError("Đọc file thất bại.");
        return;
      }
      const { title, tags, content } = json.data;
      setForm((f) => ({
        ...f,
        title: f.title || title || f.title,
        slug: f.title || title ? (slugTouched ? f.slug : slugify(title || f.title)) : f.slug,
        tags: f.tags || tags || f.tags,
        content,
      }));
    } finally {
      setImporting(false);
    }
  }

  const fieldLabel: Record<string, string> = {
    slug: "Slug",
    title: "Tiêu đề",
    excerpt: "Mô tả ngắn",
    content: "Nội dung",
    tags: "Tags",
  };

  function errorMessage(json: {
    error?: string;
    issues?: { path: string; message: string }[];
    message?: string;
  }) {
    if (json.error === "SLUG_TAKEN") return "Slug này đã tồn tại, chọn slug khác.";
    if (json.error === "INVALID_INPUT" && json.issues?.length) {
      return json.issues.map((i) => `${fieldLabel[i.path] ?? i.path}: ${i.message}`).join(" · ");
    }
    if (json.error === "SERVER_ERROR" && json.message) return `Lỗi server: ${json.message}`;
    return "Đã có lỗi xảy ra.";
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const url = mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${postId}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        issues?: { path: string; message: string }[];
        message?: string;
      };
      if (!json.success) {
        setError(errorMessage(json));
        return;
      }
      router.push("/blog");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Tiêu đề</span>
            <input
              value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Tiêu đề bài viết"
              className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Slug</span>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm({ ...form, slug: e.target.value });
              }}
              placeholder="tieu-de-bai-viet"
              className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
          </label>
        </div>

        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Mô tả ngắn (excerpt)</span>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
            maxLength={300}
            placeholder="Hiện ở trang danh sách và khi chia sẻ link"
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>

        <div className="text-sm">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex gap-6">
              <span className="text-[rgb(var(--muted))]">Soạn thảo</span>
              <span className="flex items-center gap-2 text-[rgb(var(--muted))]">
                Xem trước
                {previewLoading && <span className="text-[10px]">(đang cập nhật...)</span>}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {importing && <span className="text-xs text-[rgb(var(--muted))]">Đang đọc file...</span>}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="text-xs text-[rgb(var(--accent))] hover:underline disabled:opacity-50"
              >
                Import file .md
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,text/markdown,text/plain"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportFile(file);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={34}
              placeholder="Viết nội dung bằng Markdown, hoặc bấm 'Import file .md' để đưa file có sẵn vào..."
              className="font-data min-h-[700px] w-full resize-y rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
            <div className="min-h-[700px] overflow-y-auto rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3">
              {form.content ? (
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <p className="text-sm opacity-50">Chưa có nội dung.</p>
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      <div className="flex w-full shrink-0 flex-col gap-4 lg:w-72">
        <div className="rounded-xl border border-[rgb(var(--border))] p-4">
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Ảnh cover</span>
            {form.coverImageKey && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/blog/cover/${form.coverImageKey}`}
                alt=""
                className="mb-2 aspect-video w-full rounded-md object-cover"
              />
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverUpload(file);
              }}
              disabled={uploading}
              className="w-full text-xs"
            />
            {uploading && <p className="mt-1 text-xs text-[rgb(var(--muted))]">Đang upload...</p>}
          </label>
        </div>

        <div className="rounded-xl border border-[rgb(var(--border))] p-4">
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Tags (cách nhau bởi dấu phẩy)</span>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="nextjs, cloudflare, devlog"
              className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
          </label>
        </div>

        <div className="rounded-xl border border-[rgb(var(--border))] p-4">
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Trạng thái</span>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as EditorInitial["status"] })
              }
              className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !form.title || !form.slug || !form.excerpt || !form.content}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : mode === "create" ? "Create post" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
