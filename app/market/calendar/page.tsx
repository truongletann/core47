import { shouldRefresh, listEvents } from "@/lib/market/calendarService";
import { fetchAndStoreCalendar } from "@/lib/market/calendar";

const REFRESH_THRESHOLD_MINUTES = 60;

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

function formatDayHeader(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default async function MarketCalendarPage() {
  // Lazy refresh, same reasoning as News: no Cloudflare Cron Trigger wired
  // into this OpenNext build, so staleness is checked on request. The feed
  // also rate-limits aggressive polling, hence a longer 60-minute window.
  if (await shouldRefresh(REFRESH_THRESHOLD_MINUTES)) {
    await fetchAndStoreCalendar();
  }

  const events = await listEvents();
  const today = new Date().toISOString().slice(0, 10);

  const byDate = new Map<string, typeof events>();
  for (const e of events) {
    const list = byDate.get(e.eventDate) ?? [];
    list.push(e);
    byDate.set(e.eventDate, list);
  }

  return (
    <main className="py-10">
      <h1 className="font-display text-2xl font-semibold">Forex / World Calendar</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Nguồn: ForexFactory (unofficial feed) — giờ hiển thị theo giờ gốc của nguồn, chưa quy đổi múi giờ VN.
      </p>

      {events.length === 0 ? (
        <p className="mt-8 text-sm text-[rgb(var(--muted))]">Chưa tải được dữ liệu lịch — thử tải lại trang.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {[...byDate.entries()].map(([date, dayEvents]) => (
            <div key={date}>
              <h2 className="font-data mb-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                {formatDayHeader(date)}
                {date === today && (
                  <span className="ml-2 rounded-full bg-[rgb(var(--accent))] px-2 py-0.5 text-[10px] font-semibold text-white">
                    Today
                  </span>
                )}
              </h2>
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
                    {dayEvents.map((e) => (
                      <tr key={e.id} className="border-b border-[rgb(var(--border))] last:border-0">
                        <td className="font-data px-4 py-2 text-xs">{e.eventTime ?? "—"}</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
