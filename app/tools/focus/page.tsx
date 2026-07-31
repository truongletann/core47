"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

  // Single persistent Spotify iframe for the Playlist Library, rendered
  // once at the page root and NEVER reparented — moving an iframe to a
  // different DOM parent (even via appendChild, keeping the same node)
  // makes Chrome tear down and reload its browsing context, which is what
  // silently killed playback before. Instead the iframe's box is tracked
  // with CSS: when the panel's placeholder slot is mounted we measure its
  // on-screen rect and position the iframe exactly on top of it; when the
  // slot unmounts we move the box off-screen. The <iframe> itself always
  // stays put, so playback is untouched either way.
  const playerSlotElRef = useRef<HTMLDivElement | null>(null);
  const [playerBox, setPlayerBox] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null,
  );

  const measurePlayerSlot = useCallback(() => {
    const el = playerSlotElRef.current;
    if (!el) {
      setPlayerBox(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setPlayerBox({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, []);

  const attachPlayerSlot = useCallback(
    (slot: HTMLDivElement | null) => {
      playerSlotElRef.current = slot;
      measurePlayerSlot();
    },
    [measurePlayerSlot],
  );

  useEffect(() => {
    window.addEventListener("resize", measurePlayerSlot);
    return () => window.removeEventListener("resize", measurePlayerSlot);
  }, [measurePlayerSlot]);

  // Re-measure after layout settles whenever the panel/tab/selection
  // changes shape (double rAF = wait for the browser to actually paint).
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(measurePlayerSlot));
    return () => cancelAnimationFrame(id);
  }, [openPanel, soundsTab, activePlaylist, measurePlayerSlot]);

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

      {/* Persistent Spotify iframe — parent never changes (see comment on
          playerBox above), only this box's CSS position/size, so playback
          survives the Sounds panel opening/closing/switching tabs with no
          floating widget ever shown when the slot isn't mounted. */}
      <div
        aria-hidden={!playerBox}
        className="fixed z-40 overflow-hidden rounded-lg transition-none"
        style={
          playerBox
            ? { top: playerBox.top, left: playerBox.left, width: playerBox.width, height: playerBox.height }
            : { top: 0, left: -9999, width: 1, height: 1, opacity: 0, pointerEvents: "none" }
        }
      >
        {activePlaylist && (
          <iframe
            key={activePlaylist.id}
            src={activePlaylist.spotifyEmbedUrl}
            width="100%"
            height="100%"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        )}
      </div>

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
            <SoundsPanel
              tab={soundsTab}
              activePlaylist={activePlaylist}
              onSelectPlaylist={setActivePlaylist}
              attachPlayerSlot={attachPlayerSlot}
            />
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
