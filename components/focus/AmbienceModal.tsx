"use client";

import { useEffect, useState } from "react";
import type { Scene } from "@/lib/focus/types";
import { SoundMixer } from "@/components/focus/SoundMixer";

const SCENE_SWATCHES: Record<string, string> = {
  "rainy-window": "linear-gradient(135deg, #1e293b, #334155)",
  thunderstorm: "linear-gradient(135deg, #0f172a, #1e293b)",
  forest: "linear-gradient(135deg, #052e16, #14532d)",
  campfire: "linear-gradient(135deg, #1c1410, #451a03)",
  ocean: "linear-gradient(135deg, #082f49, #0c4a6e)",
  snowfall: "linear-gradient(135deg, #1e293b, #475569)",
  "coffee-shop": "linear-gradient(135deg, #2b1a12, #4a2c1a)",
  "starry-night": "linear-gradient(135deg, #020617, #0f172a)",
  library: "linear-gradient(135deg, #1c1917, #292524)",
};
const DEFAULT_SWATCH = "linear-gradient(135deg, #1e1b2e, #2d2440)";

export function AmbienceModal({ scene, onSceneChange }: { scene: string; onSceneChange: (s: string) => void }) {
  const [scenes, setScenes] = useState<Scene[]>([]);

  useEffect(() => {
    fetch("/api/focus/scenes")
      .then((r) => r.json() as Promise<{ data?: { scenes?: Scene[] } }>)
      .then((json) => setScenes(json?.data?.scenes ?? []));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">Cảnh nền</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {scenes.map((s) => (
            <button
              key={s.key}
              onClick={() => onSceneChange(s.key)}
              className={`overflow-hidden rounded-xl border-2 text-left transition-colors ${
                scene === s.key ? "border-white" : "border-transparent hover:border-white/30"
              }`}
            >
              <div className="h-14 w-full" style={{ background: SCENE_SWATCHES[s.key] ?? DEFAULT_SWATCH }} />
              <p className="bg-black/40 px-2 py-1.5 text-xs text-white">{s.name}</p>
            </button>
          ))}
          {scenes.length === 0 && <p className="col-span-full text-xs text-white/50">Đang tải...</p>}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">Âm thanh nền</p>
        <SoundMixer />
      </div>
    </div>
  );
}
