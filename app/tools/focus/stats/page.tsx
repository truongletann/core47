"use client";

import Link from "next/link";
import { useFocusData } from "@/lib/focus/useFocusData";
import { Garden } from "@/components/focus/Garden";

export default function FocusStatsPage() {
  const { stats } = useFocusData();

  return (
    <main className="py-10">
      <Link href="/" className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]">
        ← Quay lại Timer
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold">Thống kê</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Hôm nay", value: `${stats.todayMinutes}p` },
          { label: "Tuần này", value: `${stats.weekMinutes}p` },
          { label: "Tháng này", value: `${stats.monthMinutes}p` },
          { label: "Streak", value: `${stats.streakDays} ngày` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[rgb(var(--border))] p-4">
            <p className="text-xs text-[rgb(var(--muted))]">{s.label}</p>
            <p className="font-data mt-1 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold">Khu vườn tập trung</h2>
        <div className="mt-3">
          <Garden totalSessions={stats.totalSessions} />
        </div>
      </div>
    </main>
  );
}
