"use client";

import { CheckCircle2, Circle, CircleDot, ExternalLink } from "lucide-react";
import type { List100Item } from "@/types/list100";

const statusMeta: Record<
  List100Item["status"],
  { label: string; icon: typeof Circle; className: string }
> = {
  not_started: { label: "Chưa bắt đầu", icon: Circle, className: "text-[rgb(var(--muted))]" },
  in_progress: { label: "Đang thực hiện", icon: CircleDot, className: "text-amber-500" },
  done: { label: "Đã hoàn thành", icon: CheckCircle2, className: "text-emerald-500" },
};

export function List100Card({ item }: { item: List100Item }) {
  const { label, icon: StatusIcon, className } = statusMeta[item.status];
  const isDone = item.status === "done";

  return (
    <div className="flex gap-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[rgb(var(--accent)/0.1)]">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
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
            <h3
              className={`font-display text-[15px] font-semibold ${isDone ? "line-through opacity-70" : ""}`}
            >
              {item.title}
            </h3>
          </div>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1 shrink-0 text-[rgb(var(--muted))] transition-colors hover:text-[rgb(var(--accent))]"
              aria-label="Link tham khảo"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[rgb(var(--muted))]">
          {item.description}
        </p>

        {isDone && item.note && (
          <p className="mt-2 rounded-md bg-[rgb(var(--bg))] px-2.5 py-1.5 text-xs italic leading-relaxed text-[rgb(var(--muted))]">
            “{item.note}”
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`font-data flex items-center gap-1 text-[11px] ${className}`}>
            <StatusIcon size={11} className={isDone ? "fill-current" : undefined} />
            {label}
            {isDone && item.completedAt ? ` · ${item.completedAt}` : ""}
            {!isDone && item.targetDate ? ` · dự kiến ${item.targetDate}` : ""}
          </span>
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
    </div>
  );
}
