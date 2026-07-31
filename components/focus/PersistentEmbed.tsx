"use client";

import type { PlayerBox } from "@/lib/focus/usePlayerSlot";

// Renders one iframe at a fixed DOM position that never changes — the box
// itself moves via inline style (position/size) to sit exactly over a
// panel's placeholder slot when mounted, or off-screen when not. The
// iframe's parent element is never touched, so playback survives the
// panel opening/closing/switching tabs.
export function PersistentEmbed({
  box,
  embedId,
  embedUrl,
}: {
  box: PlayerBox | null;
  embedId: string | null;
  embedUrl: string | null;
}) {
  return (
    <div
      aria-hidden={!box}
      className="fixed z-40 overflow-hidden rounded-lg"
      style={
        box
          ? { top: box.top, left: box.left, width: box.width, height: box.height }
          : { top: 0, left: -9999, width: 1, height: 1, opacity: 0, pointerEvents: "none" }
      }
    >
      {embedUrl && (
        <iframe
          key={embedId}
          src={embedUrl}
          width="100%"
          height="100%"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      )}
    </div>
  );
}
