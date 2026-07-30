"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Maximize, Minimize } from "lucide-react";

type Phase = "work" | "break";

interface TimerProps {
  workMinutes: number;
  breakMinutes: number;
  onSessionComplete: (type: Phase, durationMinutes: number) => void;
  onFocusModeToggle: (active: boolean) => void;
  focusMode: boolean;
}

function notify(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

export function Timer({ workMinutes, breakMinutes, onSessionComplete, onFocusModeToggle, focusMode }: TimerProps) {
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [running, setRunning] = useState(false);
  const totalRef = useRef(workMinutes * 60);
  const originalTitleRef = useRef<string>("");

  useEffect(() => {
    if (!running) {
      setSecondsLeft(phase === "work" ? workMinutes * 60 : breakMinutes * 60);
      totalRef.current = phase === "work" ? workMinutes * 60 : breakMinutes * 60;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workMinutes, breakMinutes, phase]);

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
          const durationMinutes = phase === "work" ? workMinutes : breakMinutes;
          onSessionComplete(phase, durationMinutes);
          notify(
            phase === "work" ? "Hết giờ tập trung!" : "Hết giờ nghỉ!",
            phase === "work" ? "Đến lúc nghỉ ngơi một chút." : "Quay lại tập trung nào.",
          );
          const nextPhase: Phase = phase === "work" ? "break" : "work";
          setPhase(nextPhase);
          totalRef.current = (nextPhase === "work" ? workMinutes : breakMinutes) * 60;
          return totalRef.current;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, phase, workMinutes, breakMinutes, onSessionComplete]);

  useEffect(() => {
    const mm = Math.floor(secondsLeft / 60);
    const ss = secondsLeft % 60;
    const label = `${mm}:${ss.toString().padStart(2, "0")}`;
    document.title = running ? `${label} · ${phase === "work" ? "Tập trung" : "Nghỉ"} — Focus` : originalTitleRef.current;
    return () => {
      document.title = originalTitleRef.current;
    };
  }, [secondsLeft, running, phase]);

  const toggleFullscreen = useCallback(() => {
    if (!focusMode) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      onFocusModeToggle(true);
    } else {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      onFocusModeToggle(false);
    }
  }, [focusMode, onFocusModeToggle]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" && (e.target as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault();
        setRunning((r) => !r);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const total = totalRef.current || 1;
  const progress = 1 - secondsLeft / total;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-56 w-56">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={phase === "work" ? "#f97316" : "#22d3ee"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="font-data text-4xl font-semibold tabular-nums">
            {mm}:{ss.toString().padStart(2, "0")}
          </span>
          <span className="mt-1 text-xs uppercase tracking-wide text-white/70">
            {phase === "work" ? "Tập trung" : "Nghỉ"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 hover:opacity-90"
          aria-label={running ? "Pause" : "Play"}
        >
          {running ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSecondsLeft((phase === "work" ? workMinutes : breakMinutes) * 60);
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          aria-label="Reset"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          aria-label="Focus mode"
        >
          {focusMode ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </div>
      <p className="text-xs text-white/50">Space = play/pause</p>
    </div>
  );
}
