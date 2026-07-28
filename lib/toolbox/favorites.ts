import { eq, and } from "drizzle-orm";
import { getDb } from "@/db/client";
import { toolFavorites } from "@/db/schema";

export async function getFavoriteSlugs(userId: string): Promise<string[]> {
  const db = await getDb();
  const rows = await db.select().from(toolFavorites).where(eq(toolFavorites.userId, userId));
  return rows.map((r) => r.toolSlug);
}

export async function addFavorite(userId: string, toolSlug: string): Promise<void> {
  const db = await getDb();
  const existing = await db
    .select()
    .from(toolFavorites)
    .where(and(eq(toolFavorites.userId, userId), eq(toolFavorites.toolSlug, toolSlug)))
    .get();
  if (existing) return;

  await db.insert(toolFavorites).values({
    id: crypto.randomUUID(),
    userId,
    toolSlug,
    createdAt: new Date().toISOString(),
  });
}

export async function removeFavorite(userId: string, toolSlug: string): Promise<void> {
  const db = await getDb();
  await db
    .delete(toolFavorites)
    .where(and(eq(toolFavorites.userId, userId), eq(toolFavorites.toolSlug, toolSlug)));
}
