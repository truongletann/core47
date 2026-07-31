"use client";

import { useEffect, useRef } from "react";

// Shared across every eye on the page — one mousemove listener updates this,
// each eye's own rAF loop just reads it (no per-eye event listeners, no
// React state/re-renders for the actual tracking motion).
const pointer = { x: 0, y: 0, initialized: false };

function usePointerTracking() {
  useEffect(() => {
    if (!pointer.initialized) {
      pointer.x = window.innerWidth / 2;
      pointer.y = window.innerHeight / 3;
      pointer.initialized = true;
    }
    function onMove(e: MouseEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
}

// Replaces the font's dotted-zero glyph with a little ring + pupil that
// tracks the mouse, like a pair of googly eyes — one instance per "0" in
// the countdown, sized in em so it scales with the surrounding digits.
function Eye() {
  const ringRef = useRef<HTMLSpanElement>(null);
  const pupilRef = useRef<HTMLSpanElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  usePointerTracking();

  useEffect(() => {
    let raf = 0;
    function loop() {
      const ring = ringRef.current;
      const pupil = pupilRef.current;
      if (ring && pupil) {
        const rect = ring.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = pointer.x - cx;
        const dy = pointer.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const maxOffset = rect.width * 0.22;
        const pull = Math.min(1, dist / 300);
        const targetX = (dx / dist) * maxOffset * pull;
        const targetY = (dy / dist) * maxOffset * pull;

        const o = offsetRef.current;
        o.x += (targetX - o.x) * 0.18;
        o.y += (targetY - o.y) * 0.18;
        pupil.style.transform = `translate(${o.x}px, ${o.y}px)`;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span
      ref={ringRef}
      className="relative mx-[0.02em] inline-flex shrink-0 items-center justify-center rounded-[45%] border-[0.09em] border-current align-baseline"
      style={{ width: "0.62em", height: "0.92em" }}
    >
      <span ref={pupilRef} className="block rounded-full bg-current" style={{ width: "0.24em", height: "0.24em" }} />
    </span>
  );
}

// Renders a digit string, swapping every "0" for a tracking Eye so it reads
// as a little face peeking out of the countdown instead of a static glyph.
export function EyeDigits({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, i) => (ch === "0" ? <Eye key={i} /> : <span key={i}>{ch}</span>))}
    </>
  );
}
