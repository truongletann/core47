import { eq, and, like, or, asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { list100Items as list100Table } from "@/db/schema";
import { List100ListQuerySchema, type List100ListQuery } from "./schema";
import type { List100Item } from "@/types/list100";

function toList100Item(r: typeof list100Table.$inferSelect): List100Item {
  return {
    id: r.id,
    rank: r.rank,
    title: r.title,
    description: r.description,
    category: r.category,
    tags: r.tags ? r.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    imageUrl: r.imageUrl,
    link: r.link,
    status: r.status as List100Item["status"],
    targetDate: r.targetDate,
    completedAt: r.completedAt,
    note: r.note,
    isPublic: Boolean(r.isPublic),
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function getPublicList100Items(
  rawQuery: List100ListQuery,
): Promise<List100Item[]> {
  const query = List100ListQuerySchema.parse(rawQuery);
  const db = await getDb();

  const conditions = [
    eq(list100Table.isPublic, 1),
    query.category ? eq(list100Table.category, query.category) : undefined,
    query.status ? eq(list100Table.status, query.status) : undefined,
    query.search
      ? or(
          like(list100Table.title, `%${query.search}%`),
          like(list100Table.description, `%${query.search}%`),
        )
      : undefined,
  ].filter(Boolean);

  const rows = await db
    .select()
    .from(list100Table)
    .where(and(...conditions))
    .orderBy(asc(list100Table.rank));

  return rows.map(toList100Item);
}

export async function getPublicCategories(): Promise<string[]> {
  const db = await getDb();
  const rows = await db
    .select({ category: list100Table.category })
    .from(list100Table)
    .where(eq(list100Table.isPublic, 1));

  const set = new Set<string>();
  for (const r of rows) {
    if (r.category) set.add(r.category);
  }
  return Array.from(set).sort();
}

export async function getList100Stats(): Promise<{ total: number; done: number }> {
  const db = await getDb();
  const rows = await db
    .select({ status: list100Table.status })
    .from(list100Table)
    .where(eq(list100Table.isPublic, 1));

  return {
    total: rows.length,
    done: rows.filter((r) => r.status === "done").length,
  };
}
