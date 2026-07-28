import { eq, sql, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { shortLinks, users } from "@/db/schema";
import { CreateShortLinkSchema, type CreateShortLinkInput } from "./schema";
import type { ShortLink } from "@/types/shortlink";

function generateCode(): string {
  // Web Crypto API — tương thích Edge Runtime, không dùng Node crypto
  // 4 ký tự base36 (~1.6 triệu tổ hợp) — đủ dùng cho quy mô cá nhân/gia đình,
  // có logic thử lại nếu trùng nên an toàn hơn con số 3 ký tự.
  return crypto.randomUUID().replace(/-/g, "").slice(0, 4);
}

export async function createShortLink(
  raw: CreateShortLinkInput,
  meta: { userId: string | null; ipAddress: string | null; userAgent: string | null },
): Promise<ShortLink> {
  const input = CreateShortLinkSchema.parse(raw); // fail-fast nếu input sai contract
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
    // Thử lại tối đa 5 lần nếu trùng mã ngẫu nhiên (xác suất rất thấp)
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

export async function getAllShortLinks(): Promise<ShortLink[]> {
  const db = await getDb();
  return db.select().from(shortLinks).orderBy(desc(shortLinks.createdAt));
}

export interface ShortLinkWithCreator extends ShortLink {
  creatorEmail: string | null;
}

// Dùng cho History: admin thấy TẤT CẢ link kèm email người tạo,
// user thường chỉ thấy link của chính mình (creatorEmail = email của họ).
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
