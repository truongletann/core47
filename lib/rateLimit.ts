import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { getDb } from "@/db/client";
import { rateLimits } from "@/db/schema";

export function clientIp(req: NextRequest): string {
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "unknown";
}

/**
 * Fixed-window rate limit backed by D1. Returns true if the request should
 * be allowed, false if the caller has exceeded `limit` hits within
 * `windowMs`. Not perfectly race-free under concurrent requests (D1 has no
 * atomic increment via Drizzle here), but sufficient to blunt scripted abuse
 * on a low-traffic personal site.
 */
export async function checkRateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const db = await getDb();
  const now = Date.now();

  const existing = await db.select().from(rateLimits).where(eq(rateLimits.key, key)).get();

  if (!existing || now - new Date(existing.windowStart).getTime() > windowMs) {
    await db
      .insert(rateLimits)
      .values({ key, count: 1, windowStart: new Date(now).toISOString() })
      .onConflictDoUpdate({ target: rateLimits.key, set: { count: 1, windowStart: new Date(now).toISOString() } });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  await db
    .update(rateLimits)
    .set({ count: existing.count + 1 })
    .where(eq(rateLimits.key, key));
  return true;
}
