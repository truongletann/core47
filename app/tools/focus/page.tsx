"use client";

import { useCallback, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useFocusData } from "@/lib/focus/useFocusData";
import { Timer } from "@/components/focus/Timer";
import { SceneBackground } from "@/components/focus/SceneBackground";
import { FocusDock, type DockKey } from "@/components/focus/FocusDock";
import { FocusModal } from "@/components/focus/FocusModal";
import { ThemePickerModal } from "@/components/focus/ThemePickerModal";
import { MusicModal } from "@/components/focus/MusicModal";
import { NowPlayingWidget } from "@/components/focus/NowPlayingWidget";
import { PomoModal } from "@/components/focus/PomoModal";
import { TaskList } from "@/components/focus/TaskList";
import type { Theme, Playlist } from "@/lib/focus/types";

const DOCK_TITLES: Record<DockKey, string> = {
  ambience: "Ambience",
  music: "Music",
  pomo: "Pomodoro",
  todo: "Todo",
};

export default function FocusPage() {
  const { tasks, stats, addTask, toggleTaskDone, deleteTask, logSession } = useFocusData();
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [openPanel, setOpenPanel] = useState<DockKey | null>(null);
  const [durations, setDurations] = useState({ workMinutes: 25, breakMinutes: 5 });
  const { setTheme, resolvedTheme } = useTheme();

  const handleSessionComplete = useCallback(
    (type: "work" | "break", durationMinutes: number) => {
      logSession(type, durationMinutes, type === "work" ? activeTaskId : null);
    },
    [logSession, activeTaskId],
  );

  const handleDockFocusMode = useCallback(() => {
    if (!focusMode) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setFocusMode(true);
    } else {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      setFocusMode(false);
    }
  }, [focusMode]);

  const notDone = tasks.filter((t) => !t.isDone).length;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <SceneBackground theme={activeTheme} active />

      {!focusMode && (
        <div className="fixed left-4 top-4 z-10 flex items-center gap-3 rounded-full bg-black/40 px-4 py-2 text-white backdrop-blur-md">
          <a href="https://core47.xyz" className="font-display text-sm font-semibold hover:opacity-80">
            Focus
          </a>
          <span className="h-3 w-px bg-white/20" />
          <span className="text-xs text-white/70">
            {stats.todayMinutes}p hôm nay · streak {stats.streakDays}
          </span>
          <span className="h-3 w-px bg-white/20" />
          <Link href="/habits" className="text-xs text-white/70 hover:text-white">
            Thói quen
          </Link>
        </div>
      )}

      <div className="flex h-full w-full items-center justify-center">
        <Timer
          workMinutes={durations.workMinutes}
          breakMinutes={durations.breakMinutes}
          onSessionComplete={handleSessionComplete}
          focusMode={focusMode}
          onFocusModeToggle={setFocusMode}
        />
      </div>

      {!focusMode && (
        <FocusDock
          active={openPanel}
          onSelect={(key) => setOpenPanel((prev) => (prev === key ? null : key))}
          onFocusMode={handleDockFocusMode}
          onThemeToggle={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          taskCount={notDone}
        />
      )}

      {/* Mounted unconditionally (never inside a modal) so closing/reopening
          any dock panel or toggling Focus mode doesn't unmount the iframe
          and kill playback — only the widget's own close button does. */}
      <NowPlayingWidget playlist={activePlaylist} visible={!focusMode} onClose={() => setActivePlaylist(null)} />

      {openPanel && (
        <FocusModal title={DOCK_TITLES[openPanel]} onClose={() => setOpenPanel(null)}>
          {openPanel === "ambience" && (
            <ThemePickerModal
              activeTheme={activeTheme}
              onSelect={(t) => {
                setActiveTheme(t);
                setOpenPanel(null);
              }}
            />
          )}
          {openPanel === "music" && (
            <MusicModal activePlaylist={activePlaylist} onSelect={setActivePlaylist} />
          )}
          {openPanel === "pomo" && (
            <PomoModal
              workMinutes={durations.workMinutes}
              breakMinutes={durations.breakMinutes}
              onChange={setDurations}
            />
          )}
          {openPanel === "todo" && (
            <TaskList
              tasks={tasks}
              activeTaskId={activeTaskId}
              onSelectTask={setActiveTaskId}
              onAddTask={addTask}
              onToggleDone={toggleTaskDone}
              onDeleteTask={deleteTask}
            />
          )}
        </FocusModal>
      )}
    </div>
  );
}
