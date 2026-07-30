// TODO: replace with live price sources — VN gold (SJC/DOJI/PNJ scrape),
// world metals (GoldAPI/Metals-API), coffee/pepper (giacaphe.com scrape).
// UI shell only, data below is hardcoded mock data.

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

const WORLD_PRICES: PriceCard[] = [
  { symbol: "XAUUSD", name: "Gold", price: "4,280.50", unit: "USD/oz", changePct: 0.6 },
  { symbol: "XAGUSD", name: "Silver", price: "52.10", unit: "USD/oz", changePct: 1.3 },
  { symbol: "KC1!", name: "Coffee (Arabica)", price: "398.25", unit: "USD/lb", changePct: -0.8 },
];

function PriceGrid({ title, items }: { title: string; items: PriceCard[] }) {
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

export default function MarketPricesPage() {
  return (
    <main className="py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Prices</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Giá vàng/bạc/cà phê/hồ tiêu — dữ liệu mẫu, chưa kết nối nguồn thật.
          </p>
        </div>
        <button
          disabled
          title="Sắp ra mắt — thêm symbol tuỳ chọn cho giá thế giới"
          className="rounded-lg border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold text-[rgb(var(--muted))] opacity-60"
        >
          + Add symbol
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        <PriceGrid title="Việt Nam" items={VN_PRICES} />
        <PriceGrid title="World" items={WORLD_PRICES} />
      </div>
    </main>
  );
}
