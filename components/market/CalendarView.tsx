"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface CalendarEvent {
  id: string;
  title: string;
  country: string;
  eventDate: string;
  eventTime: string | null;
  impact: string;
  forecast: string | null;
  previous: string | null;
  actual: string | null;
  sourceUrl: string | null;
  flagUrl: string | null;
}

const IMPACT_LABEL: Record<string, string> = {
  holiday: "Holiday",
  low: "Low",
  medium: "Medium",
  high: "High",
};

const IMPACT_STYLE: Record<string, string> = {
  holiday: "bg-[rgb(var(--muted))]/15 text-[rgb(var(--muted))]",
  low: "bg-[rgb(var(--muted))]/15 text-[rgb(var(--muted))]",
  medium: "bg-amber-500/15 text-amber-600",
  high: "bg-red-500/15 text-red-600",
};

const WEEKDAY_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function shortLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return `${WEEKDAY_SHORT[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

function fullLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

// eventTime is already Asia/Bangkok (= VN time) as "HH:MM" — parsed against
// the visitor's own local clock, so this assumes a VN-based audience (this
// site's target users), same assumption the rest of the calendar makes.
function parseEventDateTime(e: CalendarEvent): Date | null {
  if (!e.eventTime || !/^\d{2}:\d{2}$/.test(e.eventTime)) return null;
  const dt = new Date(`${e.eventDate}T${e.eventTime}:00`);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const hh = h > 0 ? `${h}:` : "";
  return `${hh}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function NextEventBanner({ event, now }: { event: CalendarEvent; now: Date }) {
  const dt = parseEventDateTime(event);
  if (!dt) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/5 px-4 py-3">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgb(var(--accent))] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[rgb(var(--accent))]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[rgb(var(--muted))]">Sự kiện tiếp theo</p>
        <p className="truncate text-sm font-medium">
          {event.country} · {event.title}
        </p>
      </div>
      <div className="text-right">
        <p className="font-data text-lg font-semibold text-[rgb(var(--accent))]">
          {formatCountdown(dt.getTime() - now.getTime())}
        </p>
        <p className="font-data text-[10px] text-[rgb(var(--muted))]">{event.eventTime}</p>
      </div>
    </div>
  );
}

function DayTable({ events, now, nextEventId }: { events: CalendarEvent[]; now: Date; nextEventId: string | null }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Currency</th>
            <th className="px-4 py-2">Event</th>
            <th className="px-4 py-2">Impact</th>
            <th className="px-4 py-2">Actual</th>
            <th className="px-4 py-2">Forecast</th>
            <th className="px-4 py-2">Previous</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => {
            const dt = parseEventDateTime(e);
            const isPast = dt !== null && dt.getTime() < now.getTime();
            const isNext = e.id === nextEventId;
            return (
              <tr
                key={e.id}
                className={cn(
                  "border-b border-[rgb(var(--border))] last:border-0",
                  isNext && "bg-[rgb(var(--accent))]/5",
                )}
              >
                {/* Already Asia/Bangkok (= VN time, UTC+7) — no conversion needed. */}
                <td className="font-data px-4 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    {isNext && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]" />}
                    <span className={isPast ? "text-[rgb(var(--muted))]" : undefined}>{e.eventTime ?? "—"}</span>
                  </span>
                </td>
                <td className="px-4 py-2 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    {e.flagUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.flagUrl} alt="" className="h-3 w-4 rounded-[2px] object-cover" />
                    )}
                    {e.country}
                  </div>
                </td>
                <td className="px-4 py-2">
                  {e.sourceUrl ? (
                    <a
                      href={e.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[rgb(var(--accent))]"
                    >
                      {e.title}
                    </a>
                  ) : (
                    e.title
                  )}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${IMPACT_STYLE[e.impact]}`}
                  >
                    {IMPACT_LABEL[e.impact]}
                  </span>
                </td>
                <td className="font-data px-4 py-2 text-xs">{e.actual ?? "—"}</td>
                <td className="font-data px-4 py-2 text-xs text-[rgb(var(--muted))]">{e.forecast ?? "—"}</td>
                <td className="font-data px-4 py-2 text-xs text-[rgb(var(--muted))]">{e.previous ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const today = now.toISOString().slice(0, 10);
  const dates = [...new Set(events.map((e) => e.eventDate))].sort();
  const [selected, setSelected] = useState<string>(dates.includes(today) ? today : "week");

  const byDate = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const list = byDate.get(e.eventDate) ?? [];
    list.push(e);
    byDate.set(e.eventDate, list);
  }

  const visibleDates = selected === "week" ? dates : [selected];

  let nextEvent: CalendarEvent | null = null;
  let nextEventTime = Infinity;
  for (const e of events) {
    const dt = parseEventDateTime(e);
    if (!dt) continue;
    const t = dt.getTime();
    if (t >= now.getTime() && t < nextEventTime) {
      nextEventTime = t;
      nextEvent = e;
    }
  }

  return (
    <div>
      {nextEvent && <NextEventBanner event={nextEvent} now={now} />}

      <div className="flex flex-wrap gap-1.5 border-b border-[rgb(var(--border))] pb-3">
        <button
          onClick={() => setSelected("week")}
          className={cn(
            "font-data rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
            selected === "week"
              ? "bg-[rgb(var(--accent))] text-white"
              : "border border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
          )}
        >
          Cả tuần
        </button>
        {dates.map((d) => (
          <button
            key={d}
            onClick={() => setSelected(d)}
            className={cn(
              "font-data flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              selected === d
                ? "bg-[rgb(var(--accent))] text-white"
                : "border border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
            )}
          >
            {shortLabel(d)}
            {d === today && (
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  selected === d ? "bg-white" : "bg-[rgb(var(--accent))]",
                )}
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {visibleDates.map((date) => (
          <div key={date}>
            <h2 className="font-data mb-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
              {fullLabel(date)}
              {date === today && (
                <span className="ml-2 rounded-full bg-[rgb(var(--accent))] px-2 py-0.5 text-[10px] font-semibold text-white">
                  Today
                </span>
              )}
            </h2>
            <DayTable events={byDate.get(date) ?? []} now={now} nextEventId={nextEvent?.id ?? null} />
          </div>
        ))}
      </div>
    </div>
  );
}
