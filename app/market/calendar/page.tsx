// TODO: replace with a live economic calendar API (TradingEconomics/Finnhub) —
// this is a UI shell only, data below is hardcoded mock data.

interface CalendarEvent {
  country: string;
  time: string;
  event: string;
  impact: "low" | "medium" | "high";
  actual: string | null;
  forecast: string | null;
  previous: string | null;
}

const MOCK_EVENTS: CalendarEvent[] = [
  { country: "US", time: "19:30", event: "Non-Farm Payrolls", impact: "high", actual: null, forecast: "180K", previous: "175K" },
  { country: "US", time: "19:30", event: "Unemployment Rate", impact: "high", actual: null, forecast: "4.1%", previous: "4.1%" },
  { country: "EU", time: "16:00", event: "ECB Interest Rate Decision", impact: "high", actual: "3.25%", forecast: "3.25%", previous: "3.25%" },
  { country: "VN", time: "08:00", event: "CPI y/y", impact: "medium", actual: "3.2%", forecast: "3.1%", previous: "3.0%" },
  { country: "JP", time: "06:50", event: "BOJ Policy Rate", impact: "high", actual: null, forecast: "0.50%", previous: "0.50%" },
  { country: "UK", time: "13:00", event: "GDP q/q", impact: "medium", actual: null, forecast: "0.3%", previous: "0.2%" },
];

const IMPACT_STYLE: Record<CalendarEvent["impact"], string> = {
  high: "bg-red-500/15 text-red-600",
  medium: "bg-amber-500/15 text-amber-600",
  low: "bg-[rgb(var(--muted))]/15 text-[rgb(var(--muted))]",
};

export default function MarketCalendarPage() {
  return (
    <main className="py-10">
      <h1 className="font-display text-2xl font-semibold">Forex / World Calendar</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Lịch kinh tế các nước — dữ liệu mẫu, chưa kết nối nguồn thật.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Event</th>
              <th className="px-4 py-2">Impact</th>
              <th className="px-4 py-2">Actual</th>
              <th className="px-4 py-2">Forecast</th>
              <th className="px-4 py-2">Previous</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_EVENTS.map((e, i) => (
              <tr key={i} className="border-b border-[rgb(var(--border))] last:border-0">
                <td className="font-data px-4 py-2 text-xs">{e.time}</td>
                <td className="px-4 py-2 text-xs font-semibold">{e.country}</td>
                <td className="px-4 py-2">{e.event}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${IMPACT_STYLE[e.impact]}`}>
                    {e.impact}
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
    </main>
  );
}
