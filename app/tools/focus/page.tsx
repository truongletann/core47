"use client";

import { useCallback, useState } from "react";
import { useFocusData } from "@/lib/focus/useFocusData";
import { Timer, type Durations } from "@/components/focus/Timer";
import { SceneBackground } from "@/components/focus/SceneBackground";
import { DockLeft, type LeftPanelKey } from "@/components/focus/DockLeft";
import { DockRight, type RightPanelKey } from "@/components/focus/DockRight";
import { FloatingPanel } from "@/components/focus/FloatingPanel";
import { ThemePickerModal } from "@/components/focus/ThemePickerModal";
import { SoundsPanel, SOUNDS_PANEL_TABS } from "@/components/focus/SoundsPanel";
import { NotesPanel } from "@/components/focus/NotesPanel";
import { SettingsPanel } from "@/components/focus/SettingsPanel";
import { NowPlayingWidget } from "@/components/focus/NowPlayingWidget";
import { TaskList } from "@/components/focus/TaskList";
import type { Theme, Playlist } from "@/lib/focus/types";

type PanelKey = LeftPanelKey | RightPanelKey;
const LEFT_KEYS: LeftPanelKey[] = ["todo", "sounds", "notes"];

export default function FocusPage() {
  const { tasks, addTask, toggleTaskDone, deleteTask, logSession } = useFocusData();
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);
  const [soundsTab, setSoundsTab] = useState<"sounds" | "mymusic" | "library">("sounds");
  const [durations, setDurations] = useState<Durations>({
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    longBreakInterval: 4,
  });

  const handleSessionComplete = useCallback(
    (type: "work" | "break", durationMinutes: number) => {
      logSession(type, durationMinutes, type === "work" ? activeTaskId : null);
    },
    [logSession, activeTaskId],
  );

  const handleFocusModeToggle = useCallback(() => {
    if (!focusMode) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setFocusMode(true);
    } else {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      setFocusMode(false);
    }
  }, [focusMode]);

  const notDone = tasks.filter((t) => !t.isDone).length;
  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;
  const displayTask = activeTask ?? tasks.find((t) => !t.isDone) ?? null;

  const isLeft = (k: PanelKey) => (LEFT_KEYS as string[]).includes(k);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <SceneBackground theme={activeTheme} active />

      {!focusMode && (
        <a href="https://core47.xyz" className="fixed left-6 top-6 z-10 flex flex-col text-white">
          <span className="font-display text-2xl font-semibold leading-none">flocus</span>
          <span className="text-[10px] uppercase tracking-widest text-white/50">by core47</span>
        </a>
      )}

      <Timer durations={durations} onSessionComplete={handleSessionComplete} displayTask={displayTask} onEditTask={() => setOpenPanel("todo")} />

      {!focusMode && (
        <>
          <DockLeft active={openPanel && isLeft(openPanel) ? (openPanel as LeftPanelKey) : null} onSelect={(key) => setOpenPanel((prev) => (prev === key ? null : key))} taskCount={notDone} />
          <DockRight
            active={openPanel && !isLeft(openPanel) ? (openPanel as RightPanelKey) : null}
            onSelect={(key) => setOpenPanel((prev) => (prev === key ? null : key))}
            focusMode={focusMode}
            onFocusModeToggle={handleFocusModeToggle}
          />
        </>
      )}

      {/* Mounted unconditionally (never inside a panel) so closing/reopening
          any dock panel or toggling Focus mode doesn't unmount the iframe
          and kill playback — only the widget's own close button does.
          Hidden while the Sounds panel itself is open since that panel
          already renders its own (bigger) inline player for the same
          playlist — showing both was a confusing duplicate. */}
      <NowPlayingWidget
        playlist={activePlaylist}
        visible={!focusMode && openPanel !== "sounds"}
        onClose={() => setActivePlaylist(null)}
      />

      {openPanel && !focusMode && (
        <FloatingPanel
          align={isLeft(openPanel) ? "left" : "right"}
          onClose={() => setOpenPanel(null)}
          title={openPanel === "todo" ? "Tasks" : openPanel === "notes" ? "Notes" : openPanel === "ambience" ? "Ambience" : openPanel === "settings" ? "Settings" : undefined}
          tabs={openPanel === "sounds" ? SOUNDS_PANEL_TABS : undefined}
          activeTab={openPanel === "sounds" ? soundsTab : undefined}
          onTabChange={(k) => setSoundsTab(k as typeof soundsTab)}
        >
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
          {openPanel === "sounds" && (
            <SoundsPanel tab={soundsTab} activePlaylist={activePlaylist} onSelectPlaylist={setActivePlaylist} />
          )}
          {openPanel === "notes" && <NotesPanel />}
          {openPanel === "ambience" && (
            <ThemePickerModal
              activeTheme={activeTheme}
              onSelect={(t) => {
                setActiveTheme(t);
                setOpenPanel(null);
              }}
            />
          )}
          {openPanel === "settings" && <SettingsPanel durations={durations} onChange={setDurations} />}
        </FloatingPanel>
      )}
    </div>
  );
}
