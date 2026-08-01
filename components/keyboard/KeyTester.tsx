"use client";

import { useCallback, useState } from "react";
import { RotateCcw, MousePointerClick, Volume2, VolumeX } from "lucide-react";
import { getKeyboardRows, countTotalKeys, type OS } from "@/lib/keyboard/layout";
import { playKeyClick } from "@/lib/audio/tones";
import { cn } from "@/lib/utils/cn";

export function KeyTester({ os, onOsChange }: { os: OS; onOsChange: (os: OS) => void }) {
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [tested, setTested] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<{ code: string; key: string } | null>(null);
  const [focused, setFocused] = useState(false);
  const [muted, setMuted] = useState(false);

  const rows = getKeyboardRows(os);
  const totalKeys = countTotalKeys(os);

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
          "relative select-none rounded-2xl border-2 bg-[rgb(var(--card))] p-4 outline-none transition-colors sm:p-5",
          focused ? "border-[rgb(var(--accent))]" : "border-[rgb(var(--border))]",
        )}
      >
        {!focused && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-2xl bg-[rgb(var(--bg)/0.75)] font-data text-sm text-[rgb(var(--muted))] backdrop-blur-[1px]">
            <MousePointerClick size={16} /> Bấm vào đây rồi gõ phím để kiểm tra
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          {rows.map((row, ri) => (
            <div key={ri} className="flex gap-1.5">
              {row.map((k) => {
                const isPressed = pressed.has(k.code);
                const isTested = tested.has(k.code);
                return (
                  <div
                    key={k.code}
                    style={{ flexGrow: k.flex }}
                    className={cn(
                      "flex h-9 min-w-0 items-center justify-center rounded-md border font-data text-[11px] transition-colors duration-75 sm:h-10 sm:text-xs",
                      isPressed
                        ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white"
                        : isTested
                          ? "border-[rgb(var(--accent)/0.5)] bg-[rgb(var(--accent)/0.12)] text-[rgb(var(--accent))]"
                          : "border-[rgb(var(--border))] bg-[rgb(var(--bg))] text-[rgb(var(--fg))]",
                    )}
                  >
                    {k.label}
                  </div>
                );
              })}
            </div>
          ))}
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
