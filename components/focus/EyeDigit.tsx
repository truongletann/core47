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

const EYE_SIZE = "0.6em";

// A single round eye — soft white sclera + a violet pupil (matching the
// app's accent color, not a stark cartoon black) that tracks the mouse,
// plus an occasional slow blink. Sized in em so it scales with the
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
        const maxOffset = rect.width * 0.18;
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
      style={{ width: EYE_SIZE, height: EYE_SIZE, marginInline: "0.04em" }}
    >
      <span
        className="eye-blink absolute inset-0 rounded-full bg-white/90"
        style={{ animationDelay: `${delay}s`, boxShadow: "0 0.02em 0.04em rgba(0,0,0,0.25)" }}
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span ref={pupilRef} className="relative rounded-full" style={{ width: "52%", height: "52%" }}>
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle at 32% 26%, #a78bfa, #6d28d9 75%)" }}
          />
          <span className="absolute rounded-full bg-white" style={{ width: "24%", height: "24%", top: "14%", left: "18%", opacity: 0.85 }} />
        </span>
      </span>
    </span>
  );
}

// Two adjacent zeros ("00", the common case in mm:ss) blink in sync so they
// read as a pair rather than two unrelated dots — no separate mouth shape,
// that read as a disconnected blob rather than part of the digit.
function FacePair() {
  const blinkDelay = useMemo(() => Math.random() * 3, []);
  return (
    <span className="inline-flex shrink-0 align-baseline">
      <Eye blinkDelay={blinkDelay} />
      <Eye blinkDelay={blinkDelay} />
    </span>
  );
}

// Renders a digit string: a run of two "0"s becomes a FacePair (eyes that
// blink together), a lone "0" becomes a single tracking Eye, everything
// else is plain text.
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
