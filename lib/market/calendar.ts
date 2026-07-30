import { XMLParser } from "fast-xml-parser";
import { getDb } from "@/db/client";
import { calendarEvents } from "@/db/schema";
import { getCalendarSettings } from "./calendarSettingsService";

// Unofficial ForexFactory calendar feed. No official API exists — see prior
// research on TradingEconomics/Finnhub pricing. Feed URLs live in
// calendar_settings (admin-editable) rather than hardcoded here, so a dead
// or changed URL doesn't need a code deploy to fix. The "today" variant
// 404s outside certain windows, so this always pulls the weekly feed (a
// superset containing today) — thisWeekFeedUrl is the one actually used.

const parser = new XMLParser({ ignoreAttributes: true });

type Impact = "holiday" | "low" | "medium" | "high";

interface ParsedEvent {
  title: string;
  country: string;
  eventDate: string;
  eventTime: string | null;
  impact: Impact;
  forecast: string | null;
  previous: string | null;
  actual: string | null;
  sourceUrl: string | null;
}

function textOf(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (v && typeof v === "object" && "#text" in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>)["#text"]).trim();
  }
  return "";
}

function nullableTextOf(v: unknown): string | null {
  const t = textOf(v);
  return t.length > 0 ? t : null;
}

// Feed dates come as MM-DD-YYYY — convert to ISO (YYYY-MM-DD) so the DB can
// sort/filter by date lexicographically.
function toIsoDate(raw: string): string | null {
  const match = raw.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const [, mm, dd, yyyy] = match;
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeImpact(raw: string): Impact {
  const lower = raw.trim().toLowerCase();
  if (lower === "holiday" || lower === "medium" || lower === "high") return lower;
  return "low";
}

function parseFeed(xml: string): ParsedEvent[] {
  const doc = parser.parse(xml) as Record<string, unknown>;
  const root = doc.weeklyevents as Record<string, unknown> | undefined;
  const raw = root?.event;
  if (!raw) return [];
  const items = Array.isArray(raw) ? raw : [raw];

  return items
    .map((r): ParsedEvent | null => {
      const item = r as Record<string, unknown>;
      const title = textOf(item.title);
      const country = textOf(item.country);
      const eventDate = toIsoDate(textOf(item.date));
      if (!title || !eventDate) return null;

      return {
        title,
        country: country || "—",
        eventDate,
        eventTime: nullableTextOf(item.time),
        impact: normalizeImpact(textOf(item.impact)),
        forecast: nullableTextOf(item.forecast),
        previous: nullableTextOf(item.previous),
        actual: nullableTextOf(item.actual),
        sourceUrl: nullableTextOf(item.url),
      };
    })
    .filter((e): e is ParsedEvent => e !== null);
}

const ROWS_PER_INSERT = 8; // calendar_events has 12 columns — D1 caps at 100 bound params/statement

export async function fetchAndStoreCalendar(): Promise<void> {
  const settings = await getCalendarSettings();
  const res = await fetch(settings.thisWeekFeedUrl, {
    headers: { "User-Agent": "core47-market-calendar/1.0" },
  });
  if (!res.ok) return;

  const xml = await res.text();
  const events = parseFeed(xml);
  if (events.length === 0) return;

  const now = new Date().toISOString();
  const rows = events.map((e, index) => ({
    id: crypto.randomUUID(),
    title: e.title,
    country: e.country,
    eventDate: e.eventDate,
    eventTime: e.eventTime,
    impact: e.impact,
    forecast: e.forecast,
    previous: e.previous,
    actual: e.actual,
    sourceUrl: e.sourceUrl,
    sortOrder: index,
    fetchedAt: now,
  }));

  const db = await getDb();
  // Always a rolling-week snapshot — wholesale replace rather than dedup/upsert.
  await db.delete(calendarEvents);
  for (let i = 0; i < rows.length; i += ROWS_PER_INSERT) {
    await db.insert(calendarEvents).values(rows.slice(i, i + ROWS_PER_INSERT));
  }
}
