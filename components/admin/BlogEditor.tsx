"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { marked } from "marked";

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-4">
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
            <span className="text-[rgb(var(--muted))]">Nội dung (Markdown)</span>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="text-xs text-[rgb(var(--accent))] hover:underline"
            >
              {showPreview ? "Ẩn preview" : "Xem preview"}
            </button>
          </div>
          <div className={showPreview ? "grid grid-cols-2 gap-3" : ""}>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={20}
              placeholder="Viết nội dung bằng Markdown..."
              className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
            {showPreview && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none overflow-y-auto rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2"
                dangerouslySetInnerHTML={{ __html: marked.parse(form.content || "") as string }}
              />
            )}
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      <div className="flex flex-col gap-4">
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
