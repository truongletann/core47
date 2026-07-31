"use client";

import { X } from "lucide-react";
import type { Playlist } from "@/lib/focus/types";

// Rendered unconditionally in page.tsx (not inside the Music modal) so the
// Spotify iframe never unmounts when the modal closes — that unmount was
// what killed playback before. Only the "X" button (an explicit user
// action) stops it; toggling the Ambience/Todo/Pomo modals or Focus mode
// no longer touches this.
export function NowPlayingWidget({
  playlist,
  visible,
  onClose,
}: {
  playlist: Playlist | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!playlist) return null;

  return (
    <div
      className={`fixed bottom-20 right-4 z-10 w-64 overflow-hidden rounded-xl bg-black/60 shadow-xl backdrop-blur-md transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-1.5">
        <p className="truncate text-xs text-white/70">{playlist.name}</p>
        <button onClick={onClose} className="shrink-0 text-white/50 hover:text-white" aria-label="Dừng nhạc">
          <X size={14} />
        </button>
      </div>
      <iframe
        key={playlist.id}
        src={playlist.spotifyEmbedUrl}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
