"use client";

import { Leaf, Home, Eye, EyeOff, Settings, Maximize, Minimize } from "lucide-react";

export type RightPanelKey = "ambience" | "settings";

interface DockRightProps {
  active: RightPanelKey | null;
  onSelect: (key: RightPanelKey) => void;
  focusMode: boolean;
  onFocusModeToggle: () => void;
  chromeHidden: boolean;
  onChromeHiddenToggle: () => void;
}

export function DockRight({ active, onSelect, focusMode, onFocusModeToggle, chromeHidden, onChromeHiddenToggle }: DockRightProps) {
  const btnClass = (isActive: boolean) =>
    `flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
      isActive ? "bg-violet-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="fixed bottom-5 right-5 z-30 flex items-center gap-1 rounded-2xl bg-black/40 p-1.5 text-white shadow-xl backdrop-blur-md">
      <button onClick={() => onSelect("ambience")} aria-label="Ambience" className={btnClass(active === "ambience")}>
        <Leaf size={18} />
      </button>
      <a href="https://core47.xyz" aria-label="Home" className={btnClass(false)}>
        <Home size={18} />
      </a>
      <button onClick={onChromeHiddenToggle} aria-label="Ẩn giao diện" className={btnClass(false)}>
        {chromeHidden ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      <button onClick={() => onSelect("settings")} aria-label="Cài đặt" className={btnClass(active === "settings")}>
        <Settings size={18} />
      </button>
      <button onClick={onFocusModeToggle} aria-label="Focus mode" className={btnClass(false)}>
        {focusMode ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>
    </div>
  );
}
