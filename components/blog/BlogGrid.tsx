"use client";

import { useEffect, useMemo, useState } from "react";
import { List, LayoutGrid } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { BlogListItem } from "./BlogListItem";
import { BlogGridCard } from "./BlogGridCard";
import { cn } from "@/lib/utils/cn";

type ViewMode = "grid" | "list";
const VIEW_STORAGE_KEY = "core47-blog-view";

export function BlogGrid({ posts, tags }: { posts: BlogPost[]; tags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("list");

  useEffect(() => {
    const saved = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === "grid" || saved === "list") setView(saved);
  }, []);

  function changeView(next: ViewMode) {
    setView(next);
    window.localStorage.setItem(VIEW_STORAGE_KEY, next);
  }

  const filtered = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((p) => p.tags.includes(activeTag));
  }, [posts, activeTag]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                "font-data rounded-full border px-3 py-1 text-xs transition-colors",
                activeTag === null
                  ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
                  : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]",
              )}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  "font-data rounded-full border px-3 py-1 text-xs transition-colors",
                  activeTag === tag
                    ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
                    : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]",
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        ) : (
          <div />
        )}

        <div className="flex gap-1 rounded-md border border-[rgb(var(--border))] p-0.5">
          <button
            onClick={() => changeView("grid")}
            aria-label="Grid view"
            className={cn(
              "rounded p-1.5",
              view === "grid"
                ? "bg-[rgb(var(--accent))] text-white"
                : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
            )}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => changeView("list")}
            aria-label="List view"
            className={cn(
              "rounded p-1.5",
              view === "list"
                ? "bg-[rgb(var(--accent))] text-white"
                : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
            )}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[rgb(var(--muted))]">No posts here yet.</p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogGridCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex max-w-2xl flex-col gap-6">
          {filtered.map((post) => (
            <BlogListItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
