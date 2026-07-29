"use client";

import { useMemo, useState } from "react";
import type { BlogPost } from "@/types/blog";
import { BlogCard } from "./BlogCard";
import { cn } from "@/lib/utils/cn";

export function BlogGrid({ posts, tags }: { posts: BlogPost[]; tags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((p) => p.tags.includes(activeTag));
  }, [posts, activeTag]);

  return (
    <div>
      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
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
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[rgb(var(--muted))]">No posts here yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
