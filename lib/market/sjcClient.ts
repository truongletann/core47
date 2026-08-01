// Client-side only. SJC's own internal price endpoint rejects requests
// from Cloudflare Workers (403, same class of block as Binance's) but
// fully supports CORS, so this must be called from the browser rather
// than proxied through our own API routes.

const SJC_ENDPOINT = "https://sjc.com.vn/GoldPrice/Services/PriceService.ashx";

export interface SjcGoldType {
  goldPriceId: number;
  label: string;
  unit: string;
}

// The two SJC product types shown on /market/prices — SJC's own internal
// "Id" for bar gold and ring gold at the Ho Chi Minh City branch.
export const SJC_GOLD_TYPES: SjcGoldType[] = [
  { goldPriceId: 1, label: "Vàng SJC 1L, 10L, 1KG", unit: "đ/lượng" },
  { goldPriceId: 49, label: "Vàng nhẫn SJC 99,99%", unit: "đ/lượng" },
];

interface SjcCurrentPriceRow {
  Id: number;
  BuyValue: number;
  SellValue: number;
}

interface SjcHistoryRow {
  SellValue: number;
}

export interface SjcPrice {
  goldPriceId: number;
  buy: number;
  sell: number;
  changePercent: number | null;
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

async function fetchCurrentPrices(): Promise<Map<number, SjcCurrentPriceRow>> {
  const res = await fetch(SJC_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "method=GetCurrentGoldPricesByBranch&BranchId=",
  });
  if (!res.ok) return new Map();
  const json = (await res.json()) as { data?: SjcCurrentPriceRow[] };
  return new Map((json.data ?? []).map((row) => [row.Id, row]));
}

// Earliest entry from the last 2 days, used as a "previous" reference to
// derive a day-over-day % change — the current-price endpoint doesn't
// return that itself.
async function fetchPreviousClose(goldPriceId: number): Promise<number | null> {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  try {
    const res = await fetch(SJC_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `method=GetGoldPriceHistory&goldPriceId=${goldPriceId}&fromDate=${formatDate(twoDaysAgo)}&toDate=${formatDate(now)}`,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: SjcHistoryRow[] };
    const rows = json.data ?? [];
    return rows.length > 0 ? rows[0].SellValue : null;
  } catch {
    return null;
  }
}

export async function fetchSjcGoldPrices(): Promise<Map<number, SjcPrice>> {
  const current = await fetchCurrentPrices();
  const result = new Map<number, SjcPrice>();

  await Promise.all(
    SJC_GOLD_TYPES.map(async ({ goldPriceId }) => {
      const row = current.get(goldPriceId);
      if (!row) return;
      const prevSell = await fetchPreviousClose(goldPriceId);
      result.set(goldPriceId, {
        goldPriceId,
        buy: row.BuyValue,
        sell: row.SellValue,
        changePercent: prevSell ? ((row.SellValue - prevSell) / prevSell) * 100 : null,
      });
    }),
  );

  return result;
}
