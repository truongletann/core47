"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { SoundTrack } from "@/lib/focus/types";

function trackSrc(t: SoundTrack) {
  return t.source === "r2" ? `/api/focus/sounds/${t.urlOrKey}` : t.urlOrKey;
}

// Pure panel content (no floating button/popover chrome) — embedded inside
// the Ambience modal alongside the scene picker.
export function SoundMixer() {
  const [tracks, setTracks] = useState<SoundTrack[]>([]);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    fetch("/api/focus/sounds")
      .then((r) => r.json() as Promise<{ data?: { tracks?: SoundTrack[] } }>)
      .then((json) => setTracks(json?.data?.tracks ?? []));
  }, []);

  function setVolume(track: SoundTrack, volume: number) {
    setVolumes((prev) => ({ ...prev, [track.id]: volume }));

    let audio = audioRefs.current[track.id];
    if (!audio) {
      audio = new Audio(trackSrc(track));
      audio.loop = true;
      audioRefs.current[track.id] = audio;
    }
    audio.volume = volume;
    if (volume > 0 && audio.paused) {
      audio.play().catch(() => {});
    } else if (volume === 0 && !audio.paused) {
      audio.pause();
    }
  }

  useEffect(() => {
    const refs = audioRefs.current;
    return () => {
      Object.values(refs).forEach((a) => {
        a.pause();
        a.src = "";
      });
    };
  }, []);

  const categories = Array.from(new Set(tracks.map((t) => t.category)));

  return (
    <div className="flex flex-col gap-4">
      {tracks.length === 0 && <p className="text-xs text-white/50">Đang tải âm thanh...</p>}
      {categories.map((cat) => (
        <div key={cat}>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-white/40">{cat}</p>
          <div className="flex flex-col gap-2">
            {tracks
              .filter((t) => t.category === cat)
              .map((t) => {
                const v = volumes[t.id] ?? 0;
                return (
                  <div key={t.id} className="flex items-center gap-3">
                    <button
                      onClick={() => setVolume(t, v > 0 ? 0 : 0.5)}
                      className="shrink-0 text-white/60 hover:text-white"
                    >
                      {v > 0 ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    </button>
                    <span className="w-28 shrink-0 text-sm text-white/80">{t.name}</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={v}
                      onChange={(e) => setVolume(t, Number(e.target.value))}
                      className="w-full accent-orange-400"
                    />
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
