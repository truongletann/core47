"use client";

import { useState } from "react";
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

// The feed's raw times are UTC (confirmed against ForexFactory's own
// browser-local display — VN is UTC+7, no DST). Only clock-style values
// ("8:00am", "11:50pm") can be shifted; "All Day"/"Tentative" pass through.
function formatVnTime(rawTime: string | null): string | null {
  if (!rawTime) return null;
  const match = rawTime.trim().match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!match) return null;

  const [, hourStr, minuteStr, period] = match;
  let hour24 = Number(hourStr) % 12;
  if (period.toLowerCase() === "pm") hour24 += 12;
  const minute = Number(minuteStr);

  const totalMinutes = hour24 * 60 + minute + 7 * 60;
  const dayShift = Math.floor(totalMinutes / (24 * 60));
  const remMinutes = totalMinutes % (24 * 60);
  const vnHour24 = Math.floor(remMinutes / 60);
  const vnMinute = remMinutes % 60;

  const vnPeriod = vnHour24 >= 12 ? "pm" : "am";
  const vnHour12 = vnHour24 % 12 === 0 ? 12 : vnHour24 % 12;
  const timeLabel = `${vnHour12}:${String(vnMinute).padStart(2, "0")}${vnPeriod}`;
  return dayShift > 0 ? `${timeLabel} +1` : timeLabel;
}

function DayTable({ events }: { events: CalendarEvent[] }) {
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
            const vnTime = formatVnTime(e.eventTime);
            return (
            <tr key={e.id} className="border-b border-[rgb(var(--border))] last:border-0">
              <td className="font-data px-4 py-2 text-xs">
                {e.eventTime ?? "—"}
                {vnTime && <span className="text-[rgb(var(--muted))]"> (UTC+7: {vnTime})</span>}
              </td>
              <td className="px-4 py-2 text-xs font-semibold">{e.country}</td>
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
  const today = new Date().toISOString().slice(0, 10);
  const dates = [...new Set(events.map((e) => e.eventDate))].sort();
  const [selected, setSelected] = useState<string>(dates.includes(today) ? today : "week");

  const byDate = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const list = byDate.get(e.eventDate) ?? [];
    list.push(e);
    byDate.set(e.eventDate, list);
  }

  const visibleDates = selected === "week" ? dates : [selected];

  return (
    <div>
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
            <DayTable events={byDate.get(date) ?? []} />
          </div>
        ))}
      </div>
    </div>
  );
}
