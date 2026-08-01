import { eq, sql, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { shortLinks, users } from "@/db/schema";
import { CreateShortLinkSchema, type CreateShortLinkInput } from "./schema";
import type { ShortLink } from "@/types/shortlink";

function generateCode(): string {
  // Web Crypto API — Edge Runtime compatible, no Node crypto
  // 4 base36 characters (~1.6M combinations) — plenty for personal/family
  // scale, with retry logic on collision so it's safer than 3 characters.
  return crypto.randomUUID().replace(/-/g, "").slice(0, 4);
}

export async function createShortLink(
  raw: CreateShortLinkInput,
  meta: { userId: string | null; ipAddress: string | null; userAgent: string | null },
): Promise<ShortLink> {
  const input = CreateShortLinkSchema.parse(raw); // fail-fast if input violates the contract
  const db = await getDb();

  let code = input.customCode ?? generateCode();

  if (input.customCode) {
    const existing = await db
      .select()
      .from(shortLinks)
      .where(eq(shortLinks.code, code))
      .get();
    if (existing) {
      throw new Error("CODE_TAKEN");
    }
  } else {
    // Retry up to 5 times on a random code collision (very low probability)
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await db
        .select()
        .from(shortLinks)
        .where(eq(shortLinks.code, code))
        .get();
      if (!existing) break;
      code = generateCode();
    }
  }

  const record = {
    id: crypto.randomUUID(),
    code,
    targetUrl: input.url,
    clicks: 0,
    createdAt: new Date().toISOString(),
    userId: meta.userId,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  };

  await db.insert(shortLinks).values(record);
  return record;
}

// Server-originated short links (e.g. bio page share links) skip the public
// CreateShortLinkSchema — that schema rejects core47.xyz targets to stop
// users from creating self-referential redirect loops, but here the target
// URL is built by our own code, not user input, so the guard doesn't apply.
// Reuses an existing code for the same target instead of minting duplicates.
export async function getOrCreateInternalShortLink(
  targetUrl: string,
  userId: string | null,
  existingCode: string | null,
): Promise<ShortLink> {
  const db = await getDb();

  if (existingCode) {
    const existing = await db.select().from(shortLinks).where(eq(shortLinks.code, existingCode)).get();
    if (existing) return existing;
  }

  let code = generateCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await db.select().from(shortLinks).where(eq(shortLinks.code, code)).get();
    if (!existing) break;
    code = generateCode();
  }

  const record = {
    id: crypto.randomUUID(),
    code,
    targetUrl,
    clicks: 0,
    createdAt: new Date().toISOString(),
    userId,
    ipAddress: null,
    userAgent: null,
  };

  await db.insert(shortLinks).values(record);
  return record;
}

export async function resolveShortLink(code: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.select().from(shortLinks).where(eq(shortLinks.code, code)).get();
  if (!row) return null;

  await db
    .update(shortLinks)
    .set({ clicks: sql`${shortLinks.clicks} + 1` })
    .where(eq(shortLinks.code, code));

  return row.targetUrl;
}

export async function getShortLinksByUser(userId: string): Promise<ShortLink[]> {
  const db = await getDb();
  return db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.userId, userId))
    .orderBy(desc(shortLinks.createdAt));
}

export async function deleteShortLink(
  code: string,
  requester: { userId: string | null; isAdmin: boolean },
): Promise<void> {
  const db = await getDb();
  const link = await db.select().from(shortLinks).where(eq(shortLinks.code, code)).get();

  if (!link) {
    throw new Error("NOT_FOUND");
  }

  const isOwner = link.userId && link.userId === requester.userId;
  if (!isOwner && !requester.isAdmin) {
    throw new Error("FORBIDDEN");
  }

  await db.delete(shortLinks).where(eq(shortLinks.code, code));
}
export async function getAllShortLinks(): Promise<ShortLink[]> {
  const db = await getDb();
  return db.select().from(shortLinks).orderBy(desc(shortLinks.createdAt));
}

export interface ShortLinkWithCreator extends ShortLink {
  creatorEmail: string | null;
}

// Used for History: admins see ALL links along with the creator's email,
// regular users only see their own links (creatorEmail = their own email).
export async function getHistoryForUser(
  userId: string,
  isAdmin: boolean,
): Promise<ShortLinkWithCreator[]> {
  const db = await getDb();

  const rows = await db
    .select({
      id: shortLinks.id,
      code: shortLinks.code,
      targetUrl: shortLinks.targetUrl,
      clicks: shortLinks.clicks,
      createdAt: shortLinks.createdAt,
      userId: shortLinks.userId,
      ipAddress: shortLinks.ipAddress,
      userAgent: shortLinks.userAgent,
      creatorEmail: users.email,
    })
    .from(shortLinks)
    .leftJoin(users, eq(shortLinks.userId, users.id))
    .where(isAdmin ? undefined : eq(shortLinks.userId, userId))
    .orderBy(desc(shortLinks.createdAt));

  return rows;
}