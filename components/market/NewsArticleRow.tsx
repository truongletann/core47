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
  if (minutes < 1) return "vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export function NewsArticleRow({ article }: { article: Article }) {
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
        <p className="font-data mt-1.5 text-[11px] text-[rgb(var(--muted))]">
          {article.sourceName ?? "Unknown"} · {timeAgo(article.publishedAt)}
        </p>
      </div>
    </a>
  );
}
