"use client";

import { Search } from "lucide-react";
import type { Category } from "@/types/tool";
import { cn } from "@/lib/utils/cn";

interface Props {
  categories: Category[];
  activeCategory: string | null;
  search: string;
  onCategoryChange: (id: string | null) => void;
  onSearchChange: (value: string) => void;
}

export function ToolFilterBar({
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
          placeholder="Search tools..."
          maxLength={80}
          className="font-data w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] py-2 pl-9 pr-9 text-sm text-[rgb(var(--fg))] shadow-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
        />
        <kbd className="font-data absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[rgb(var(--border))] px-1.5 py-0.5 text-[10px] text-[rgb(var(--muted))]">
          ⌘K
        </kbd>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            "font-data shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors",
            activeCategory === null
              ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
              : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]",
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onCategoryChange(c.id)}
            className={cn(
              "font-data shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors",
              activeCategory === c.id
                ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
                : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}