"use client";

import { useEffect, useState } from "react";
import { NewsArticleRow } from "./NewsArticleRow";

interface Article {
  id: string;
  title: string;
  link: string;
  summary: string | null;
  imageUrl: string | null;
  publishedAt: string;
  sourceName: string | null;
}

// RSS feeds are pull-based (no push like Fxtin's WebSocket), so "live"
// here means polling our own cached list — the server-side lazy refresh
// (see /api/market/news) decides how often the underlying sources
// actually get re-fetched; this just keeps the screen in sync with that.
const POLL_INTERVAL_MS = 30_000;

export function NewsLive({
  initialArticles,
  source,
  category,
}: {
  initialArticles: Article[];
  source?: string;
  category?: string;
}) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (source) params.set("source", source);
    if (category) params.set("category", category);
    const url = `/api/market/news${params.toString() ? `?${params.toString()}` : ""}`;

    let cancelled = false;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(url);
        const json = (await res.json()) as { data?: { articles?: Article[] } };
        const next = json?.data?.articles;
        if (!cancelled && next) setArticles(next);
      } catch {
        // A missed poll is fine — it'll retry on the next tick.
      }
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [source, category]);

  if (articles.length === 0) {
    return (
      <p className="mt-8 text-sm text-[rgb(var(--muted))]">
        {source || category ? "Không có tin nào khớp bộ lọc." : "Chưa có tin nào — admin cần thêm nguồn RSS ở trang quản trị."}
      </p>
    );
  }

  return (
    <div className="mt-6 divide-y divide-[rgb(var(--border))] rounded-xl border border-[rgb(var(--border))]">
      {articles.map((a) => (
        <NewsArticleRow key={a.id} article={a} />
      ))}
    </div>
  );
}
