"use client";

import { useCallback, useRef, useState } from "react";

export interface PlayerBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

// Tracks the on-screen box of a mounted/unmounted placeholder <div> via
// getBoundingClientRect, without ever touching the DOM parent of whatever
// is being positioned over it. See PersistentEmbed for why that matters —
// reparenting an iframe (even keeping the same node) makes Chrome reload
// its browsing context, which kills playback.
export function usePlayerSlot() {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState<PlayerBox | null>(null);

  const measure = useCallback(() => {
    const el = elRef.current;
    if (!el) {
      setBox(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setBox({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, []);

  const attach = useCallback(
    (el: HTMLDivElement | null) => {
      elRef.current = el;
      measure();
    },
    [measure],
  );

  return { box, attach, measure };
}
