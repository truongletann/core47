import { shouldRefresh, listArticles } from "@/lib/market/newsService";
import { fetchAndStoreNews } from "@/lib/market/rss";
import { NewsArticleRow } from "@/components/market/NewsArticleRow";

const REFRESH_THRESHOLD_MINUTES = 15;

export default async function MarketNewsPage() {
  // Lazy refresh: no Cloudflare Cron Trigger is wired up in this project's
  // OpenNext build, so staleness is checked on request instead — refetch
  // blocks this render only when the cached articles are stale.
  if (await shouldRefresh(REFRESH_THRESHOLD_MINUTES)) {
    await fetchAndStoreNews();
  }

  const articles = await listArticles(50);

  return (
    <main className="py-10">
      <h1 className="font-display text-2xl font-semibold">News</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Tin tức tài chính tổng hợp từ nhiều nguồn — cập nhật mỗi {REFRESH_THRESHOLD_MINUTES} phút.
      </p>

      {articles.length === 0 ? (
        <p className="mt-8 text-sm text-[rgb(var(--muted))]">
          Chưa có tin nào — admin cần thêm nguồn RSS ở trang quản trị.
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
