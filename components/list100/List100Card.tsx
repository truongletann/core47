"use client";

import { Star, ExternalLink } from "lucide-react";
import type { List100Item } from "@/types/list100";

export function List100Card({ item }: { item: List100Item }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex gap-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[rgb(var(--accent)/0.1)]">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-data text-sm font-semibold text-[rgb(var(--accent))]">
            #{item.rank}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-data text-xs text-[rgb(var(--muted))]">#{item.rank}</span>
            <h3 className="font-display text-[15px] font-semibold group-hover:text-[rgb(var(--accent))]">
              {item.name}
            </h3>
          </div>
          <ExternalLink
            size={14}
            className="mt-1 shrink-0 text-[rgb(var(--muted))] transition-colors group-hover:text-[rgb(var(--accent))]"
          />
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[rgb(var(--muted))]">
          {item.description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {item.score !== null && (
            <span className="font-data flex items-center gap-1 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-1.5 py-0.5 text-[11px] text-[rgb(var(--muted))]">
              <Star size={10} className="fill-current text-amber-500" />
              {item.score.toFixed(1)}
            </span>
          )}
          {item.category && (
            <span className="font-data rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-1.5 py-0.5 text-[11px] text-[rgb(var(--muted))]">
              {item.category}
            </span>
          )}
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-data rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-1.5 py-0.5 text-[11px] text-[rgb(var(--muted))]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
