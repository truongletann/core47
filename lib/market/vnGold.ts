import { eq, sql, asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { vnGoldPrices } from "@/db/schema";

const VANG_TODAY_ENDPOINT = "https://www.vang.today/api/prices";

interface VangTodayEntry {
  name: string;
  buy: number;
  sell: number;
  change_buy: number;
  change_sell: number;
  currency: string;
}

export async function fetchAndStoreVnGoldPrices(): Promise<void> {
  const db = await getDb();
  const rows = await db.select().from(vnGoldPrices);
  if (rows.length === 0) return;

  let prices: Record<string, VangTodayEntry>;
  try {
    const res = await fetch(VANG_TODAY_ENDPOINT);
    if (!res.ok) {
      console.error(`[market/vnGold] vang.today returned HTTP ${res.status}`);
      return;
    }
    const json = (await res.json()) as { success?: boolean; prices?: Record<string, VangTodayEntry> };
    prices = json.prices ?? {};
  } catch (err) {
    console.error("[market/vnGold] fetch failed:", err);
    return;
  }

  const now = new Date().toISOString();

  await Promise.all(
    rows.map(async (row) => {
      const entry = prices[row.typeCode];
      if (!entry || entry.sell === 0) return;

      const prevSell = entry.sell - entry.change_sell;
      const changePercent = prevSell !== 0 ? (entry.change_sell / prevSell) * 100 : null;

      await db
        .update(vnGoldPrices)
        .set({
          buyPrice: entry.buy,
          sellPrice: entry.sell,
          changePercent,
          lastFetchedAt: now,
        })
        .where(eq(vnGoldPrices.id, row.id));
    }),
  );
}

export async function listVnGoldPrices() {
  const db = await getDb();
  return db.select().from(vnGoldPrices).orderBy(asc(vnGoldPrices.sortOrder));
}

export async function shouldRefreshVnGold(thresholdMinutes: number): Promise<boolean> {
  const db = await getDb();
  const row = await db
    .select({ max: sql<string | null>`max(${vnGoldPrices.lastFetchedAt})` })
    .from(vnGoldPrices)
    .get();
  if (!row?.max) return true;
  const ageMs = Date.now() - new Date(row.max).getTime();
  return ageMs > thresholdMinutes * 60 * 1000;
}
