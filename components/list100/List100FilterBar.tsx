"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { List100Status } from "@/types/list100";

const STATUS_OPTIONS: { value: List100Status; label: string }[] = [
  { value: "not_started", label: "Chưa bắt đầu" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "done", label: "Đã hoàn thành" },
];

interface Props {
  categories: string[];
  activeCategory: string | null;
  activeStatus: List100Status | null;
  search: string;
  onCategoryChange: (id: string | null) => void;
  onStatusChange: (status: List100Status | null) => void;
  onSearchChange: (value: string) => void;
}

export function List100FilterBar({
  categories,
  activeCategory,
  activeStatus,
  search,
  onCategoryChange,
  onStatusChange,
  onSearchChange,
}: Props) {
  return (
    <div className="mx-auto mb-6 flex max-w-3xl flex-col gap-3">
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

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onStatusChange(null)}
          className={cn(
            "font-data rounded-full border px-3 py-1 text-xs transition-colors",
            activeStatus === null
              ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
              : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]",
          )}
        >
          Tất cả
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => onStatusChange(s.value)}
            className={cn(
              "font-data rounded-full border px-3 py-1 text-xs transition-colors",
              activeStatus === s.value
                ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
                : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "font-data rounded-full border px-2.5 py-0.5 text-[11px] transition-colors",
              activeCategory === null
                ? "border-[rgb(var(--accent))] text-[rgb(var(--accent))]"
                : "border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]",
            )}
          >
            Mọi nhóm
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              className={cn(
                "font-data rounded-full border px-2.5 py-0.5 text-[11px] transition-colors",
                activeCategory === c
                  ? "border-[rgb(var(--accent))] text-[rgb(var(--accent))]"
                  : "border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]",
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
