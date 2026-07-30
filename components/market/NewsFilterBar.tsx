"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SourceOption {
  id: string;
  name: string;
  category: string | null;
}

export function NewsFilterBar({ sources }: { sources: SourceOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSource = searchParams.get("source") ?? "";
  const currentCategory = searchParams.get("category") ?? "";

  const categories = [...new Set(sources.map((s) => s.category).filter((c): c is string => !!c))].sort();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <select
        value={currentCategory}
        onChange={(e) => updateParam("category", e.target.value)}
        className="rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-sm outline-none"
      >
        <option value="">Tất cả danh mục</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={currentSource}
        onChange={(e) => updateParam("source", e.target.value)}
        className="rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1.5 text-sm outline-none"
      >
        <option value="">Tất cả nguồn</option>
        {sources.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {(currentSource || currentCategory) && (
        <button
          onClick={() => router.push(pathname)}
          className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          Xoá lọc
        </button>
      )}
    </div>
  );
}
