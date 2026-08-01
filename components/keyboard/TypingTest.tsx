"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Timer, Target, Zap } from "lucide-react";
import { generatePassage, type Lang, type Length } from "@/lib/keyboard/passageGenerator";
import { cn } from "@/lib/utils/cn";

type Status = "idle" | "running" | "done";

export function TypingTest() {
  const [lang, setLang] = useState<Lang>("en");
  const [length, setLength] = useState<Length>("short");
  const [sample, setSample] = useState(() => generatePassage("en", "short"));
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status !== "running" || startedAt === null) return;
    const id = window.setInterval(() => setElapsedMs(Date.now() - startedAt), 100);
    return () => window.clearInterval(id);
  }, [status, startedAt]);

  const stats = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === sample[i]) correct++;
    }
    const minutes = Math.max(elapsedMs, 1) / 60000;
    const wpm = Math.round(correct / 5 / minutes);
    const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
    return { correct, wpm, accuracy };
  }, [typed, sample, elapsedMs]);

  function resetWith(nextLang: Lang, nextLength: Length) {
    setSample(generatePassage(nextLang, nextLength));
    setTyped("");
    setStatus("idle");
    setStartedAt(null);
    setElapsedMs(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleChange(value: string) {
    if (status === "done") return;
    if (value.length > sample.length) value = value.slice(0, sample.length);

    if (status === "idle" && value.length > 0) {
      setStartedAt(Date.now());
      setStatus("running");
    }

    setTyped(value);

    if (value.length === sample.length) {
      setStatus("done");
      if (startedAt !== null) setElapsedMs(Date.now() - startedAt);
    }
  }

  function restart() {
    setSample(generatePassage(lang, length));
    setTyped("");
    setStatus("idle");
    setStartedAt(null);
    setElapsedMs(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1">
          {([
            ["en", "English"],
            ["vi", "Tiếng Việt"],
          ] as [Lang, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setLang(value);
                resetWith(value, length);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                lang === value ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1">
          {([
            ["short", "Đoạn ngắn"],
            ["long", "Đoạn dài"],
          ] as [Length, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setLength(value);
                resetWith(lang, value);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                length === value ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-center">
          <p className="flex items-center justify-center gap-1 font-data text-[10px] text-[rgb(var(--muted))]">
            <Zap size={11} /> WPM
          </p>
          <p className="font-display mt-1 text-2xl font-bold text-[rgb(var(--accent))]">{stats.wpm}</p>
        </div>
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-center">
          <p className="flex items-center justify-center gap-1 font-data text-[10px] text-[rgb(var(--muted))]">
            <Target size={11} /> Độ chính xác
          </p>
          <p className="font-display mt-1 text-2xl font-bold">{stats.accuracy}%</p>
        </div>
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-center">
          <p className="flex items-center justify-center gap-1 font-data text-[10px] text-[rgb(var(--muted))]">
            <Timer size={11} /> Thời gian
          </p>
          <p className="font-display mt-1 text-2xl font-bold">{(elapsedMs / 1000).toFixed(1)}s</p>
        </div>
      </div>

      <div
        onClick={() => inputRef.current?.focus()}
        className="cursor-text rounded-2xl border-2 border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 font-data text-lg leading-relaxed tracking-wide"
      >
        {sample.split("").map((ch, i) => {
          const typedCh = typed[i];
          const isCurrent = i === typed.length;
          return (
            <span
              key={i}
              className={cn(
                isCurrent && status !== "done" && "border-l-2 border-[rgb(var(--accent))]",
                typedCh === undefined
                  ? "text-[rgb(var(--muted))]"
                  : typedCh === ch
                    ? "text-[rgb(var(--fg))]"
                    : "bg-red-500/20 text-red-500",
              )}
            >
              {ch}
            </span>
          );
        })}
      </div>

      <input
        ref={inputRef}
        value={typed}
        onChange={(e) => handleChange(e.target.value)}
        disabled={status === "done"}
        autoFocus
        placeholder="Bắt đầu gõ vào đây..."
        className="font-data w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)] disabled:opacity-50"
      />

      {status === "done" && (
        <div className="rounded-xl border border-[rgb(var(--accent)/0.4)] bg-[rgb(var(--accent)/0.08)] p-4 text-center">
          <p className="font-display text-lg font-semibold">
            Hoàn thành! {stats.wpm} WPM · {stats.accuracy}% chính xác
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={restart}
        className="mx-auto flex items-center gap-1.5 rounded-lg border border-[rgb(var(--border))] px-4 py-2 text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
      >
        <RotateCcw size={14} /> Đoạn văn khác
      </button>
    </div>
  );
}
