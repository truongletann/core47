"use client";

import { useEffect, useState } from "react";
import { SJC_GOLD_TYPES, fetchSjcGoldPrices, type SjcPrice } from "@/lib/market/sjcClient";

function formatVnd(value: number): string {
  return value.toLocaleString("vi-VN", { maximumFractionDigits: 0 });
}

export function VnGoldPrices() {
  const [prices, setPrices] = useState<Map<number, SjcPrice>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSjcGoldPrices()
      .then(setPrices)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {SJC_GOLD_TYPES.map((type) => {
        const p = prices.get(type.goldPriceId);
        const isUp = p?.changePercent !== null && p?.changePercent !== undefined && p.changePercent >= 0;
        return (
          <div key={type.goldPriceId} className="rounded-xl border border-[rgb(var(--border))] p-4">
            <div className="flex items-center justify-between">
              <span className="font-data text-xs text-[rgb(var(--muted))]">SJC</span>
              {p?.changePercent !== null && p?.changePercent !== undefined && (
                <span
                  className={`font-data text-xs font-semibold ${isUp ? "text-emerald-600" : "text-red-600"}`}
                >
                  {isUp ? "+" : ""}
                  {p.changePercent.toFixed(2)}%
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-medium">{type.label}</p>
            <p className="font-data mt-1 text-lg font-semibold">
              {p ? formatVnd(p.sell) : loading ? "…" : "—"}
            </p>
            <p className="text-xs text-[rgb(var(--muted))]">
              {type.unit}
              {p && ` · mua ${formatVnd(p.buy)}`}
            </p>
          </div>
        );
      })}
    </>
  );
}
