"use client";

import { useEffect, useState } from "react";

export function PriceRefreshInfo({
  lastFetchedAt,
  thresholdMinutes,
}: {
  lastFetchedAt: string | null;
  thresholdMinutes: number;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now || !lastFetchedAt) return null;

  const fetchedDate = new Date(lastFetchedAt);
  const elapsedMs = now.getTime() - fetchedDate.getTime();
  const remainingMs = thresholdMinutes * 60 * 1000 - elapsedMs;

  const updatedLabel = fetchedDate.toLocaleTimeString("en-GB", { hour12: false });

  let nextLabel: string;
  if (remainingMs <= 0) {
    nextLabel = "sẽ làm mới ở lượt tải trang tiếp theo";
  } else {
    const totalSeconds = Math.floor(remainingMs / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    nextLabel = `còn ${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <p className="font-data mt-1 text-xs text-[rgb(var(--muted))]">
      Cập nhật lúc {updatedLabel} · làm mới mỗi {thresholdMinutes} phút · {nextLabel}
    </p>
  );
}
