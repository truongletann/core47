import type { List100Item } from "@/types/list100";

export function List100ItemRow({ item }: { item: List100Item }) {
  return (
    <li className="py-0.5 leading-relaxed">
      <span
        className={item.isDone ? "text-emerald-600 dark:text-emerald-400" : "text-[rgb(var(--muted))]"}
      >
        {item.isDone ? "✓" : "✗"}
      </span>{" "}
      {item.link ? (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[rgb(var(--accent))] underline decoration-[rgb(var(--accent)/0.35)] underline-offset-2 hover:decoration-[rgb(var(--accent))]"
        >
          {item.title}
        </a>
      ) : (
        <span>{item.title}</span>
      )}
      {item.note && <span className="text-[rgb(var(--muted))]"> ({item.note})</span>}
    </li>
  );
}
