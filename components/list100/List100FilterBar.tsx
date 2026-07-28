"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Props {
  categories: string[];
  activeCategory: string | null;
  search: string;
  onCategoryChange: (id: string | null) => void;
  onSearchChange: (value: string) => void;
}

export function List100FilterBar({
  categories,
  activeCategory,
  search,
  onCategoryChange,
  onSearchChange,
}: Props) {
  return (
    <div className="mx-auto mb-6 flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]" size={15} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm trong List 100..."
          maxLength={80}
          className="font-data w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] py-2 pl-9 pr-3 text-sm text-[rgb(var(--fg))] shadow-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
        />
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "font-data rounded-full border px-3 py-1 text-xs transition-colors",
              activeCategory === null
                ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
                : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]",
            )}
          >
            Tất cả
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              className={cn(
                "font-data rounded-full border px-3 py-1 text-xs transition-colors",
                activeCategory === c
                  ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
                  : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
