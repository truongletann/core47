"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCcw, MousePointerClick, Volume2, VolumeX } from "lucide-react";
import { getKeyboardRows, getNavCluster, getNumpadKeys, countTotalKeys, isSpacer, type OS, type KeyDef } from "@/lib/keyboard/layout";
import { playKeyClick } from "@/lib/audio/tones";
import { cn } from "@/lib/utils/cn";

function keycapClass(isPressed: boolean, isTested: boolean) {
  return cn(
    "flex h-11 min-w-[2.25rem] items-center justify-center rounded-md border font-data text-xs transition-colors duration-75 sm:h-14 sm:text-sm",
    isPressed
      ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
      : isTested
        ? "border-[rgb(var(--accent)/0.5)] bg-[rgb(var(--accent)/0.12)] text-[rgb(var(--accent))]"
        : "border-[rgb(var(--border))] bg-[rgb(var(--bg))] text-[rgb(var(--fg))]",
  );
}

export function KeyTester({ os, onOsChange }: { os: OS; onOsChange: (os: OS) => void }) {
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [tested, setTested] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<{ code: string; key: string } | null>(null);
  const [focused, setFocused] = useState(false);
  const [muted, setMuted] = useState(false);

  const rows = getKeyboardRows(os);
  const navRows = getNavCluster();
  const numpadKeys = getNumpadKeys();
  const totalKeys = countTotalKeys(os);

  // Switching OS swaps modifier labels (Ctrl/Win/Alt vs Ctrl/Option/Cmd) —
  // the previous "tested" set no longer maps to the same physical keys, so
  // start the run over instead of leaving stale highlights around.
  useEffect(() => {
    setPressed(new Set());
    setTested(new Set());
    setLastKey(null);
  }, [os]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat) return; // don't spam the click sound while a key is held down
      setPressed((prev) => new Set(prev).add(e.code));
      setTested((prev) => new Set(prev).add(e.code));
      setLastKey({ code: e.code, key: e.key });
      playKeyClick(muted, true);
    },
    [muted],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault();
      setPressed((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
      playKeyClick(muted, false);
    },
    [muted],
  );

  function renderKey(k: KeyDef) {
    if (isSpacer(k.code)) {
      return <div key={k.code} style={{ flexGrow: k.flex }} className="h-11 sm:h-14" />;
    }
    return (
      <div key={k.code} style={{ flexGrow: k.flex }} className={keycapClass(pressed.has(k.code), tested.has(k.code))}>
        {k.label}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1">
          {(["windows", "mac"] as OS[]).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onOsChange(o)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                os === o ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
              )}
            >
              {o === "windows" ? "Windows" : "macOS"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-data text-xs text-[rgb(var(--muted))]">
            Đã test {tested.size}/{totalKeys} phím
          </span>
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
            className="flex items-center gap-1.5 rounded-md border border-[rgb(var(--border))] px-2.5 py-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
          <button
            type="button"
            onClick={() => setTested(new Set())}
            className="flex items-center gap-1.5 rounded-md border border-[rgb(var(--border))] px-2.5 py-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setPressed(new Set());
        }}
        className={cn(
          "relative select-none overflow-x-auto rounded-2xl border-2 bg-[rgb(var(--card))] p-5 outline-none transition-colors sm:p-8",
          focused ? "border-[rgb(var(--accent))]" : "border-[rgb(var(--border))]",
        )}
      >
        {!focused && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-2xl bg-[rgb(var(--bg)/0.75)] font-data text-sm text-[rgb(var(--muted))] backdrop-blur-[1px]">
            <MousePointerClick size={16} /> Bấm vào đây rồi gõ phím để kiểm tra
          </div>
        )}

        <div className="flex w-fit min-w-full gap-6">
          {/* Main alphanumeric block */}
          <div className="flex flex-1 flex-col gap-2">
            {rows.map((row, ri) => (
              <div key={ri} className="flex gap-2">
                {row.map(renderKey)}
              </div>
            ))}
          </div>

          {/* Nav / system cluster: PrtSc-ScrLk-Pause, Ins/Home/PgUp, Del/End/PgDn, arrows */}
          <div className="flex w-[11rem] shrink-0 flex-col gap-2 border-l border-[rgb(var(--border))] pl-6 sm:w-44">
            {navRows.map((row, ri) => (
              <div key={ri} className="flex gap-2">
                {row.map(renderKey)}
              </div>
            ))}
          </div>

          {/* Numpad — CSS grid so + / Enter / 0 can span cells like a real keyboard */}
          <div
            className="grid w-[12rem] shrink-0 gap-2 border-l border-[rgb(var(--border))] pl-6 sm:w-48"
            style={{
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gridTemplateRows: "repeat(5, 1fr)",
            }}
          >
            {numpadKeys.map((k) => (
              <div
                key={k.code}
                style={{
                  gridRow: `${k.row} / span ${k.rowSpan ?? 1}`,
                  gridColumn: `${k.col} / span ${k.colSpan ?? 1}`,
                }}
                className={keycapClass(pressed.has(k.code), tested.has(k.code))}
              >
                {k.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="font-data text-center text-xs text-[rgb(var(--muted))]">
        {lastKey ? (
          <>
            Phím gần nhất: <span className="text-[rgb(var(--fg))]">{lastKey.key}</span> ·{" "}
            <span className="text-[rgb(var(--fg))]">{lastKey.code}</span>
          </>
        ) : (
          "Chưa có phím nào được nhấn"
        )}
      </p>
    </div>
  );
}
