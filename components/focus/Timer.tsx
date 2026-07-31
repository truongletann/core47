"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RotateCcw, PictureInPicture2, Pencil } from "lucide-react";
import { ResetDialog } from "@/components/focus/ResetDialog";
import { SceneBackground } from "@/components/focus/SceneBackground";
import { EffectsOverlay, type Effects } from "@/components/focus/EffectsOverlay";
import type { FocusTask, Theme } from "@/lib/focus/types";

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
  displayTask: FocusTask | null;
  onEditTask: () => void;
  activeTheme: Theme | null;
  effects: Effects;
  chromeHidden: boolean;
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

export function Timer({ durations, onSessionComplete, displayTask, onEditTask, activeTheme, effects, chromeHidden }: TimerProps) {
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsLeft, setSecondsLeft] = useState(durations.workMinutes * 60);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [workCount, setWorkCount] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const originalTitleRef = useRef<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const pipParentRef = useRef<HTMLElement | null>(null);
  const pipWindowRef = useRef<Window | null>(null);
  const [inPip, setInPip] = useState(false);
  const [pipBgHost, setPipBgHost] = useState<HTMLDivElement | null>(null);

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

  const resetSegment = useCallback(() => {
    setRunning(false);
    setSecondsLeft(phaseMinutes(phase, durations) * 60);
    setShowResetDialog(false);
  }, [phase, durations]);

  const resetSession = useCallback(() => {
    setRunning(false);
    setStarted(false);
    setPhase("work");
    setWorkCount(0);
    setSecondsLeft(durations.workMinutes * 60);
    setShowResetDialog(false);
  }, [durations]);

  const toggleStart = useCallback(() => {
    setStarted(true);
    setRunning((r) => !r);
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

    const pipWindow = await w.documentPictureInPicture.requestWindow({ width: 420, height: 340 });
    pipWindowRef.current = pipWindow;
    pipWindow.document.body.style.margin = "0";
    pipWindow.document.body.style.display = "flex";
    pipWindow.document.body.style.alignItems = "center";
    pipWindow.document.body.style.justifyContent = "center";
    pipWindow.document.body.style.height = "100%";
    pipWindow.document.body.style.position = "relative";
    pipWindow.document.body.style.overflow = "hidden";

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

    // A real live copy of the current Ambience scene + weather effects,
    // rendered via a React portal (not a moved/cloned node) so it's an
    // independent instance that stays in sync with theme/effects state
    // automatically, instead of a one-off snapshot. z-index:0 pins its own
    // -z-10 layers inside this box instead of escaping behind the pip body.
    const bgHost = pipWindow.document.createElement("div");
    bgHost.style.cssText = "position:fixed;inset:0;z-index:0;overflow:hidden;";
    pipWindow.document.body.appendChild(bgHost);
    setPipBgHost(bgHost);

    pipParentRef.current = contentRef.current.parentElement;
    pipWindow.document.body.appendChild(contentRef.current);
    contentRef.current.style.position = "relative";
    contentRef.current.style.zIndex = "1";
    setInPip(true);

    pipWindow.addEventListener("pagehide", () => {
      if (contentRef.current && pipParentRef.current) {
        contentRef.current.style.position = "";
        contentRef.current.style.zIndex = "";
        pipParentRef.current.appendChild(contentRef.current);
      }
      pipWindowRef.current = null;
      setPipBgHost(null);
      setInPip(false);
    });
  }, [inPip]);

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const pipSupported = typeof window !== "undefined" && "documentPictureInPicture" in window;

  return (
    <>
      {started && !inPip && !chromeHidden && (
        <p className="fixed right-6 top-6 z-10 max-w-xs text-right font-display text-sm italic text-white/80">
          “{quote}”
        </p>
      )}

      <div
        ref={contentRef}
        className={
          inPip
            ? "flex w-[380px] max-w-[92vw] flex-col items-center gap-4 p-4 text-center text-white"
            : "fixed left-1/2 top-1/2 z-10 flex w-[420px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 text-center text-white"
        }
      >
        {!chromeHidden && (
          <button onClick={onEditTask} className="flex items-center gap-1.5 font-display text-lg font-semibold text-white/90 hover:text-white">
            <span>{displayTask ? displayTask.title : "What do you want to focus on?"}</span>
            {displayTask && <Pencil size={13} className="text-white/50" />}
          </button>
        )}

        {!chromeHidden && (
          <div className="flex items-center gap-2">
            {(["work", "short", "long"] as Phase[]).map((p) => (
              <button
                key={p}
                onClick={() => switchTab(p)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                  phase === p ? "bg-violet-600 text-white" : "border-2 border-white/40 text-white hover:border-white/70"
                }`}
              >
                {TAB_LABEL[p]}
              </button>
            ))}
          </div>
        )}

        <span className="font-data text-7xl font-extrabold tabular-nums sm:text-8xl lg:text-9xl">
          {mm}:{ss.toString().padStart(2, "0")}
        </span>

        {!chromeHidden && (
          <div className="flex items-center gap-3">
            <button
              onClick={toggleStart}
              className="rounded-full bg-violet-600 px-10 py-2.5 text-lg font-bold text-white shadow-lg shadow-violet-600/30 hover:bg-violet-500"
            >
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => setShowResetDialog(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Reset"
            >
              <RotateCcw size={17} />
            </button>
            {pipSupported && (
              <button
                onClick={togglePip}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Picture in picture"
              >
                <PictureInPicture2 size={17} />
              </button>
            )}
          </div>
        )}
      </div>

      {showResetDialog && (
        <ResetDialog onClose={() => setShowResetDialog(false)} onResetSegment={resetSegment} onResetSession={resetSession} />
      )}

      {pipBgHost &&
        createPortal(
          <>
            <SceneBackground theme={activeTheme} active />
            <EffectsOverlay effects={effects} />
          </>,
          pipBgHost,
        )}
    </>
  );
}
