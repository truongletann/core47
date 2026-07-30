import { shouldRefresh, listPrices } from "@/lib/market/priceService";
import { fetchAndStorePrices } from "@/lib/market/prices";

// TODO: VN domestic prices (SJC/DOJI/PNJ gold, cà phê/hồ tiêu nội địa) still
// need their own source (scrape) — UI shell only, mock data for now.
interface PriceCard {
  symbol: string;
  name: string;
  price: string;
  unit: string;
  changePct: number;
}

const VN_PRICES: PriceCard[] = [
  { symbol: "SJC", name: "Vàng SJC", price: "139,000,000", unit: "đ/lượng", changePct: 1.1 },
  { symbol: "DOJI", name: "Vàng DOJI", price: "138,500,000", unit: "đ/lượng", changePct: 0.9 },
  { symbol: "PNJ", name: "Vàng PNJ", price: "137,800,000", unit: "đ/lượng", changePct: 0.8 },
  { symbol: "CAFE", name: "Cà phê nội địa", price: "96,600", unit: "đ/kg", changePct: -0.4 },
  { symbol: "TIEU", name: "Hồ tiêu nội địa", price: "155,000", unit: "đ/kg", changePct: 0.2 },
];

const REFRESH_THRESHOLD_MINUTES = 15;

function formatPrice(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: value < 10 ? 4 : 2 });
}

function MockPriceGrid({ title, items }: { title: string; items: PriceCard[] }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
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
  );
}

export default async function MarketPricesPage() {
  // Lazy refresh, same pattern as Calendar/News — no Cloudflare Cron
  // Trigger wired into this OpenNext build.
  if (await shouldRefresh(REFRESH_THRESHOLD_MINUTES)) {
    await fetchAndStorePrices();
  }

  const worldPrices = await listPrices();

  return (
    <main className="py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Prices</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Giá vàng/forex thế giới lấy từ Twelve Data (real-time) — giá Việt Nam vẫn là dữ liệu mẫu.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        <MockPriceGrid title="Việt Nam" items={VN_PRICES} />

        <div>
          <h2 className="font-display text-lg font-semibold">World</h2>
          {worldPrices.length === 0 ? (
            <p className="mt-3 text-sm text-[rgb(var(--muted))]">
              Chưa có dữ liệu — admin cần cấu hình Twelve Data API key ở trang quản trị.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {worldPrices.map((p) => {
                const changePct = p.lastChangePercent;
                const isUp = changePct !== null && changePct >= 0;
                return (
                  <div key={p.id} className="rounded-xl border border-[rgb(var(--border))] p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-data text-xs text-[rgb(var(--muted))]">{p.symbol}</span>
                      {changePct !== null && (
                        <span
                          className={`font-data text-xs font-semibold ${
                            isUp ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {isUp ? "+" : ""}
                          {changePct.toFixed(2)}%
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium">{p.label}</p>
                    <p className="font-data mt-1 text-lg font-semibold">
                      {p.lastPrice !== null ? formatPrice(p.lastPrice) : "—"}
                    </p>
                    {p.unit && <p className="text-xs text-[rgb(var(--muted))]">{p.unit}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
