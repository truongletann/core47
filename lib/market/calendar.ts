import { getDb } from "@/db/client";
import { calendarEvents } from "@/db/schema";
import { getCalendarSettings } from "./calendarSettingsService";

// fxtin.com's economic calendar — used by permission of the project author
// (a prior project of theirs called this same endpoint). Unofficial/
// undocumented: no SLA, could change or block at any time. The base URL
// lives in calendar_settings (admin-editable); the date is appended per
// request since this endpoint returns one day at a time — a full week is
// 7 requests, not 1.

type Impact = "holiday" | "low" | "medium" | "high";
type EventKind = "economic" | "speech";

interface ParsedEvent {
  title: string;
  country: string;
  eventDate: string;
  eventTime: string | null;
  star: number;
  influence: number | null;
  flagUrl: string | null;
  eventKind: EventKind;
  forecast: string | null;
  previous: string | null;
  actual: string | null;
}

interface FxtinContentItem {
  translate?: string;
  currency?: string;
  country_flag?: string;
  pub_time_tz?: string;
  pub_time?: string;
  previous?: string;
  consensus?: string;
  actual?: string;
  star?: string | number;
  influence?: number;
}

interface FxtinGroup {
  content?: FxtinContentItem[];
  events_translate?: string;
  currency?: string;
  country_flag?: string;
  pub_time_tz?: string;
  pub_time?: string;
  star?: string | number;
  influence?: number;
}

function nullableString(v: string | undefined): string | null {
  if (!v) return null;
  const t = v.trim();
  if (t.length === 0 || t === "null" || t === "-%" || t === "-") return null;
  return t;
}

// pub_time_tz looks like "2026-07-30 01:00:00", already in Asia/Bangkok
// (= Vietnam time, same UTC+7 offset) per the API's date_time_zone field.
function splitDateTime(raw: string | undefined, fallbackDate: string, fallbackTime: string | null) {
  if (!raw) return { date: fallbackDate, time: fallbackTime };
  const [date, time] = raw.split(" ");
  return { date: date ?? fallbackDate, time: time ? time.slice(0, 5) : fallbackTime };
}

function starToImpact(star: number): Impact {
  if (star >= 4) return "high";
  if (star === 3) return "medium";
  return "low";
}

function parseDayResponse(json: unknown, fallbackDate: string): ParsedEvent[] {
  const groups = (json as { data?: { list?: FxtinGroup[] } })?.data?.list;
  if (!Array.isArray(groups)) return [];

  const events: ParsedEvent[] = [];

  for (const group of groups) {
    if (Array.isArray(group.content)) {
      for (const c of group.content) {
        const title = nullableString(c.translate);
        if (!title) continue;
        const { date, time } = splitDateTime(c.pub_time_tz, fallbackDate, c.pub_time ?? null);
        events.push({
          title,
          country: nullableString(c.currency) ?? "—",
          eventDate: date,
          eventTime: time,
          star: Number(c.star ?? 0),
          influence: c.influence ?? null,
          flagUrl: nullableString(c.country_flag),
          eventKind: "economic",
          forecast: nullableString(c.consensus),
          previous: nullableString(c.previous),
          actual: nullableString(c.actual),
        });
      }
    }

    const speechTitle = nullableString(group.events_translate);
    if (speechTitle) {
      const { date, time } = splitDateTime(group.pub_time_tz, fallbackDate, group.pub_time ?? null);
      events.push({
        title: speechTitle,
        country: nullableString(group.currency) ?? "—",
        eventDate: date,
        eventTime: time,
        star: Number(group.star ?? 0),
        influence: group.influence ?? null,
        flagUrl: nullableString(group.country_flag),
        eventKind: "speech",
        forecast: null,
        previous: null,
        actual: null,
      });
    }
  }

  return events;
}

// fxtin's own date format: "YYYY/M/D" (no zero-padding).
function toFxtinDate(d: Date): string {
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function currentWeekDates(): Date[] {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

const ROWS_PER_INSERT = 6; // calendar_events has ~16 columns — D1 caps at 100 bound params/statement

export async function fetchAndStoreCalendar(): Promise<void> {
  const settings = await getCalendarSettings();
  const baseUrl = settings.thisWeekFeedUrl;

  const days = currentWeekDates();
  const results = await Promise.all(
    days.map(async (d) => {
      const fxtinDate = toFxtinDate(d);
      const isoDate = d.toISOString().slice(0, 10);
      try {
        const url = `${baseUrl}?important=0&date=${encodeURIComponent(fxtinDate)}`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
            Referer: "https://fxtin.com/",
          },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return parseDayResponse(json, isoDate);
      } catch (err) {
        console.error(`[market/calendar] failed to fetch ${fxtinDate}:`, err);
        return [];
      }
    }),
  );

  const allEvents = results.flat();
  if (allEvents.length === 0) return;

  allEvents.sort((a, b) => (a.eventDate + (a.eventTime ?? "")).localeCompare(b.eventDate + (b.eventTime ?? "")));

  const now = new Date().toISOString();
  const rows = allEvents.map((e, index) => ({
    id: crypto.randomUUID(),
    title: e.title,
    country: e.country,
    eventDate: e.eventDate,
    eventTime: e.eventTime,
    impact: starToImpact(e.star),
    forecast: e.forecast,
    previous: e.previous,
    actual: e.actual,
    sourceUrl: null,
    sortOrder: index,
    fetchedAt: now,
    star: e.star,
    influence: e.influence,
    flagUrl: e.flagUrl,
    eventKind: e.eventKind,
  }));

  const db = await getDb();
  // Always a rolling-week snapshot — wholesale replace rather than dedup/upsert.
  await db.delete(calendarEvents);
  for (let i = 0; i < rows.length; i += ROWS_PER_INSERT) {
    await db.insert(calendarEvents).values(rows.slice(i, i + ROWS_PER_INSERT));
  }
}
