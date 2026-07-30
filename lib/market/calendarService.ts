import { asc, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { calendarEvents } from "@/db/schema";

export async function listEvents() {
  const db = await getDb();
  return db
    .select()
    .from(calendarEvents)
    .orderBy(asc(calendarEvents.eventDate), asc(calendarEvents.sortOrder));
}

export async function getLastFetchedAt(): Promise<string | null> {
  const db = await getDb();
  const row = await db
    .select({ max: sql<string | null>`max(${calendarEvents.fetchedAt})` })
    .from(calendarEvents)
    .get();
  return row?.max ?? null;
}

export async function shouldRefresh(thresholdMinutes: number): Promise<boolean> {
  const lastFetchedAt = await getLastFetchedAt();
  if (!lastFetchedAt) return true;
  const ageMs = Date.now() - new Date(lastFetchedAt).getTime();
  return ageMs > thresholdMinutes * 60 * 1000;
}
