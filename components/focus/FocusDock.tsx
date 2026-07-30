"use client";

import { Cloud, Music2, Timer as TimerIcon, ListTodo, BarChart3, Maximize, SunMoon } from "lucide-react";

export type DockKey = "ambience" | "music" | "pomo" | "todo";

interface FocusDockProps {
  active: DockKey | null;
  onSelect: (key: DockKey) => void;
  onFocusMode: () => void;
  onThemeToggle: () => void;
  taskCount: number;
}

export function FocusDock({ active, onSelect, onFocusMode, onThemeToggle, taskCount }: FocusDockProps) {
  const items: { key: DockKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "ambience", label: "Ambience", icon: <Cloud size={18} /> },
    { key: "music", label: "Music", icon: <Music2 size={18} /> },
    { key: "pomo", label: "Pomo", icon: <TimerIcon size={18} /> },
    { key: "todo", label: "Todo", icon: <ListTodo size={18} />, badge: taskCount },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-2xl bg-black/50 px-2 py-2 text-white shadow-xl backdrop-blur-md">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onSelect(item.key)}
          className={`relative flex w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] transition-colors ${
            active === item.key ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
          }`}
        >
          {item.icon}
          {item.label}
          {!!item.badge && (
            <span className="absolute right-2 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-400 text-[9px] font-bold text-slate-900">
              {item.badge}
            </span>
          )}
        </button>
      ))}

      <span className="mx-1 h-8 w-px bg-white/15" />

      <a
        href="/stats"
        className="flex w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] text-white/60 hover:text-white"
      >
        <BarChart3 size={18} />
        Stats
      </a>
      <button
        onClick={onFocusMode}
        className="flex w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] text-white/60 hover:text-white"
      >
        <Maximize size={18} />
        Focus
      </button>
      <button
        onClick={onThemeToggle}
        className="flex w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] text-white/60 hover:text-white"
      >
        <SunMoon size={18} />
        Theme
      </button>
    </div>
  );
}
