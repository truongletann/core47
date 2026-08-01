"use client";

import { useEffect, useRef } from "react";

// Minimal shape of the bits of the YT IFrame Player API this file touches.
interface YTPlayer {
  destroy: () => void;
  mute: () => void;
  playVideo: () => void;
  setPlaybackQuality: (quality: string) => void;
}
interface YTPlayerOptions {
  videoId: string;
  playerVars: Record<string, string | number>;
  events: {
    onReady: (e: { target: YTPlayer }) => void;
    onStateChange: (e: { target: YTPlayer; data: number }) => void;
  };
}
interface YTNamespace {
  Player: new (el: HTMLElement, opts: YTPlayerOptions) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; CUED: number; UNSTARTED: number };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<void> | null = null;

function loadYoutubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiLoadPromise;
}

interface YoutubeBackgroundProps {
  videoId: string;
  startSeconds?: number | null;
  endSeconds?: number | null;
}

// Uses the real IFrame Player API (not a static embed URL) so we can ask
// YouTube for the highest available playback quality. This is a request,
// not a guarantee — YouTube's adaptive streaming can still step it down,
// and forcing "highres" means slow connections will buffer instead of the
// player quietly dropping to a lower quality on its own.
export function YoutubeBackground({ videoId, startSeconds, endSeconds }: YoutubeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadYoutubeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return;

      const playerVars: Record<string, string | number> = {
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: videoId,
        controls: 0,
        disablekb: 1,
        fs: 0,
        showinfo: 0,
        modestbranding: 1,
        playsinline: 1,
        iv_load_policy: 3,
        cc_load_policy: 0,
        rel: 0,
      };
      if (startSeconds != null) playerVars.start = startSeconds;
      if (endSeconds != null) playerVars.end = endSeconds;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars,
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.setPlaybackQuality("highres");
            e.target.playVideo();
          },
          onStateChange: (e) => {
            const YT = window.YT;
            if (!YT) return;
            if (e.data === YT.PlayerState.PLAYING) {
              e.target.setPlaybackQuality("highres");
              return;
            }
            // Force playback to actually resume whenever it's not — a
            // muted autoplay that got stuck cued/paused (rather than
            // truly playing) leaves YouTube's own center play icon
            // sitting on screen since controls:0 only hides the bottom
            // bar, not that overlay. Skip BUFFERING, which is transient.
            if (
              e.data === YT.PlayerState.PAUSED ||
              e.data === YT.PlayerState.CUED ||
              e.data === YT.PlayerState.UNSTARTED ||
              e.data === YT.PlayerState.ENDED
            ) {
              e.target.playVideo();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, startSeconds, endSeconds]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2">
        <div ref={containerRef} className="pointer-events-none h-full w-full" />
      </div>
    </div>
  );
}
