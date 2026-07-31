"use client";

import { useEffect, useRef } from "react";

export interface Effects {
  rain: boolean;
  snow: boolean;
  fireflies: boolean;
  leaves: boolean;
}

export const NO_EFFECTS: Effects = { rain: false, snow: false, fireflies: false, leaves: false };

interface Drop {
  x: number;
  y: number;
  speed: number;
  size: number;
  drift: number;
  angle: number;
}

function glowDot(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, rgb: string, alpha: number) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, `rgba(${rgb},${alpha})`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// Independent of the Ambience background theme — layers weather/particle
// effects on top of whatever scene is showing. Any combination can be on
// at once (checked once per frame, so toggling doesn't need a remount).
export function EffectsOverlay({ effects }: { effects: Effects }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const effectsRef = useRef(effects);
  effectsRef.current = effects;

  const anyOn = effects.rain || effects.snow || effects.fireflies || effects.leaves;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !anyOn) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    function resize() {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener("resize", resize);

    const rain: Drop[] = Array.from({ length: 160 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 7 + Math.random() * 10,
      size: 0.6 + Math.random() * 1.2,
      drift: 0,
      angle: 0,
    }));
    const snow: Drop[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 0.3 + Math.random() * 0.9,
      size: 1 + Math.random() * 3,
      drift: (Math.random() - 0.5) * 0.8,
      angle: 0,
    }));
    const fireflies: Drop[] = Array.from({ length: 25 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 0,
      size: 1.5 + Math.random() * 2,
      drift: Math.random() * Math.PI * 2,
      angle: 0,
    }));
    const leaves: Drop[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 0.5 + Math.random() * 1,
      size: 4 + Math.random() * 4,
      drift: (Math.random() - 0.5) * 1.2,
      angle: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    function frame() {
      if (!ctx || !canvas) return;
      t += 0.02;
      ctx.clearRect(0, 0, w, h);
      const e = effectsRef.current;

      if (e.rain) {
        for (const p of rain) {
          const alpha = 0.2 + (p.size / 1.8) * 0.35;
          ctx.strokeStyle = `rgba(191,219,254,${alpha})`;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.size * 9);
          ctx.stroke();
          p.y += p.speed;
          p.x -= 0.4;
          if (p.y > h) {
            p.x = Math.random() * w;
            p.y = -10;
          }
        }
      }

      if (e.snow) {
        const gust = 1 + Math.sin(t * 0.08) * 0.6;
        for (const p of snow) {
          const alpha = 0.4 + (p.size / 4) * 0.5;
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          p.y += p.speed;
          p.x += Math.sin(t + p.y * 0.05) * p.drift * gust;
          if (p.y > h) {
            p.x = Math.random() * w;
            p.y = -10;
          }
        }
      }

      if (e.fireflies) {
        for (const p of fireflies) {
          const glow = 0.3 + 0.7 * Math.abs(Math.sin(t * 2 + p.drift));
          glowDot(ctx, p.x + Math.sin(t + p.drift) * 20, p.y + Math.cos(t * 0.7 + p.drift) * 15, p.size * 4, "220,255,150", glow * 0.85);
        }
      }

      if (e.leaves) {
        for (const p of leaves) {
          const alpha = 0.55;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = `rgba(217,119,6,${alpha})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          p.y += p.speed;
          p.x += Math.sin(t + p.y * 0.03) * p.drift;
          p.angle += 0.02;
          if (p.y > h) {
            p.x = Math.random() * w;
            p.y = -10;
          }
        }
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [anyOn]);

  if (!anyOn) return null;
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[1] h-full w-full" />;
}
