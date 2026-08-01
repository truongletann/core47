"use client";

import { useMemo, useState } from "react";
import { Dices, Copy, Check, RotateCcw, ListChecks, Hash } from "lucide-react";
import { secureRandomInt, secureRandomFloat, secureShuffle } from "@/lib/random/secureRandom";
import { cn } from "@/lib/utils/cn";

type Mode = "list" | "range";

function parseListItems(text: string): string[] {
  return text
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function RandomPage() {
  const [mode, setMode] = useState<Mode>("list");

  // --- List mode state ---
  const [listText, setListText] = useState("");
  const [listCount, setListCount] = useState(1);
  const [listAllowRepeat, setListAllowRepeat] = useState(false);
  const [listResults, setListResults] = useState<string[]>([]);

  // --- Range mode state ---
  const [rangeMin, setRangeMin] = useState(1);
  const [rangeMax, setRangeMax] = useState(100);
  const [rangeCount, setRangeCount] = useState(1);
  const [rangeAllowRepeat, setRangeAllowRepeat] = useState(true);
  const [rangeDecimal, setRangeDecimal] = useState(false);
  const [rangeDecimals, setRangeDecimals] = useState(2);
  const [rangeResults, setRangeResults] = useState<number[]>([]);

  const [rolling, setRolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listItems = useMemo(() => parseListItems(listText), [listText]);

  function rollList() {
    setError(null);
    if (listItems.length === 0) {
      setError("Nhập ít nhất một mục vào danh sách.");
      return;
    }
    const count = Math.max(1, Math.floor(listCount));
    if (!listAllowRepeat && count > listItems.length) {
      setError(`Danh sách chỉ có ${listItems.length} mục, không thể chọn ${count} mục không lặp.`);
      return;
    }

    triggerRoll(() => {
      if (listAllowRepeat) {
        const picks: string[] = [];
        for (let i = 0; i < count; i++) {
          picks.push(listItems[secureRandomInt(0, listItems.length - 1)]);
        }
        setListResults(picks);
      } else {
        setListResults(secureShuffle(listItems).slice(0, count));
      }
    });
  }

  function rollRange() {
    setError(null);
    const min = Math.min(rangeMin, rangeMax);
    const max = Math.max(rangeMin, rangeMax);
    const count = Math.max(1, Math.floor(rangeCount));

    if (!rangeAllowRepeat && !rangeDecimal) {
      const span = Math.floor(max) - Math.ceil(min) + 1;
      if (count > span) {
        setError(`Khoảng [${min}, ${max}] chỉ có ${span} số nguyên, không thể chọn ${count} số không lặp.`);
        return;
      }
    }

    triggerRoll(() => {
      if (rangeDecimal) {
        const picks: number[] = [];
        for (let i = 0; i < count; i++) picks.push(secureRandomFloat(min, max, rangeDecimals));
        setRangeResults(picks);
        return;
      }

      const lo = Math.ceil(min);
      const hi = Math.floor(max);
      if (rangeAllowRepeat) {
        const picks: number[] = [];
        for (let i = 0; i < count; i++) picks.push(secureRandomInt(lo, hi));
        setRangeResults(picks);
      } else {
        const pool: number[] = [];
        for (let n = lo; n <= hi; n++) pool.push(n);
        setRangeResults(secureShuffle(pool).slice(0, count));
      }
    });
  }

  function triggerRoll(apply: () => void) {
    setRolling(true);
    window.setTimeout(() => {
      apply();
      setRolling(false);
    }, 260);
  }

  function handleCopy(values: (string | number)[]) {
    const text = values.join(", ");
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const results = mode === "list" ? listResults : rangeResults;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <span className="font-data inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted))]">
          <span className="led-dot bg-[rgb(var(--accent))]" />
          random.core47.xyz
        </span>
        <h1 className="font-display mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Random <span className="text-[rgb(var(--accent))]">có chủ đích</span>
        </h1>
        <p className="mt-3 text-[rgb(var(--muted))]">
          Bốc thăm ngẫu nhiên từ danh sách, hoặc random số trong một khoảng — dùng CSPRNG, công bằng và không lưu dữ liệu.
        </p>
      </div>

      {/* Mode switch */}
      <div className="mx-auto mt-8 flex w-fit gap-1 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1">
        <button
          type="button"
          onClick={() => setMode("list")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            mode === "list" ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
          )}
        >
          <ListChecks size={15} /> Từ danh sách
        </button>
        <button
          type="button"
          onClick={() => setMode("range")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            mode === "range" ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
          )}
        >
          <Hash size={15} /> Khoảng số
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">
        {mode === "list" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Danh sách (mỗi dòng hoặc phẩy 1 mục)</label>
              <textarea
                value={listText}
                onChange={(e) => setListText(e.target.value)}
                placeholder={"An\nBình\nChi\nDũng"}
                rows={6}
                className="font-data mt-1.5 w-full resize-y rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
              />
              <p className="mt-1 text-xs text-[rgb(var(--muted))]">{listItems.length} mục hợp lệ</p>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="text-sm font-medium">Số lượng chọn</label>
                <input
                  type="number"
                  min={1}
                  value={listCount}
                  onChange={(e) => setListCount(Number(e.target.value))}
                  className="font-data mt-1.5 w-28 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
                />
              </div>
              <label className="mb-2.5 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={listAllowRepeat}
                  onChange={(e) => setListAllowRepeat(e.target.checked)}
                  className="h-4 w-4 accent-[rgb(var(--accent))]"
                />
                Cho phép lặp lại (có hoàn lại)
              </label>
            </div>

            <button
              type="button"
              onClick={rollList}
              disabled={rolling}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[rgb(var(--accent))] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Dices size={16} className={rolling ? "animate-spin" : ""} />
              {rolling ? "Đang quay..." : "Bốc ngẫu nhiên"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Từ</label>
                <input
                  type="number"
                  value={rangeMin}
                  onChange={(e) => setRangeMin(Number(e.target.value))}
                  className="font-data mt-1.5 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Đến</label>
                <input
                  type="number"
                  value={rangeMax}
                  onChange={(e) => setRangeMax(Number(e.target.value))}
                  className="font-data mt-1.5 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="text-sm font-medium">Số lượng kết quả</label>
                <input
                  type="number"
                  min={1}
                  value={rangeCount}
                  onChange={(e) => setRangeCount(Number(e.target.value))}
                  className="font-data mt-1.5 w-28 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
                />
              </div>
              {rangeDecimal && (
                <div>
                  <label className="text-sm font-medium">Số chữ số thập phân</label>
                  <input
                    type="number"
                    min={0}
                    max={8}
                    value={rangeDecimals}
                    onChange={(e) => setRangeDecimals(Number(e.target.value))}
                    className="font-data mt-1.5 w-28 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={rangeAllowRepeat}
                  onChange={(e) => setRangeAllowRepeat(e.target.checked)}
                  className="h-4 w-4 accent-[rgb(var(--accent))]"
                />
                Cho phép lặp số
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={rangeDecimal}
                  onChange={(e) => setRangeDecimal(e.target.checked)}
                  className="h-4 w-4 accent-[rgb(var(--accent))]"
                />
                Số thập phân
              </label>
            </div>

            <button
              type="button"
              onClick={rollRange}
              disabled={rolling}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[rgb(var(--accent))] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Dices size={16} className={rolling ? "animate-spin" : ""} />
              {rolling ? "Đang quay..." : "Random số"}
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {results.length > 0 && !rolling && (
          <div className="mt-6 rounded-xl border border-[rgb(var(--accent)/0.4)] bg-[rgb(var(--bg))] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium">Kết quả</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(results)}
                  className="flex items-center gap-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Đã chép" : "Chép"}
                </button>
                <button
                  onClick={() => (mode === "list" ? setListResults([]) : setRangeResults([]))}
                  className="flex items-center gap-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                >
                  <RotateCcw size={13} /> Xoá
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {results.map((r, i) => (
                <span
                  key={i}
                  className="font-data rounded-lg border border-[rgb(var(--accent)/0.4)] bg-[rgb(var(--accent)/0.1)] px-3 py-1.5 text-sm font-semibold text-[rgb(var(--accent))]"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
