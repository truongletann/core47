import { shouldRefresh, listPrices, getLastFetchedAt } from "@/lib/market/priceService";
import { fetchAndStorePrices } from "@/lib/market/prices";
import { PriceRefreshInfo } from "@/components/market/PriceRefreshInfo";
import { LivePrices } from "@/components/market/LivePrices";
import { VnGoldPrices } from "@/components/market/VnGoldPrices";

// TODO: cà phê/hồ tiêu nội địa still need their own source (scrape) — UI
// shell only, mock data for now. Gold (SJC) is real, via lib/market/sjcClient.ts.
interface MockPriceCard {
  symbol: string;
  name: string;
  price: string;
  unit: string;
  changePct: number;
}

const VN_MOCK_PRICES: MockPriceCard[] = [
  { symbol: "CAFE", name: "Cà phê nội địa", price: "96,600", unit: "đ/kg", changePct: -0.4 },
  { symbol: "TIEU", name: "Hồ tiêu nội địa", price: "155,000", unit: "đ/kg", changePct: 0.2 },
];

const REFRESH_THRESHOLD_MINUTES = 15;

export default async function MarketPricesPage() {
  // Lazy refresh, same pattern as Calendar/News — no Cloudflare Cron
  // Trigger wired into this OpenNext build.
  if (await shouldRefresh(REFRESH_THRESHOLD_MINUTES)) {
    await fetchAndStorePrices();
  }

  const [worldPrices, lastFetchedAt] = await Promise.all([listPrices(), getLastFetchedAt()]);

  return (
    <main className="py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Prices</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Giá vàng SJC + vàng/forex/crypto thế giới lấy trực tiếp từ SJC + OANDA + Binance (live khi mở
            trang).
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        <div>
          <h2 className="font-display text-lg font-semibold">Việt Nam</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <VnGoldPrices />
            {VN_MOCK_PRICES.map((p) => (
              <div key={p.symbol} className="rounded-xl border border-[rgb(var(--border))] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-data text-xs text-[rgb(var(--muted))]">{p.symbol}</span>
                  <span
                    className={`font-data text-xs font-semibold ${
                      p.changePct >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {p.changePct >= 0 ? "+" : ""}
                    {p.changePct}%
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium">{p.name}</p>
                <p className="font-data mt-1 text-lg font-semibold">{p.price}</p>
                <p className="text-xs text-[rgb(var(--muted))]">{p.unit}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold">World</h2>
          <PriceRefreshInfo lastFetchedAt={lastFetchedAt} thresholdMinutes={REFRESH_THRESHOLD_MINUTES} />
          {worldPrices.length === 0 ? (
            <p className="mt-3 text-sm text-[rgb(var(--muted))]">
              Chưa có dữ liệu — admin cần cấu hình OANDA API key + account ID ở trang quản trị.
            </p>
          ) : (
            <LivePrices
              initial={worldPrices.map((p) => ({
                ...p,
                source: p.source === "binance" ? "binance" : "oanda",
              }))}
            />
          )}
        </div>
      </div>
    </main>
  );
}
