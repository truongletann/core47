"use client";

import { useEffect, useMemo, useState } from "react";
import { Dices, Copy, Check, RotateCcw, ListChecks, Hash, Shuffle, Eraser, Share2, Scale, Minus, Plus } from "lucide-react";
import { secureRandomInt, secureRandomFloat, secureShuffle } from "@/lib/random/secureRandom";
import { SpinWheel } from "@/components/random/SpinWheel";
import { cn } from "@/lib/utils/cn";

type Mode = "list" | "range";

function parseListItems(text: string): string[] {
  return text
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const DEFAULT_LIST = "Sherlock Holmes\nElizabeth Bennet\nJay Gatsby\nHermione Granger\nAtticus Finch\nHuckleberry Finn\nJane Eyre\nFrodo Baggins\nHarry Potter\nKatniss Everdeen";
const LIST_STORAGE_KEY = "core47:random:list";
const WEIGHTS_STORAGE_KEY = "core47:random:weights";

export default function RandomPage() {
  const [mode, setMode] = useState<Mode>("list");

  // --- List mode state ---
  const [listText, setListText] = useState(DEFAULT_LIST);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [weightMode, setWeightMode] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

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
  const weightsArray = useMemo(() => listItems.map((name) => weights[name] ?? 1), [listItems, weights]);

  // Load a shared list from the URL (?list=...) if present, otherwise
  // restore whatever the user last had saved locally.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("list");
    if (shared) {
      setListText(decodeURIComponent(shared));
      return;
    }
    const savedList = localStorage.getItem(LIST_STORAGE_KEY);
    if (savedList) setListText(savedList);
    const savedWeights = localStorage.getItem(WEIGHTS_STORAGE_KEY);
    if (savedWeights) {
      try {
        setWeights(JSON.parse(savedWeights));
      } catch {
        // ignore malformed storage
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LIST_STORAGE_KEY, listText);
  }, [listText]);

  useEffect(() => {
    localStorage.setItem(WEIGHTS_STORAGE_KEY, JSON.stringify(weights));
  }, [weights]);

  function adjustWeight(name: string, delta: number) {
    setWeights((prev) => ({ ...prev, [name]: Math.min(10, Math.max(1, (prev[name] ?? 1) + delta)) }));
  }

  function handleShare() {
    const url = `${window.location.origin}/?list=${encodeURIComponent(listItems.join("\n"))}`;
    navigator.clipboard?.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
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

    setRolling(true);
    window.setTimeout(() => {
      if (rangeDecimal) {
        const picks: number[] = [];
        for (let i = 0; i < count; i++) picks.push(secureRandomFloat(min, max, rangeDecimals));
        setRangeResults(picks);
      } else {
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
      }
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

  return (
    <main className={cn("mx-auto px-6 py-16", mode === "list" ? "max-w-5xl" : "max-w-3xl")}>
      <div className="text-center">
        <span className="font-data inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted))]">
          <span className="led-dot bg-[rgb(var(--accent))]" />
          random.core47.xyz
        </span>
        <h1 className="font-display mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Random <span className="text-[rgb(var(--accent))]">có chủ đích</span>
        </h1>
        <p className="mt-3 text-[rgb(var(--muted))]">
          Quay vòng quay để bốc thăm từ danh sách, hoặc random số trong một khoảng — dùng CSPRNG, công bằng và không lưu dữ liệu lên máy chủ.
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

      {mode === "list" ? (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">
            <SpinWheel items={listItems} weights={weightsArray} onItemsChange={(next) => setListText(next.join("\n"))} />
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setWeightMode((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs",
                  weightMode
                    ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.1)] text-[rgb(var(--accent))]"
                    : "border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
                )}
              >
                <Scale size={12} /> Trọng số
              </button>
              <button
                type="button"
                onClick={handleShare}
                disabled={listItems.length === 0}
                className="flex items-center gap-1.5 rounded-md border border-[rgb(var(--border))] px-2.5 py-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] disabled:opacity-40"
              >
                {shareCopied ? <Check size={12} /> : <Share2 size={12} />}
                {shareCopied ? "Đã chép link" : "Chia sẻ"}
              </button>
              <button
                type="button"
                onClick={() => setListText(secureShuffle(listItems).join("\n"))}
                disabled={listItems.length < 2}
                className="flex items-center gap-1.5 rounded-md border border-[rgb(var(--border))] px-2.5 py-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] disabled:opacity-40"
              >
                <Shuffle size={12} /> Xáo trộn
              </button>
              <button
                type="button"
                onClick={() => setListText("")}
                disabled={listItems.length === 0}
                className="flex items-center gap-1.5 rounded-md border border-[rgb(var(--border))] px-2.5 py-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] disabled:opacity-40"
              >
                <Eraser size={12} /> Xoá hết
              </button>
            </div>

            {weightMode ? (
              <div className="max-h-[26rem] overflow-y-auto rounded-lg border border-[rgb(var(--border))]">
                {listItems.length === 0 ? (
                  <p className="p-4 text-center text-xs text-[rgb(var(--muted))]">Danh sách trống — tắt chế độ trọng số để nhập mục.</p>
                ) : (
                  listItems.map((name, i) => (
                    <div
                      key={`${name}-${i}`}
                      className="flex items-center justify-between gap-2 border-b border-[rgb(var(--border))] px-3 py-2 last:border-0"
                    >
                      <span className="truncate text-sm">{name}</span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustWeight(name, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="font-data w-5 text-center text-xs">{weights[name] ?? 1}</span>
                        <button
                          type="button"
                          onClick={() => adjustWeight(name, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <textarea
                value={listText}
                onChange={(e) => setListText(e.target.value)}
                placeholder={"An\nBình\nChi\nDũng"}
                rows={16}
                className="font-data w-full resize-y rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
              />
            )}
            <p className="mt-1.5 text-right text-xs text-[rgb(var(--muted))]">
              {listItems.length} mục{weightMode ? " · trọng số cao hơn = xác suất trúng cao hơn" : " · tự lưu trên trình duyệt của bạn"}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">
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

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          {rangeResults.length > 0 && !rolling && (
            <div className="mt-6 rounded-xl border border-[rgb(var(--accent)/0.4)] bg-[rgb(var(--bg))] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">Kết quả</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(rangeResults)}
                    className="flex items-center gap-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Đã chép" : "Chép"}
                  </button>
                  <button
                    onClick={() => setRangeResults([])}
                    className="flex items-center gap-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  >
                    <RotateCcw size={13} /> Xoá
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {rangeResults.map((r, i) => (
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
      )}
    </main>
  );
}
