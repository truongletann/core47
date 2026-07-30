import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { calendarSettings } from "@/db/schema";
import { CalendarSettingsSchema, type CalendarSettingsInput } from "./calendarSettingsSchema";

const SETTINGS_ID = "default";

const FALLBACK_THISWEEK_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.xml";
const FALLBACK_TODAY_URL = "https://nfs.faireconomy.media/ff_calendar_today.xml";

export async function getCalendarSettings() {
  const db = await getDb();
  const existing = await db
    .select()
    .from(calendarSettings)
    .where(eq(calendarSettings.id, SETTINGS_ID))
    .get();
  if (existing) return existing;

  // Migration 0018 seeds this row, but fall back to sane defaults if it's
  // ever missing (e.g. a fresh DB that skipped the seed insert).
  const record = {
    id: SETTINGS_ID,
    todayFeedUrl: FALLBACK_TODAY_URL,
    thisWeekFeedUrl: FALLBACK_THISWEEK_URL,
    fieldMapping: null,
    updatedAt: new Date().toISOString(),
  };
  await db.insert(calendarSettings).values(record);
  return record;
}

export async function updateCalendarSettings(raw: CalendarSettingsInput) {
  const input = CalendarSettingsSchema.parse(raw);
  const db = await getDb();

  await getCalendarSettings(); // ensure the row exists before updating
  await db
    .update(calendarSettings)
    .set({
      todayFeedUrl: input.todayFeedUrl,
      thisWeekFeedUrl: input.thisWeekFeedUrl,
      fieldMapping: input.fieldMapping,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(calendarSettings.id, SETTINGS_ID));
}
