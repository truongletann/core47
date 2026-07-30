import { eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { rssSources, newsArticles } from "@/db/schema";
import { RssSourceSchema, type RssSourceInput } from "./newsSchema";

export async function listSourcesAdmin() {
  const db = await getDb();
  const rows = await db.select().from(rssSources).orderBy(desc(rssSources.createdAt));
  return rows.map((r) => ({ ...r, enabled: Boolean(r.enabled) }));
}

export async function listEnabledSources() {
  const db = await getDb();
  const rows = await db.select().from(rssSources).where(eq(rssSources.enabled, 1));
  return rows;
}

export async function createSource(raw: RssSourceInput) {
  const input = RssSourceSchema.parse(raw);
  const db = await getDb();

  const existing = await db.select().from(rssSources).where(eq(rssSources.url, input.url)).get();
  if (existing) throw new Error("URL_TAKEN");

  const record = {
    id: crypto.randomUUID(),
    name: input.name,
    url: input.url,
    category: input.category,
    enabled: input.enabled ? 1 : 0,
    createdAt: new Date().toISOString(),
  };
  await db.insert(rssSources).values(record);
  return record;
}

export async function updateSource(id: string, raw: RssSourceInput) {
  const input = RssSourceSchema.parse(raw);
  const db = await getDb();

  const existing = await db.select().from(rssSources).where(eq(rssSources.url, input.url)).get();
  if (existing && existing.id !== id) throw new Error("URL_TAKEN");

  await db
    .update(rssSources)
    .set({
      name: input.name,
      url: input.url,
      category: input.category,
      enabled: input.enabled ? 1 : 0,
    })
    .where(eq(rssSources.id, id));
}

export async function deleteSource(id: string) {
  const db = await getDb();
  await db.delete(newsArticles).where(eq(newsArticles.sourceId, id));
  await db.delete(rssSources).where(eq(rssSources.id, id));
}

export async function listArticles(limit = 50) {
  const db = await getDb();
  const rows = await db
    .select({
      id: newsArticles.id,
      title: newsArticles.title,
      link: newsArticles.link,
      summary: newsArticles.summary,
      imageUrl: newsArticles.imageUrl,
      publishedAt: newsArticles.publishedAt,
      sourceName: rssSources.name,
    })
    .from(newsArticles)
    .leftJoin(rssSources, eq(newsArticles.sourceId, rssSources.id))
    .orderBy(desc(newsArticles.publishedAt))
    .limit(limit);
  return rows;
}

// Newest fetchedAt across all articles — used to decide whether a lazy
// refresh is due. Returns null when no article has ever been fetched.
export async function getLastFetchedAt(): Promise<string | null> {
  const db = await getDb();
  const row = await db
    .select({ max: sql<string | null>`max(${newsArticles.fetchedAt})` })
    .from(newsArticles)
    .get();
  return row?.max ?? null;
}

export async function shouldRefresh(thresholdMinutes: number): Promise<boolean> {
  const lastFetchedAt = await getLastFetchedAt();
  if (!lastFetchedAt) return true;
  const ageMs = Date.now() - new Date(lastFetchedAt).getTime();
  return ageMs > thresholdMinutes * 60 * 1000;
}
