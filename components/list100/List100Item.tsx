import { CheckSquare, Square } from "lucide-react";
import type { List100Item } from "@/types/list100";
import { cn } from "@/lib/utils/cn";

export function List100ItemRow({ item, position }: { item: List100Item; position: number }) {
  const hasProgress = item.progressTarget !== null && item.progressTarget > 0;
  const current = Math.min(item.progressCurrent ?? 0, item.progressTarget ?? 0);
  const percent = hasProgress ? Math.round((current / item.progressTarget!) * 100) : 0;

  return (
    <div className="flex items-start gap-3 border-b border-[rgb(var(--border)/0.6)] py-2.5 last:border-0">
      <span className="font-data w-6 shrink-0 pt-0.5 text-right text-xs text-[rgb(var(--muted))]">
        {position}
      </span>

      {item.isPinnedEnd ? (
        <span className="mt-0.5 w-4 shrink-0" aria-hidden />
      ) : item.isDone ? (
        <CheckSquare
          size={16}
          className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
        />
      ) : (
        <Square size={16} className="mt-0.5 shrink-0 text-[rgb(var(--border))]" />
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed">
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                "underline decoration-[rgb(var(--accent)/0.35)] underline-offset-2 hover:decoration-[rgb(var(--accent))]",
                item.isDone ? "text-[rgb(var(--muted))] line-through" : "text-[rgb(var(--fg))]",
              )}
            >
              {item.title}
            </a>
          ) : (
            <span
              className={cn(
                item.isDone ? "text-[rgb(var(--muted))] line-through" : undefined,
                item.isPinnedEnd && "italic",
              )}
            >
              {item.isPinnedEnd && <span className="text-[rgb(var(--muted))]">~ </span>}
              {item.title}
            </span>
          )}
          {item.note && <span className="text-[rgb(var(--muted))]"> ({item.note})</span>}
        </p>

        {hasProgress && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 w-32 max-w-full overflow-hidden rounded-full bg-[rgb(var(--border)/0.6)]">
              <div
                className="h-full rounded-full bg-[rgb(var(--accent))]"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="font-data text-[11px] text-[rgb(var(--muted))]">
              {current}/{item.progressTarget} · {percent}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
