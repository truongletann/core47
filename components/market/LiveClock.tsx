"use client";

import { useEffect, useState } from "react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Avoid a server/client markup mismatch — render nothing until mounted.
  if (!now) return null;

  const time = now.toLocaleTimeString("en-GB", { hour12: false });

  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-[rgb(var(--border))] px-4 py-2.5">
      <span className="font-display text-2xl font-semibold text-[rgb(var(--accent))]">{now.getDate()}</span>
      <span className="text-sm text-[rgb(var(--muted))]">{MONTHS[now.getMonth()]}</span>
      <span className="font-data ml-auto text-lg text-[rgb(var(--accent))]">{time}</span>
    </div>
  );
}
