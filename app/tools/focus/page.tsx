"use client";

import { useCallback, useEffect, useState } from "react";
import { useFocusData } from "@/lib/focus/useFocusData";
import { usePlayerSlot } from "@/lib/focus/usePlayerSlot";
import { useAmbientSounds } from "@/lib/focus/useAmbientSounds";
import { Timer, type Durations } from "@/components/focus/Timer";
import { SceneBackground } from "@/components/focus/SceneBackground";
import { DockLeft, type LeftPanelKey } from "@/components/focus/DockLeft";
import { DockRight, type RightPanelKey } from "@/components/focus/DockRight";
import { FloatingPanel } from "@/components/focus/FloatingPanel";
import { ThemePickerModal } from "@/components/focus/ThemePickerModal";
import { SoundsPanel, SOUNDS_PANEL_TABS, type CustomPlaylist } from "@/components/focus/SoundsPanel";
import { PersistentEmbed } from "@/components/focus/PersistentEmbed";
import { NotesPanel } from "@/components/focus/NotesPanel";
import { SettingsPanel } from "@/components/focus/SettingsPanel";
import { TaskList } from "@/components/focus/TaskList";
import { EffectsOverlay, NO_EFFECTS, type Effects } from "@/components/focus/EffectsOverlay";
import { AnimationsPanel } from "@/components/focus/AnimationsPanel";
import type { Theme, Playlist } from "@/lib/focus/types";

type PanelKey = LeftPanelKey | RightPanelKey;
const LEFT_KEYS: LeftPanelKey[] = ["todo", "sounds", "notes"];
const AMBIENCE_TABS = [
  { key: "themes", label: "Themes" },
  { key: "animations", label: "Animations" },
];

export default function FocusPage() {
  const { tasks, addTask, toggleTaskDone, deleteTask, logSession } = useFocusData();
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [customPlaylist, setCustomPlaylist] = useState<CustomPlaylist | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [chromeHidden, setChromeHidden] = useState(false);
  const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);
  const [soundsTab, setSoundsTab] = useState<"sounds" | "mymusic" | "library">("sounds");
  const [ambienceTab, setAmbienceTab] = useState<"themes" | "animations">("themes");
  const [effects, setEffects] = useState<Effects>(NO_EFFECTS);
  const [durations, setDurations] = useState<Durations>({
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    longBreakInterval: 4,
  });

  // Persistent iframes for Playlist Library + My Music — each rendered once
  // at the page root and NEVER reparented (see PersistentEmbed). Their boxes
  // are re-measured whenever the panel/tab/selection changes shape (double
  // rAF = wait for the browser to actually paint before reading the rect).
  const libraryPlayer = usePlayerSlot();
  const myMusicPlayer = usePlayerSlot();
  const ambientSounds = useAmbientSounds();

  useEffect(() => {
    window.addEventListener("resize", libraryPlayer.measure);
    window.addEventListener("resize", myMusicPlayer.measure);
    return () => {
      window.removeEventListener("resize", libraryPlayer.measure);
      window.removeEventListener("resize", myMusicPlayer.measure);
    };
  }, [libraryPlayer.measure, myMusicPlayer.measure]);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        libraryPlayer.measure();
        myMusicPlayer.measure();
      }),
    );
    return () => cancelAnimationFrame(id);
  }, [openPanel, soundsTab, activePlaylist, customPlaylist, libraryPlayer.measure, myMusicPlayer.measure]);

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

  const toggleEffect = useCallback((key: keyof Effects) => {
    setEffects((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const notDone = tasks.filter((t) => !t.isDone).length;
  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;
  const displayTask = activeTask ?? tasks.find((t) => !t.isDone) ?? null;

  const isLeft = (k: PanelKey) => (LEFT_KEYS as string[]).includes(k);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <SceneBackground theme={activeTheme} active />
      <EffectsOverlay effects={effects} />

      {!focusMode && !chromeHidden && (
        <div className="pointer-events-none fixed left-6 top-6 z-10 flex flex-col text-white/50">
          <span className="font-hand text-3xl leading-none">focus</span>
          <span className="text-[10px] uppercase tracking-widest text-white/30">by core47</span>
        </div>
      )}

      <Timer
        durations={durations}
        onSessionComplete={handleSessionComplete}
        displayTask={displayTask}
        onEditTask={() => setOpenPanel("todo")}
        activeTheme={activeTheme}
        effects={effects}
        chromeHidden={chromeHidden}
      />

      {!focusMode && (
        <>
          {!chromeHidden && (
            <DockLeft active={openPanel && isLeft(openPanel) ? (openPanel as LeftPanelKey) : null} onSelect={(key) => setOpenPanel((prev) => (prev === key ? null : key))} taskCount={notDone} />
          )}
          <DockRight
            active={openPanel && !isLeft(openPanel) ? (openPanel as RightPanelKey) : null}
            onSelect={(key) => setOpenPanel((prev) => (prev === key ? null : key))}
            focusMode={focusMode}
            onFocusModeToggle={handleFocusModeToggle}
            chromeHidden={chromeHidden}
            onChromeHiddenToggle={() => setChromeHidden((v) => !v)}
          />
        </>
      )}

      {/* Persistent iframes — see usePlayerSlot/PersistentEmbed. Parents
          never change, only CSS position/size, so playback survives the
          Sounds panel opening/closing/switching tabs with no floating
          widget ever shown when neither slot is mounted. */}
      <PersistentEmbed box={libraryPlayer.box} embedId={activePlaylist?.id ?? null} embedUrl={activePlaylist?.spotifyEmbedUrl ?? null} />
      <PersistentEmbed box={myMusicPlayer.box} embedId={customPlaylist?.id ?? null} embedUrl={customPlaylist?.embedUrl ?? null} />

      {openPanel && !focusMode && (
        <FloatingPanel
          align={isLeft(openPanel) ? "left" : "right"}
          onClose={() => setOpenPanel(null)}
          title={openPanel === "todo" ? "Tasks" : openPanel === "notes" ? "Notes" : openPanel === "settings" ? "Settings" : undefined}
          tabs={openPanel === "sounds" ? SOUNDS_PANEL_TABS : openPanel === "ambience" ? AMBIENCE_TABS : undefined}
          activeTab={openPanel === "sounds" ? soundsTab : openPanel === "ambience" ? ambienceTab : undefined}
          onTabChange={(k) =>
            openPanel === "sounds" ? setSoundsTab(k as typeof soundsTab) : setAmbienceTab(k as typeof ambienceTab)
          }
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
              attachPlayerSlot={libraryPlayer.attach}
              customPlaylist={customPlaylist}
              onSelectCustomPlaylist={setCustomPlaylist}
              attachMyMusicSlot={myMusicPlayer.attach}
              sounds={{
                tracks: ambientSounds.tracks,
                volumes: ambientSounds.volumes,
                onToggle: ambientSounds.toggle,
                onSetVolume: ambientSounds.setVolume,
                onPauseAll: ambientSounds.pauseAll,
                onResumeAll: ambientSounds.resumeAll,
                onResetAll: ambientSounds.resetAll,
              }}
            />
          )}
          {openPanel === "notes" && <NotesPanel />}
          {openPanel === "ambience" && ambienceTab === "themes" && (
            <ThemePickerModal
              activeTheme={activeTheme}
              onSelect={(t) => {
                setActiveTheme(t);
                setOpenPanel(null);
              }}
            />
          )}
          {openPanel === "ambience" && ambienceTab === "animations" && (
            <AnimationsPanel effects={effects} onToggle={toggleEffect} onResetAll={() => setEffects(NO_EFFECTS)} />
          )}
          {openPanel === "settings" && <SettingsPanel durations={durations} onChange={setDurations} />}
        </FloatingPanel>
      )}
    </div>
  );
}
