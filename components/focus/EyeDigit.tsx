"use client";

import { useEffect, useMemo, useRef } from "react";

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

const EYE_SIZE = "0.74em";

// A single round googly eye — white sclera + a big dark pupil that tracks
// the mouse, plus an occasional blink. Sized in em so it scales with the
// surrounding digits. blinkDelay lets a pair of eyes blink in sync.
function Eye({ blinkDelay }: { blinkDelay?: number }) {
  const ringRef = useRef<HTMLSpanElement>(null);
  const pupilRef = useRef<HTMLSpanElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const ownBlinkDelay = useMemo(() => Math.random() * 3, []);
  const delay = blinkDelay ?? ownBlinkDelay;

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
        const pull = Math.min(1, dist / 260);
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
      className="relative inline-block shrink-0 align-baseline"
      style={{ width: EYE_SIZE, height: EYE_SIZE }}
    >
      <span
        className="eye-blink absolute inset-0 rounded-full bg-white"
        style={{ animationDelay: `${delay}s`, boxShadow: "0 0.02em 0.05em rgba(0,0,0,0.35)" }}
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span ref={pupilRef} className="relative rounded-full" style={{ width: "58%", height: "58%" }}>
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle at 32% 26%, #4a4380, #16132a 70%)" }}
          />
          <span className="absolute rounded-full bg-white" style={{ width: "26%", height: "26%", top: "14%", left: "18%", opacity: 0.9 }} />
        </span>
      </span>
    </span>
  );
}

// Two adjacent zeros ("00") read as a little face — a pair of eyes sharing
// one small mouth underneath, instead of two lone eyes with nothing to tie
// them together.
function FacePair() {
  const blinkDelay = useMemo(() => Math.random() * 3, []);
  return (
    <span className="relative mx-[0.05em] inline-block shrink-0 align-baseline" style={{ width: "1.5em", height: EYE_SIZE }}>
      <span className="absolute left-0 top-0 flex">
        <Eye blinkDelay={blinkDelay} />
        <Eye blinkDelay={blinkDelay} />
      </span>
      <span
        className="absolute rounded-full bg-current"
        style={{ width: "0.2em", height: "0.1em", bottom: "-0.14em", left: "50%", transform: "translateX(-50%)" }}
      />
    </span>
  );
}

// Renders a digit string: a run of two "0"s becomes a FacePair (eyes +
// shared mouth), a lone "0" becomes a single tracking Eye, everything else
// is plain text.
export function EyeDigits({ text }: { text: string }) {
  const chars = [...text];
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === "0" && chars[i + 1] === "0") {
      nodes.push(<FacePair key={i} />);
      i++;
    } else if (chars[i] === "0") {
      nodes.push(<Eye key={i} />);
    } else {
      nodes.push(<span key={i}>{chars[i]}</span>);
    }
  }
  return <>{nodes}</>;
}
