"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SoundTrack } from "@/lib/focus/types";

function trackSrc(t: SoundTrack) {
  return t.source === "r2" ? `/api/focus/sounds/${t.urlOrKey}` : t.urlOrKey;
}

// Owned once by page.tsx (not the Sounds panel) so the underlying
// HTMLAudioElements — plain JS objects, never attached to the DOM — keep
// playing across the Sounds panel opening/closing instead of being paused
// and torn down on every unmount. Multiple tracks can be active at once;
// each has its own independent volume.
export function useAmbientSounds() {
  const [tracks, setTracks] = useState<SoundTrack[]>([]);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    fetch("/api/focus/sounds")
      .then((r) => r.json() as Promise<{ data?: { tracks?: SoundTrack[] } }>)
      .then((json) => setTracks(json?.data?.tracks ?? []));
  }, []);

  const setVolume = useCallback((track: SoundTrack, volume: number) => {
    setVolumes((prev) => ({ ...prev, [track.id]: volume }));

    let audio = audioRefs.current[track.id];
    if (!audio) {
      audio = new Audio(trackSrc(track));
      audio.loop = true;
      audioRefs.current[track.id] = audio;
    }
    audio.volume = volume;
    if (volume > 0 && audio.paused) audio.play().catch(() => {});
    else if (volume === 0 && !audio.paused) audio.pause();
  }, []);

  const toggle = useCallback(
    (track: SoundTrack) => {
      const v = volumes[track.id] ?? 0;
      setVolume(track, v > 0 ? 0 : 0.5);
    },
    [volumes, setVolume],
  );

  const pauseAll = useCallback(() => {
    Object.values(audioRefs.current).forEach((a) => a.pause());
  }, []);

  const resumeAll = useCallback(() => {
    Object.entries(audioRefs.current).forEach(([id, a]) => {
      if ((volumes[id] ?? 0) > 0) a.play().catch(() => {});
    });
  }, [volumes]);

  const resetAll = useCallback(() => {
    Object.values(audioRefs.current).forEach((a) => a.pause());
    setVolumes({});
  }, []);

  // Only tears the audio elements down when the page itself unmounts
  // (navigating away from /tools/focus), not when a panel closes.
  useEffect(() => {
    const refs = audioRefs.current;
    return () => {
      Object.values(refs).forEach((a) => {
        a.pause();
        a.src = "";
      });
    };
  }, []);

  return { tracks, volumes, toggle, setVolume, pauseAll, resumeAll, resetAll };
}
