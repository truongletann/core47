import { shouldRefresh, listPrices, getLastFetchedAt } from "@/lib/market/priceService";
import { fetchAndStorePrices } from "@/lib/market/prices";
import { shouldRefreshVnGold, fetchAndStoreVnGoldPrices, listVnGoldPrices } from "@/lib/market/vnGold";
import { PriceRefreshInfo } from "@/components/market/PriceRefreshInfo";
import { LivePrices } from "@/components/market/LivePrices";

// TODO: cà phê/hồ tiêu nội địa still need their own source (scrape) — UI
// shell only, mock data for now. Gold (SJC/DOJI/PNJ) is real, via
// lib/market/vnGold.ts (vang.today's aggregator API).
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

function formatVnd(value: number): string {
  return value.toLocaleString("vi-VN", { maximumFractionDigits: 0 });
}

export default async function MarketPricesPage() {
  // Lazy refresh, same pattern as Calendar/News — no Cloudflare Cron
  // Trigger wired into this OpenNext build.
  const [worldStale, vnGoldStale] = await Promise.all([
    shouldRefresh(REFRESH_THRESHOLD_MINUTES),
    shouldRefreshVnGold(REFRESH_THRESHOLD_MINUTES),
  ]);
  await Promise.all([
    worldStale ? fetchAndStorePrices() : Promise.resolve(),
    vnGoldStale ? fetchAndStoreVnGoldPrices() : Promise.resolve(),
  ]);

  const [worldPrices, lastFetchedAt, vnGoldPrices] = await Promise.all([
    listPrices(),
    getLastFetchedAt(),
    listVnGoldPrices(),
  ]);

  return (
    <main className="py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Prices</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Giá vàng SJC/DOJI/PNJ + vàng/forex/crypto thế giới lấy trực tiếp từ vang.today + OANDA + Binance
            (live khi mở trang).
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        <div>
          <h2 className="font-display text-lg font-semibold">Việt Nam</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vnGoldPrices.map((p) => (
              <div key={p.id} className="rounded-xl border border-[rgb(var(--border))] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-data text-xs text-[rgb(var(--muted))]">
                    {p.label.includes("DOJI") ? "DOJI" : p.label.includes("PNJ") ? "PNJ" : "SJC"}
                  </span>
                  {p.changePercent !== null && (
                    <span
                      className={`font-data text-xs font-semibold ${
                        p.changePercent >= 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {p.changePercent >= 0 ? "+" : ""}
                      {p.changePercent.toFixed(2)}%
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium">{p.label}</p>
                <p className="font-data mt-1 text-lg font-semibold">
                  {p.sellPrice !== null ? formatVnd(p.sellPrice) : "—"}
                </p>
                <p className="text-xs text-[rgb(var(--muted))]">
                  {p.unit}
                  {p.buyPrice !== null && ` · mua ${formatVnd(p.buyPrice)}`}
                </p>
              </div>
            ))}
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
