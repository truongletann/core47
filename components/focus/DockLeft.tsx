"use client";

import { ClipboardList, Music2, Pencil } from "lucide-react";

export type LeftPanelKey = "todo" | "sounds" | "notes";

interface DockLeftProps {
  active: LeftPanelKey | null;
  onSelect: (key: LeftPanelKey) => void;
  taskCount: number;
}

export function DockLeft({ active, onSelect, taskCount }: DockLeftProps) {
  const items: { key: LeftPanelKey; icon: React.ReactNode; label: string; badge?: number }[] = [
    { key: "todo", icon: <ClipboardList size={18} />, label: "Tasks", badge: taskCount },
    { key: "sounds", icon: <Music2 size={18} />, label: "Sounds" },
    { key: "notes", icon: <Pencil size={18} />, label: "Notes" },
  ];

  return (
    <div className="fixed bottom-5 left-5 z-30 flex items-center gap-1 rounded-2xl bg-black/40 p-1.5 text-white shadow-xl backdrop-blur-md">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onSelect(item.key)}
          aria-label={item.label}
          className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
            active === item.key ? "bg-violet-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          {item.icon}
          {!!item.badge && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-400 text-[9px] font-bold text-slate-900">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
