import { shouldRefresh, listArticles } from "@/lib/market/fxtinNewsService";
import { fetchAndStoreFxtinNews } from "@/lib/market/fxtinNews";
import { FxtinNewsRow } from "@/components/market/FxtinNewsRow";

const REFRESH_THRESHOLD_MINUTES = 5;

export default async function MarketFxtinNewsPage() {
  // Flash news moves fast, so this refreshes far more often than the RSS
  // News tab (15min) or Calendar (60min) — still lazy/on-request, no
  // Cloudflare Cron Trigger wired into this OpenNext build.
  if (await shouldRefresh(REFRESH_THRESHOLD_MINUTES)) {
    await fetchAndStoreFxtinNews();
  }

  const articles = await listArticles(50);

  return (
    <main className="py-10">
      <h1 className="font-display text-2xl font-semibold">Fxtin News</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Tin tức thị trường real-time từ fxtin.com (unofficial) — cập nhật mỗi {REFRESH_THRESHOLD_MINUTES}{" "}
        phút.
      </p>

      {articles.length === 0 ? (
        <p className="mt-8 text-sm text-[rgb(var(--muted))]">Chưa tải được tin — thử tải lại trang.</p>
      ) : (
        <div className="mt-6 divide-y divide-[rgb(var(--border))] rounded-xl border border-[rgb(var(--border))]">
          {articles.map((a) => (
            <FxtinNewsRow key={a.id} article={a} />
          ))}
        </div>
      )}
    </main>
  );
}
