import { shouldRefresh, listArticles, listSourceOptions } from "@/lib/market/newsService";
import { fetchAndStoreNews } from "@/lib/market/rss";
import { NewsArticleRow } from "@/components/market/NewsArticleRow";
import { NewsFilterBar } from "@/components/market/NewsFilterBar";

const REFRESH_THRESHOLD_MINUTES = 15;

export default async function MarketNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; category?: string }>;
}) {
  // Lazy refresh: no Cloudflare Cron Trigger is wired up in this project's
  // OpenNext build, so staleness is checked on request instead — refetch
  // blocks this render only when the cached articles are stale.
  if (await shouldRefresh(REFRESH_THRESHOLD_MINUTES)) {
    await fetchAndStoreNews();
  }

  const { source, category } = await searchParams;
  const [articles, sources] = await Promise.all([
    listArticles({ limit: 50, sourceId: source, category }),
    listSourceOptions(),
  ]);

  return (
    <main className="py-10">
      <h1 className="font-display text-2xl font-semibold">News</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Tin tức tài chính tổng hợp từ nhiều nguồn — cập nhật mỗi {REFRESH_THRESHOLD_MINUTES} phút.
      </p>

      {sources.length > 0 && <NewsFilterBar sources={sources} />}

      {articles.length === 0 ? (
        <p className="mt-8 text-sm text-[rgb(var(--muted))]">
          {source || category
            ? "Không có tin nào khớp bộ lọc."
            : "Chưa có tin nào — admin cần thêm nguồn RSS ở trang quản trị."}
        </p>
      ) : (
        <div className="mt-6 divide-y divide-[rgb(var(--border))] rounded-xl border border-[rgb(var(--border))]">
          {articles.map((a) => (
            <NewsArticleRow key={a.id} article={a} />
          ))}
        </div>
      )}
    </main>
  );
}
