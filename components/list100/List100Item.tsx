import { CheckSquare, Square } from "lucide-react";
import type { List100Item } from "@/types/list100";
import { cn } from "@/lib/utils/cn";

export function List100ItemRow({ item }: { item: List100Item }) {
  return (
    <div className="flex items-start gap-3 border-b border-[rgb(var(--border)/0.6)] py-2.5 last:border-0">
      <span className="font-data w-6 shrink-0 pt-0.5 text-right text-xs text-[rgb(var(--muted))]">
        {item.rank}
      </span>

      {item.isDone ? (
        <CheckSquare
          size={16}
          className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
        />
      ) : (
        <Square size={16} className="mt-0.5 shrink-0 text-[rgb(var(--border))]" />
      )}

      <p className="min-w-0 flex-1 text-sm leading-relaxed">
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
          <span className={item.isDone ? "text-[rgb(var(--muted))] line-through" : undefined}>
            {item.title}
          </span>
        )}
        {item.note && <span className="text-[rgb(var(--muted))]"> ({item.note})</span>}
      </p>
    </div>
  );
}
