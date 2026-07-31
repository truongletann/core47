"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, PictureInPicture2, Pencil } from "lucide-react";
import type { FocusTask } from "@/lib/focus/types";

export type Phase = "work" | "short" | "long";

export interface Durations {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
}

interface TimerProps {
  durations: Durations;
  onSessionComplete: (type: "work" | "break", durationMinutes: number) => void;
  activeTask: FocusTask | null;
  onEditTask: () => void;
}

const QUOTES = [
  "The old ways won't open new doors",
  "Small steps every day add up.",
  "Deep work beats busy work.",
  "Discipline equals freedom.",
  "Focus on progress, not perfection.",
  "One task at a time.",
  "Done is better than perfect.",
];

const TAB_LABEL: Record<Phase, string> = { work: "Focus", short: "Short Break", long: "Long Break" };

function notify(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") new Notification(title, { body });
}

function phaseMinutes(phase: Phase, d: Durations) {
  if (phase === "work") return d.workMinutes;
  if (phase === "short") return d.shortBreakMinutes;
  return d.longBreakMinutes;
}

export function Timer({ durations, onSessionComplete, activeTask, onEditTask }: TimerProps) {
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsLeft, setSecondsLeft] = useState(durations.workMinutes * 60);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [workCount, setWorkCount] = useState(0);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const originalTitleRef = useRef<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const pipParentRef = useRef<HTMLElement | null>(null);
  const pipWindowRef = useRef<Window | null>(null);
  const [inPip, setInPip] = useState(false);

  useEffect(() => {
    if (!running) setSecondsLeft(phaseMinutes(phase, durations) * 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durations.workMinutes, durations.shortBreakMinutes, durations.longBreakMinutes, phase]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    originalTitleRef.current = document.title;
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          const durationMinutes = phaseMinutes(phase, durations);
          onSessionComplete(phase === "work" ? "work" : "break", durationMinutes);
          notify(
            phase === "work" ? "Hết giờ tập trung!" : "Hết giờ nghỉ!",
            phase === "work" ? "Đến lúc nghỉ ngơi một chút." : "Quay lại tập trung nào.",
          );
          let nextPhase: Phase;
          let nextWorkCount = workCount;
          if (phase === "work") {
            nextWorkCount = workCount + 1;
            nextPhase = nextWorkCount % durations.longBreakInterval === 0 ? "long" : "short";
          } else {
            nextPhase = "work";
          }
          setWorkCount(nextWorkCount);
          setPhase(nextPhase);
          return phaseMinutes(nextPhase, durations) * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, phase, durations, onSessionComplete, workCount]);

  useEffect(() => {
    const mm = Math.floor(secondsLeft / 60);
    const ss = secondsLeft % 60;
    const label = `${mm}:${ss.toString().padStart(2, "0")}`;
    document.title = running ? `${label} · ${TAB_LABEL[phase]} — Focus` : originalTitleRef.current;
    return () => {
      document.title = originalTitleRef.current;
    };
  }, [secondsLeft, running, phase]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" && (e.target as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault();
        setStarted(true);
        setRunning((r) => !r);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const switchTab = useCallback(
    (next: Phase) => {
      setRunning(false);
      setPhase(next);
      setSecondsLeft(phaseMinutes(next, durations) * 60);
    },
    [durations],
  );

  const reset = useCallback(() => {
    setRunning(false);
    setStarted(false);
    setSecondsLeft(phaseMinutes(phase, durations) * 60);
  }, [phase, durations]);

  const start = useCallback(() => {
    setStarted(true);
    setRunning(true);
  }, []);

  const togglePip = useCallback(async () => {
    const w = window as unknown as {
      documentPictureInPicture?: { requestWindow: (opts: { width: number; height: number }) => Promise<Window> };
    };
    if (!w.documentPictureInPicture || !contentRef.current) return;

    if (inPip && pipWindowRef.current) {
      pipWindowRef.current.close();
      return;
    }

    const pipWindow = await w.documentPictureInPicture.requestWindow({ width: 260, height: 170 });
    pipWindowRef.current = pipWindow;
    pipWindow.document.body.style.margin = "0";
    pipWindow.document.body.style.background = "#141019";

    [...document.styleSheets].forEach((styleSheet) => {
      try {
        const rules = [...styleSheet.cssRules].map((r) => r.cssText).join("");
        const style = pipWindow.document.createElement("style");
        style.textContent = rules;
        pipWindow.document.head.appendChild(style);
      } catch {
        if (styleSheet.href) {
          const link = pipWindow.document.createElement("link");
          link.rel = "stylesheet";
          link.href = styleSheet.href;
          pipWindow.document.head.appendChild(link);
        }
      }
    });

    pipParentRef.current = contentRef.current.parentElement;
    pipWindow.document.body.appendChild(contentRef.current);
    setInPip(true);

    pipWindow.addEventListener("pagehide", () => {
      if (contentRef.current && pipParentRef.current) {
        pipParentRef.current.appendChild(contentRef.current);
      }
      pipWindowRef.current = null;
      setInPip(false);
    });
  }, [inPip]);

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const pipSupported = typeof window !== "undefined" && "documentPictureInPicture" in window;

  if (!started) {
    return (
      <div className="fixed right-6 top-6 z-10 flex flex-col items-end text-right text-white">
        <span className="font-display text-sm font-medium text-white/90">{TAB_LABEL[phase]}</span>
        <span className="font-data text-5xl font-bold tabular-nums">
          {mm}:{ss.toString().padStart(2, "0")}
        </span>
        <button
          onClick={start}
          className="mt-3 rounded-full bg-violet-600 px-6 py-1.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-colors hover:bg-violet-500"
        >
          Start
        </button>
      </div>
    );
  }

  return (
    <>
      {!inPip && (
        <p className="fixed right-6 top-6 z-10 max-w-xs text-right font-display text-sm italic text-white/80">
          “{quote}”
        </p>
      )}
      <div
        ref={contentRef}
        className="flex flex-col items-center gap-3 rounded-2xl p-4 text-white"
      >
        {activeTask && (
          <button
            onClick={onEditTask}
            className="flex items-center gap-1.5 text-sm text-white/85 hover:text-white"
          >
            <span>{activeTask.title}</span>
            <Pencil size={12} className="text-white/50" />
          </button>
        )}

        <div className="flex gap-1 rounded-full bg-white/10 p-1">
          {(["work", "short", "long"] as Phase[]).map((p) => (
            <button
              key={p}
              onClick={() => switchTab(p)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                phase === p ? "bg-violet-600 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {TAB_LABEL[p]}
            </button>
          ))}
        </div>

        <span className="font-data text-6xl font-bold tabular-nums sm:text-7xl">
          {mm}:{ss.toString().padStart(2, "0")}
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex h-11 w-20 items-center justify-center gap-1.5 rounded-full bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500"
          >
            {running ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            onClick={reset}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Reset"
          >
            <RotateCcw size={15} />
          </button>
          {pipSupported && (
            <button
              onClick={togglePip}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Picture in picture"
            >
              <PictureInPicture2 size={15} />
            </button>
          )}
        </div>
        <p className="text-[11px] text-white/40">Space = play/pause</p>
      </div>
    </>
  );
}
