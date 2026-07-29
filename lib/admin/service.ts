import { eq, asc, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { categories, tools, users, list100Items, list100Suggestions } from "@/db/schema";
import {
  CategorySchema,
  UpdateCategorySchema,
  ToolSchema,
  type CategoryInput,
  type UpdateCategoryInput,
  type ToolInput,
  type List100ItemInput,
} from "./schema";

export async function listCategoriesAdmin() {
  const db = await getDb();
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function createCategory(raw: CategoryInput) {
  const input = CategorySchema.parse(raw);
  const db = await getDb();

  const existing = await db.select().from(categories).where(eq(categories.id, input.id)).get();
  if (existing) throw new Error("ID_TAKEN");

  await db.insert(categories).values(input);
  return input;
}

export async function updateCategory(id: string, raw: UpdateCategoryInput) {
  const input = UpdateCategorySchema.parse(raw);
  const db = await getDb();
  await db.update(categories).set(input).where(eq(categories.id, id));
}

export async function deleteCategory(id: string) {
  const db = await getDb();
  const inUse = await db.select().from(tools).where(eq(tools.categoryId, id)).get();
  if (inUse) throw new Error("CATEGORY_IN_USE");
  await db.delete(categories).where(eq(categories.id, id));
}

export async function listToolsAdmin() {
  const db = await getDb();
  return db.select().from(tools).orderBy(tools.sortOrder);
}

export async function createTool(raw: ToolInput) {
  const input = ToolSchema.parse(raw);
  const db = await getDb();

  const existingSlug = await db.select().from(tools).where(eq(tools.slug, input.slug)).get();
  if (existingSlug) throw new Error("SLUG_TAKEN");

  const existingSubdomain = await db
    .select()
    .from(tools)
    .where(eq(tools.subdomain, input.subdomain))
    .get();
  if (existingSubdomain) throw new Error("SUBDOMAIN_TAKEN");

  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(tools).values(record);
  return record;
}

export async function updateTool(id: string, raw: ToolInput) {
  const input = ToolSchema.parse(raw);
  const db = await getDb();

  const existingSlug = await db.select().from(tools).where(eq(tools.slug, input.slug)).get();
  if (existingSlug && existingSlug.id !== id) throw new Error("SLUG_TAKEN");

  const existingSubdomain = await db
    .select()
    .from(tools)
    .where(eq(tools.subdomain, input.subdomain))
    .get();
  if (existingSubdomain && existingSubdomain.id !== id) throw new Error("SUBDOMAIN_TAKEN");

  await db
    .update(tools)
    .set({ ...input, updatedAt: new Date().toISOString() })
    .where(eq(tools.id, id));
}

export async function deleteTool(id: string) {
  const db = await getDb();
  await db.delete(tools).where(eq(tools.id, id));
}

export async function listUsersAdmin() {
  const db = await getDb();
  const rows = await db.select().from(users);
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    username: r.username,
    name: r.name,
    isAdmin: Boolean(r.isAdmin),
    isDisabled: Boolean(r.isDisabled),
    lastLoginAt: r.lastLoginAt,
    createdAt: r.createdAt,
  }));
}

export async function setUserDisabled(id: string, disabled: boolean) {
  const db = await getDb();
  await db.update(users).set({ isDisabled: disabled ? 1 : 0 }).where(eq(users.id, id));
}

export async function listList100Admin() {
  const db = await getDb();
  const rows = await db.select().from(list100Items).orderBy(asc(list100Items.rank));
  return rows.map((r) => ({
    ...r,
    isDone: Boolean(r.isDone),
    isPublic: Boolean(r.isPublic),
  }));
}

export async function createList100Item(input: List100ItemInput) {
  const db = await getDb();

  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    rank: input.rank,
    title: input.title,
    note: input.note,
    link: input.link,
    isDone: input.isDone ? 1 : 0,
    completedAt: input.isDone ? now.slice(0, 10) : null,
    isPublic: input.isPublic ? 1 : 0,
    suggestedBy: input.suggestedBy,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(list100Items).values(record);
  return record;
}

export async function updateList100Item(id: string, input: List100ItemInput) {
  const db = await getDb();

  const existing = await db
    .select({ completedAt: list100Items.completedAt })
    .from(list100Items)
    .where(eq(list100Items.id, id))
    .get();

  await db
    .update(list100Items)
    .set({
      rank: input.rank,
      title: input.title,
      note: input.note,
      link: input.link,
      isDone: input.isDone ? 1 : 0,
      completedAt: input.isDone
        ? (existing?.completedAt ?? new Date().toISOString().slice(0, 10))
        : null,
      isPublic: input.isPublic ? 1 : 0,
      suggestedBy: input.suggestedBy,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(list100Items.id, id));
}

export async function deleteList100Item(id: string) {
  const db = await getDb();
  await db.delete(list100Items).where(eq(list100Items.id, id));
}

export async function swapList100Rank(idA: string, idB: string) {
  const db = await getDb();
  const [a, b] = await Promise.all([
    db.select({ rank: list100Items.rank }).from(list100Items).where(eq(list100Items.id, idA)).get(),
    db.select({ rank: list100Items.rank }).from(list100Items).where(eq(list100Items.id, idB)).get(),
  ]);
  if (!a || !b) throw new Error("ITEM_NOT_FOUND");

  await Promise.all([
    db.update(list100Items).set({ rank: b.rank }).where(eq(list100Items.id, idA)),
    db.update(list100Items).set({ rank: a.rank }).where(eq(list100Items.id, idB)),
  ]);
}

export async function listSuggestionsAdmin() {
  const db = await getDb();
  return db.select().from(list100Suggestions).orderBy(desc(list100Suggestions.createdAt));
}

export async function deleteSuggestion(id: string) {
  const db = await getDb();
  await db.delete(list100Suggestions).where(eq(list100Suggestions.id, id));
}
