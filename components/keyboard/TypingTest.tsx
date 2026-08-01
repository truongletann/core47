"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Timer, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Lang = "en" | "vi";
type Length = "short" | "long";

const SAMPLES: Record<Lang, Record<Length, string[]>> = {
  en: {
    short: [
      "The quick brown fox jumps over the lazy dog while the sun sets behind the mountains.",
      "Programming is the art of telling another human what one wants the computer to do.",
      "Success usually comes to those who are too busy to be looking for it every single day.",
      "A journey of a thousand miles begins with a single step, so start typing right now.",
      "Practice makes perfect, and the only way to type faster is to keep practicing every day.",
    ],
    long: [
      "The quick brown fox jumps over the lazy dog while the sun sets behind the mountains, painting the sky in shades of orange and purple. Somewhere in the distance, a train whistle echoes across the valley, reminding travelers that the last ride of the day is about to depart from the old station.",
      "Programming is the art of telling another human what one wants the computer to do, and yet so much of the craft is spent reading code written by someone else, or by yourself six months ago, trying to reconstruct the reasoning behind a decision that once made perfect sense but now looks like a riddle.",
      "In the middle of every difficulty lies opportunity, or so the saying goes, and nowhere is that more true than in the process of learning to type quickly and accurately. Every mistake is simply feedback, a small nudge pointing toward which finger needs a little more practice before the next attempt.",
      "A journey of a thousand miles begins with a single step, and the same is true of building any large piece of software. What looks like an impossible task on day one slowly becomes a familiar routine after weeks of small, steady, unglamorous progress that nobody notices until the project finally ships.",
    ],
  },
  vi: {
    short: [
      "Toi thich lap trinh va uong ca phe vao moi buoi sang truoc khi bat dau lam viec.",
      "Cuoc song la mot chuyen di dai, hay tan huong tung khoanh khac ben nhung nguoi ta yeu thuong.",
      "Du an nay duoc xay dung tren nen tang Next.js va trien khai tren Cloudflare Workers.",
      "Hoc go phim nhanh giup tiet kiem thoi gian lam viec va giam moi tay dang ke.",
    ],
    long: [
      "Toi thich lap trinh va uong ca phe vao moi buoi sang truoc khi bat dau lam viec, vi khoang thoi gian yen tinh do la luc dau oc minh man nhat de giai quyet nhung van de phuc tap ma ca ngay hop hanh khong the nao lam duoc.",
      "Cuoc song la mot chuyen di dai, hay tan huong tung khoanh khac ben nhung nguoi ta yeu thuong, boi vi khong ai biet truoc duoc ngay mai se mang den dieu gi, va nhung ky niem dep hom nay chinh la hanh trang quy gia nhat cho chang duong phia truoc.",
      "Du an nay duoc xay dung tren nen tang Next.js va trien khai tren Cloudflare Workers, tan dung kha nang chay o rat nhieu diem edge tren toan cau de mang lai toc do phan hoi nhanh nhat co the cho nguoi dung o bat ky dau.",
    ],
  },
};

type Status = "idle" | "running" | "done";

function pickSample(lang: Lang, length: Length, exclude?: string): string {
  const pool = SAMPLES[lang][length].filter((s) => s !== exclude);
  const source = pool.length > 0 ? pool : SAMPLES[lang][length];
  return source[Math.floor(Math.random() * source.length)] ?? SAMPLES[lang][length][0];
}

export function TypingTest() {
  const [lang, setLang] = useState<Lang>("en");
  const [length, setLength] = useState<Length>("short");
  const [sample, setSample] = useState(() => pickSample("en", "short"));
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
    setSample(pickSample(nextLang, nextLength));
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
    setSample((prev) => pickSample(lang, length, prev));
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
