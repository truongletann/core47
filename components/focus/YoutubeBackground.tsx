"use client";

import { useEffect, useRef, useState } from "react";

// Minimal shape of the bits of the YT IFrame Player API this file touches.
interface YTPlayer {
  destroy: () => void;
  mute: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setPlaybackQuality: (quality: string) => void;
  unloadModule?: (module: string) => void;
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
  // YouTube's own chrome (autoplay-muted unmute prompt, the big center
  // play/pause icon, buffering spinner) can't be turned off via playerVars —
  // controls:0 only hides the bottom bar. Keeping the iframe invisible until
  // the first real PLAYING state means the visitor never sees that flash of
  // "this is a YouTube player" and just gets a clean video once it's ready.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setVisible(false);

    loadYoutubeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return;

      // Deliberately NOT using the loop:1 + playlist:videoId trick — YouTube
      // treats that as a (1-item) playlist embed, which brings back the
      // title/channel bar and playlist-style controls even with controls:0.
      // Looping a single video is instead done manually below (seekTo on
      // ENDED), which keeps it a genuine single-video embed.
      const playerVars: Record<string, string | number> = {
        autoplay: 1,
        mute: 1,
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
            // cc_load_policy:0 only sets the *default* — if the viewer's own
            // YouTube/Google account has "always show captions" turned on,
            // that account-level preference wins over our playerVars. This
            // undocumented-but-widely-used call is a best-effort second
            // attempt to force them off; it isn't guaranteed to work for
            // every viewer, since it's ultimately their account setting.
            e.target.unloadModule?.("captions");
            e.target.playVideo();
          },
          onStateChange: (e) => {
            const YT = window.YT;
            if (!YT) return;
            if (e.data === YT.PlayerState.PLAYING) {
              e.target.setPlaybackQuality("highres");
              e.target.unloadModule?.("captions");
              setVisible(true);
              return;
            }
            if (e.data === YT.PlayerState.ENDED) {
              // Manual loop instead of the loop+playlist trick (see above).
              // Hide first — YouTube shows a "related videos" end-card
              // behind the scenes here, and there's a beat before seekTo
              // actually resumes playback.
              setVisible(false);
              e.target.seekTo(startSeconds ?? 0, true);
              e.target.playVideo();
              return;
            }
            // Anything other than PLAYING/ENDED/BUFFERING means YouTube's
            // own chrome is back on screen — the center play icon, or (if
            // playback stalled mid-loop) the related-videos end card. Hide
            // the video and force a resume; skip BUFFERING, which is a
            // transient step on the way to PLAYING and would otherwise
            // cause a visible flicker.
            if (
              e.data === YT.PlayerState.PAUSED ||
              e.data === YT.PlayerState.CUED ||
              e.data === YT.PlayerState.UNSTARTED
            ) {
              setVisible(false);
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
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div ref={containerRef} className="pointer-events-none h-full w-full" />
      </div>
    </div>
  );
}
