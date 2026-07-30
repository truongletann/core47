"use client";

import { SCENES, type SceneKey } from "@/lib/focus/types";
import { SoundMixer } from "@/components/focus/SoundMixer";

const SCENE_SWATCHES: Record<SceneKey, string> = {
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

export function AmbienceModal({ scene, onSceneChange }: { scene: SceneKey; onSceneChange: (s: SceneKey) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">Cảnh nền</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {SCENES.map((s) => (
            <button
              key={s.key}
              onClick={() => onSceneChange(s.key)}
              className={`overflow-hidden rounded-xl border-2 text-left transition-colors ${
                scene === s.key ? "border-white" : "border-transparent hover:border-white/30"
              }`}
            >
              <div className="h-14 w-full" style={{ background: SCENE_SWATCHES[s.key] }} />
              <p className="bg-black/40 px-2 py-1.5 text-xs text-white">{s.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">Âm thanh nền</p>
        <SoundMixer />
      </div>
    </div>
  );
}
