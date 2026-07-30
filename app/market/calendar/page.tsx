import { shouldRefresh, listEvents } from "@/lib/market/calendarService";
import { fetchAndStoreCalendar } from "@/lib/market/calendar";
import { CalendarView } from "@/components/market/CalendarView";

const REFRESH_THRESHOLD_MINUTES = 60;

export default async function MarketCalendarPage() {
  // Lazy refresh, same reasoning as News: no Cloudflare Cron Trigger wired
  // into this OpenNext build, so staleness is checked on request. The feed
  // also rate-limits aggressive polling, hence a longer 60-minute window.
  if (await shouldRefresh(REFRESH_THRESHOLD_MINUTES)) {
    await fetchAndStoreCalendar();
  }

  const events = await listEvents();

  return (
    <main className="py-10">
      <h1 className="font-display text-2xl font-semibold">Forex / World Calendar</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Nguồn: ForexFactory (unofficial feed) — cột giờ hiển thị giờ gốc kèm giờ Việt Nam trong ngoặc
        (múi giờ nguồn = UTC, VN = UTC+7). Chỉ có dữ liệu tuần hiện tại (không có feed tuần trước/sau).
      </p>

      {events.length === 0 ? (
        <p className="mt-8 text-sm text-[rgb(var(--muted))]">Chưa tải được dữ liệu lịch — thử tải lại trang.</p>
      ) : (
        <div className="mt-6">
          <CalendarView events={events} />
        </div>
      )}
    </main>
  );
}
