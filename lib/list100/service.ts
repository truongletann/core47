import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { list100Items as list100Table } from "@/db/schema";
import type { List100Item } from "@/types/list100";

function toList100Item(r: typeof list100Table.$inferSelect): List100Item {
  return {
    id: r.id,
    rank: r.rank,
    title: r.title,
    note: r.note,
    link: r.link,
    isDone: Boolean(r.isDone),
    completedAt: r.completedAt,
    isPublic: Boolean(r.isPublic),
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function getPublicList100Items(): Promise<List100Item[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(list100Table)
    .where(eq(list100Table.isPublic, 1))
    .orderBy(asc(list100Table.rank));

  return rows.map(toList100Item);
}

export async function getList100Stats(): Promise<{ total: number; done: number }> {
  const db = await getDb();
  const rows = await db
    .select({ isDone: list100Table.isDone })
    .from(list100Table)
    .where(eq(list100Table.isPublic, 1));

  return {
    total: rows.length,
    done: rows.filter((r) => r.isDone === 1).length,
  };
}
