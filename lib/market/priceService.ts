import { eq, sql, asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { priceSymbols } from "@/db/schema";

export async function listPrices() {
  const db = await getDb();
  return db
    .select()
    .from(priceSymbols)
    .where(eq(priceSymbols.enabled, 1))
    .orderBy(asc(priceSymbols.sortOrder));
}

export async function getLastFetchedAt(): Promise<string | null> {
  const db = await getDb();
  const row = await db
    .select({ max: sql<string | null>`max(${priceSymbols.lastFetchedAt})` })
    .from(priceSymbols)
    .get();
  return row?.max ?? null;
}

export async function shouldRefresh(thresholdMinutes: number): Promise<boolean> {
  const lastFetchedAt = await getLastFetchedAt();
  if (!lastFetchedAt) return true;
  const ageMs = Date.now() - new Date(lastFetchedAt).getTime();
  return ageMs > thresholdMinutes * 60 * 1000;
}
