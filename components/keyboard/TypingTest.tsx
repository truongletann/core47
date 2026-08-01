"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Timer, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Lang = "en" | "vi";
type Length = "short" | "long";

const SAMPLES: Record<Lang, Record<Length, string[]>> = {
  en: {
    short: [
      "The quick brown fox jumps over the lazy dog while the sun sets behind the distant mountains, painting the whole sky in warm shades of orange and deep purple.",
      "Programming is the art of telling another human what one wants the computer to do, and most of the craft is spent reading code written by someone else.",
      "Success usually comes to those who are too busy looking for it to notice how far they have already come, one small and steady step at a time each day.",
      "A journey of a thousand miles begins with a single step, so stop overthinking the whole plan and just start typing the very first sentence right now.",
      "Practice makes perfect, and the only real way to type faster without more mistakes is to keep practicing a little every single day without skipping.",
    ],
    long: [
      "The quick brown fox jumps over the lazy dog while the sun sets behind the distant mountains, painting the whole sky in warm shades of orange and deep purple. Somewhere far in the valley below, a train whistle echoes gently across the fields, reminding every tired traveler that the very last ride of the day is about to depart from the old wooden station near the river.",
      "Programming is the art of telling another human what one wants the computer to do, and yet so much of the actual craft is spent reading code written by someone else, or even by yourself six months ago, trying patiently to reconstruct the exact reasoning behind a decision that once made perfect sense but now looks like nothing more than a confusing riddle.",
      "In the middle of every difficulty lies a hidden opportunity, or so the old saying goes, and nowhere does that feel more true than in the slow process of learning to type quickly and accurately. Every single mistake is simply feedback, a small gentle nudge pointing toward exactly which finger needs a little more patient practice before the next attempt.",
      "A journey of a thousand miles begins with a single step, and the very same idea is true of building any large piece of software from nothing. What looks like an impossible task on the first day slowly becomes a familiar, comfortable routine after weeks of small, steady, unglamorous progress that nobody else really notices until the project finally ships.",
    ],
  },
  vi: {
    short: [
      "Tôi thích lập trình và uống cà phê vào mỗi buổi sáng trước khi bắt đầu công việc, vì đó là khoảng thời gian yên tĩnh nhất trong ngày để suy nghĩ thấu đáo.",
      "Cuộc sống là một chuyến đi dài, hãy tận hưởng từng khoảnh khắc bên những người ta yêu thương, vì không ai biết trước được ngày mai sẽ mang đến điều gì.",
      "Dự án này được xây dựng trên nền tảng Next.js và triển khai trên Cloudflare Workers, tận dụng khả năng chạy ở rất nhiều điểm edge trên toàn cầu.",
      "Học gõ phím nhanh giúp tiết kiệm thời gian làm việc và giảm mỏi tay đáng kể, đặc biệt là khi phải soạn thảo văn bản hoặc viết mã nguồn liên tục.",
      "Kiên trì mỗi ngày một chút sẽ mang lại kết quả bất ngờ, giống như những giọt nước nhỏ bé cuối cùng cũng có thể làm đầy cả một chiếc bình lớn.",
    ],
    long: [
      "Tôi thích lập trình và uống cà phê vào mỗi buổi sáng trước khi bắt đầu công việc, vì đó là khoảng thời gian yên tĩnh nhất trong ngày để suy nghĩ thấu đáo mọi vấn đề phức tạp mà cả ngày họp hành không thể nào giải quyết nổi. Chỉ cần một tách cà phê nóng và một đoạn nhạc nhẹ nhàng là đủ để bắt đầu một ngày làm việc hiệu quả.",
      "Cuộc sống là một chuyến đi dài, hãy tận hưởng từng khoảnh khắc bên những người ta yêu thương, vì không ai biết trước được ngày mai sẽ mang đến điều gì cho chúng ta. Những kỷ niệm đẹp hôm nay chính là hành trang quý giá nhất cho chặng đường phía trước, dù con đường đó có nhiều gian nan đến đâu đi chăng nữa.",
      "Dự án này được xây dựng trên nền tảng Next.js và triển khai trên Cloudflare Workers, tận dụng khả năng chạy ở rất nhiều điểm edge trên toàn cầu để mang lại tốc độ phản hồi nhanh nhất có thể cho người dùng ở bất kỳ đâu, đồng thời vẫn giữ được chi phí vận hành ở mức thấp nhờ mô hình serverless hiện đại.",
      "Học gõ phím nhanh giúp tiết kiệm thời gian làm việc và giảm mỏi tay đáng kể, đặc biệt là khi phải soạn thảo văn bản hoặc viết mã nguồn trong nhiều giờ liên tục mỗi ngày. Việc luyện tập đều đặn không chỉ cải thiện tốc độ mà còn giúp giảm hẳn số lỗi gõ sai, từ đó nâng cao chất lượng công việc tổng thể.",
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
