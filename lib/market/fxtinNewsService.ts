import { desc, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { fxtinNews } from "@/db/schema";

export async function listArticles(limit = 50) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(fxtinNews)
    .orderBy(desc(fxtinNews.publishedAt))
    .limit(limit);
  return rows.map((r) => ({ ...r, important: Boolean(r.important) }));
}

export async function getLastFetchedAt(): Promise<string | null> {
  const db = await getDb();
  const row = await db
    .select({ max: sql<string | null>`max(${fxtinNews.fetchedAt})` })
    .from(fxtinNews)
    .get();
  return row?.max ?? null;
}

export async function shouldRefresh(thresholdMinutes: number): Promise<boolean> {
  const lastFetchedAt = await getLastFetchedAt();
  if (!lastFetchedAt) return true;
  const ageMs = Date.now() - new Date(lastFetchedAt).getTime();
  return ageMs > thresholdMinutes * 60 * 1000;
}
