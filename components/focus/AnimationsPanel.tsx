"use client";

import { CloudRain, Snowflake, Sparkles, Leaf, CloudFog, Star, Sparkle } from "lucide-react";
import type { Effects } from "@/components/focus/EffectsOverlay";

const ITEMS: { key: keyof Effects; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: "rain", label: "Rain", icon: CloudRain },
  { key: "snow", label: "Snow", icon: Snowflake },
  { key: "fireflies", label: "Fireflies", icon: Sparkles },
  { key: "leaves", label: "Falling Leaves", icon: Leaf },
  { key: "fog", label: "Fog", icon: CloudFog },
  { key: "shootingStars", label: "Shooting Stars", icon: Star },
  { key: "dust", label: "Light Dust", icon: Sparkle },
];

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      className={`relative h-6 w-11 shrink-0 overflow-hidden rounded-full transition-colors ${on ? "bg-violet-600" : "bg-white/15"}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// Effects layered on top of whatever Ambience background/theme is active —
// independent toggles, any combination can run at once.
export function AnimationsPanel({ effects, onToggle, onResetAll }: { effects: Effects; onToggle: (key: keyof Effects) => void; onResetAll: () => void }) {
  const anyOn = Object.values(effects).some(Boolean);

  return (
    <div className="flex flex-col gap-1">
      {ITEMS.map(({ key, label, icon: Icon }) => (
        <div key={key} className="flex items-center justify-between rounded-lg px-2 py-2.5">
          <span className="flex items-center gap-2 text-sm text-white/85">
            <Icon size={16} />
            {label}
          </span>
          <Switch on={effects[key]} onToggle={() => onToggle(key)} />
        </div>
      ))}

      <button
        onClick={onResetAll}
        disabled={!anyOn}
        className="mt-3 rounded-lg border border-white/15 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
      >
        Reset All
      </button>
    </div>
  );
}
