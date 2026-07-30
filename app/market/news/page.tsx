import { shouldRefresh, listArticles, listSourceOptions } from "@/lib/market/newsService";
import { fetchAndStoreNews } from "@/lib/market/rss";
import { NewsFilterBar } from "@/components/market/NewsFilterBar";
import { NewsLive } from "@/components/market/NewsLive";

const REFRESH_THRESHOLD_MINUTES = 10;

export default async function MarketNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; category?: string }>;
}) {
  // Server-side lazy refresh seeds the initial list (and covers users with
  // JS off); NewsLive then polls /api/market/news to keep the list moving
  // without a manual reload — RSS has no push channel, so this is the
  // closest thing to "real-time" for an aggregator pulling from many feeds.
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
        Tin tức tài chính tổng hợp từ nhiều nguồn — tự cập nhật liên tục.
      </p>

      {sources.length > 0 && <NewsFilterBar sources={sources} />}

      <NewsLive initialArticles={articles} source={source} category={category} />
    </main>
  );
}
