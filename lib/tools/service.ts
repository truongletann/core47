import { eq, and, like, or, asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { categories as categoriesTable, tools as toolsTable } from "@/db/schema";
import { ToolListQuerySchema, type ToolListQuery } from "./schema";
import type { Category, Tool } from "@/types/tool";

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.sortOrder));

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    sortOrder: r.sortOrder,
  }));
}

export async function getTools(rawQuery: ToolListQuery): Promise<Tool[]> {
  const query = ToolListQuerySchema.parse(rawQuery); // fail-fast if input violates the contract

  const db = await getDb();

  const conditions = [
    query.category ? eq(toolsTable.categoryId, query.category) : undefined,
    query.status ? eq(toolsTable.status, query.status) : undefined,
    query.search
      ? or(
          like(toolsTable.name, `%${query.search}%`),
          like(toolsTable.description, `%${query.search}%`),
        )
      : undefined,
  ].filter(Boolean);

  const rows = await db
    .select()
    .from(toolsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(toolsTable.sortOrder));

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    subdomain: r.subdomain,
    icon: r.icon,
    categoryId: r.categoryId,
    status: r.status as Tool["status"],
    sortOrder: r.sortOrder,
  }));
}