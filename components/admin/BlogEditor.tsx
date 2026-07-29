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
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "") // strip diacritics
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
  const coverInputRef = useRef<HTMLInputElement>(null);

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
        setError("Image upload failed.");
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
        setError("Failed to read file.");
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
    title: "Title",
    excerpt: "Excerpt",
    content: "Content",
    tags: "Tags",
  };

  function errorMessage(json: {
    error?: string;
    issues?: { path: string; message: string }[];
    message?: string;
  }) {
    if (json.error === "SLUG_TAKEN") return "This slug already exists — pick another one.";
    if (json.error === "INVALID_INPUT" && json.issues?.length) {
      return json.issues.map((i) => `${fieldLabel[i.path] ?? i.path}: ${i.message}`).join(" · ");
    }
    if (json.error === "SERVER_ERROR" && json.message) return `Server error: ${json.message}`;
    return "Something went wrong.";
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
            <span className="mb-1 block text-[rgb(var(--muted))]">Title</span>
            <input
              value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Post title"
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
              placeholder="post-title"
              className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
          </label>
        </div>

        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Excerpt (optional)</span>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
            maxLength={300}
            placeholder="Shown when the link is shared — left blank, it's derived from the start of the content"
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>

        <div className="text-sm">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex gap-6">
              <span className="text-[rgb(var(--muted))]">Write</span>
              <span className="flex items-center gap-2 text-[rgb(var(--muted))]">
                Preview
                {previewLoading && <span className="text-[10px]">(updating...)</span>}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {importing && <span className="text-xs text-[rgb(var(--muted))]">Reading file...</span>}
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
              placeholder="Write content in Markdown, or click 'Import file .md' to bring in an existing file..."
              className="font-data min-h-[700px] w-full resize-y rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
            <div className="min-h-[700px] overflow-y-auto rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3">
              {form.content ? (
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <p className="text-sm opacity-50">No content yet.</p>
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      <div className="flex w-full shrink-0 flex-col gap-4 lg:w-72">
        <div className="rounded-xl border border-[rgb(var(--border))] p-4">
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Cover image (optional)</span>
            {form.coverImageKey && (
              <div className="relative mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/blog/cover/${form.coverImageKey}`}
                  alt=""
                  className="aspect-video w-full rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, coverImageKey: null }));
                    if (coverInputRef.current) coverInputRef.current.value = "";
                  }}
                  className="absolute right-1.5 top-1.5 rounded-md bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
                >
                  Remove
                </button>
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverUpload(file);
              }}
              disabled={uploading}
              className="w-full text-xs"
            />
            {uploading && <p className="mt-1 text-xs text-[rgb(var(--muted))]">Uploading...</p>}
          </label>
        </div>

        <div className="rounded-xl border border-[rgb(var(--border))] p-4">
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Tags (comma-separated)</span>
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
            <span className="mb-1 block text-[rgb(var(--muted))]">Status</span>
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
          disabled={saving || !form.title || !form.slug || !form.content}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : mode === "create" ? "Create post" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
