import { shouldRefresh, listArticles } from "@/lib/market/fxtinNewsService";
import { fetchAndStoreFxtinNews } from "@/lib/market/fxtinNews";
import { FxtinNewsLive } from "@/components/market/FxtinNewsLive";

const REFRESH_THRESHOLD_MINUTES = 5;

export default async function MarketFxtinNewsPage() {
  // Server-side lazy refresh seeds the initial list (and covers users with
  // JS off); FxtinNewsLive then keeps it live via fxtin's own WebSocket,
  // connected directly from the browser.
  if (await shouldRefresh(REFRESH_THRESHOLD_MINUTES)) {
    await fetchAndStoreFxtinNews();
  }

  const rows = await listArticles(50);
  const initialArticles = rows.map((r) => ({
    informationId: r.informationId,
    content: r.content,
    time: r.time,
    important: r.important,
  }));

  return (
    <main className="py-10">
      <h1 className="font-display text-2xl font-semibold">Fxtin News</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Tin tức thị trường real-time từ fxtin.com (unofficial) — tự cập nhật ngay khi có tin mới qua
        WebSocket.
      </p>

      <FxtinNewsLive initialArticles={initialArticles} />
    </main>
  );
}
