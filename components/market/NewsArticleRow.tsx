interface Article {
  id: string;
  title: string;
  link: string;
  summary: string | null;
  imageUrl: string | null;
  publishedAt: string;
  sourceName: string | null;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

// Deterministic color per source name, so the same outlet always reads the
// same color across the list (like ForexFactory's News page).
const SOURCE_COLORS = [
  "text-blue-600",
  "text-amber-600",
  "text-emerald-600",
  "text-purple-600",
  "text-pink-600",
  "text-cyan-600",
  "text-orange-600",
  "text-indigo-600",
  "text-rose-600",
  "text-teal-600",
];

function colorForSource(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return SOURCE_COLORS[hash % SOURCE_COLORS.length];
}

export function NewsArticleRow({ article }: { article: Article }) {
  const sourceName = article.sourceName ?? "Unknown";

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 px-4 py-3 transition-colors hover:bg-[rgb(var(--border)/0.3)]"
    >
      {article.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.imageUrl}
          alt=""
          className="h-16 w-16 shrink-0 rounded-lg object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug">{article.title}</p>
        {article.summary && (
          <p className="mt-1 line-clamp-2 text-xs text-[rgb(var(--muted))]">{article.summary}</p>
        )}
        <p className="font-data mt-1.5 text-[11px]">
          <span className={`font-semibold ${colorForSource(sourceName)}`}>{sourceName}</span>
          <span className="text-[rgb(var(--muted))]"> · {timeAgo(article.publishedAt)}</span>
        </p>
      </div>
    </a>
  );
}
