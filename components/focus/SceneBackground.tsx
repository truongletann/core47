"use client";

import { useEffect, useRef } from "react";
import { YoutubeBackground } from "@/components/focus/YoutubeBackground";
import type { Theme } from "@/lib/focus/types";

function themeImageSrc(theme: Theme) {
  return theme.source === "r2" ? `/api/focus/themes/asset/${theme.urlOrKey}` : theme.urlOrKey;
}

// Bespoke gradients for the original 9 canvas scene keys — any custom scene an
// admin adds later falls back to DEFAULT_GRADIENT.
export const SCENE_GRADIENTS: Record<string, string> = {
  "rainy-window": "linear-gradient(180deg, #1e293b, #334155)",
  thunderstorm: "linear-gradient(180deg, #0f172a, #1e293b)",
  forest: "linear-gradient(180deg, #052e16, #14532d)",
  campfire: "linear-gradient(180deg, #1c1410, #451a03)",
  ocean: "linear-gradient(180deg, #082f49, #0c4a6e)",
  snowfall: "linear-gradient(180deg, #1e293b, #475569)",
  "coffee-shop": "linear-gradient(180deg, #2b1a12, #4a2c1a)",
  "starry-night": "linear-gradient(180deg, #020617, #0f172a)",
  library: "linear-gradient(180deg, #1c1917, #292524)",
};
export const DEFAULT_GRADIENT = "linear-gradient(180deg, #1e1b2e, #2d2440)";

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  drift: number;
}

// Draws a soft glowing dot via a radial gradient instead of a flat fill —
// looks like a real point light (firefly/ember/star) rather than a disc.
function glowDot(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, rgb: string, alpha: number) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, `rgba(${rgb},${alpha})`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// Lightweight canvas particle loop shared by rain/snow/fireflies/stars —
// keeps this file small instead of one bespoke renderer per scene.
function useParticles(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  scene: string,
  active: boolean,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
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

    const count =
      scene === "rainy-window" || scene === "thunderstorm"
        ? 140
        : scene === "snowfall"
          ? 90
          : scene === "starry-night"
            ? 90
            : 40;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 0,
      size: 0,
      drift: 0,
    }));

    function reset(p: Particle) {
      p.x = Math.random() * w;
      p.y = -10;
      if (scene === "snowfall") {
        p.speed = 0.3 + Math.random() * 0.9;
        p.size = 1 + Math.random() * 3;
        p.drift = (Math.random() - 0.5) * 0.8;
      } else if (scene === "forest") {
        p.y = Math.random() * h;
        p.speed = 0;
        p.size = 1.5 + Math.random() * 2;
        p.drift = Math.random() * Math.PI * 2;
      } else if (scene === "starry-night") {
        p.y = Math.random() * h * 0.85;
        p.speed = 0;
        p.size = 0.6 + Math.random() * 1.6;
        p.drift = Math.random() * Math.PI * 2;
      } else if (scene === "rainy-window" || scene === "thunderstorm") {
        p.speed = 7 + Math.random() * 10;
        p.size = 0.6 + Math.random() * 1.2;
        p.drift = 0;
      } else {
        // Custom/unknown scenes and the remaining known scenes that draw
        // their own shapes in frame() below (campfire/coffee-shop/ocean/
        // library) don't consume these particles directly except as the
        // generic fallback's drift source.
        p.y = Math.random() * h;
        p.speed = 0;
        p.size = 1 + Math.random() * 1.5;
        p.drift = Math.random() * Math.PI * 2;
      }
    }
    particles.forEach(reset);

    let t = 0;
    let flashAlpha = 0;
    let nextShootingStar = 6 + Math.random() * 8;
    let shootingStar: { x: number; y: number; life: number } | null = null;

    function frame() {
      if (!ctx || !canvas) return;
      t += 0.02;
      ctx.clearRect(0, 0, w, h);

      if (scene === "rainy-window" || scene === "thunderstorm") {
        const windSway = Math.sin(t * 0.3) * 0.8;
        for (const p of particles) {
          const alpha = 0.2 + (p.size / 1.8) * 0.35;
          ctx.strokeStyle = `rgba(191,219,254,${alpha})`;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2 + windSway, p.y + p.size * 9);
          ctx.stroke();
          p.y += p.speed;
          p.x += windSway * 0.15 - 0.4;
          if (p.y > h) reset(p);
        }
        if (scene === "thunderstorm") {
          if (Math.random() < 0.006 && flashAlpha <= 0) flashAlpha = 0.9;
          if (flashAlpha > 0) {
            const grad = ctx.createRadialGradient(w * 0.5, h * 0.15, 0, w * 0.5, h * 0.15, w * 0.9);
            grad.addColorStop(0, `rgba(226,232,255,${flashAlpha})`);
            grad.addColorStop(1, "rgba(226,232,255,0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            flashAlpha -= 0.06;
          }
        }
      } else if (scene === "snowfall") {
        const gust = 1 + Math.sin(t * 0.08) * 0.6;
        for (const p of particles) {
          const alpha = 0.4 + (p.size / 4) * 0.5;
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          p.y += p.speed;
          p.x += Math.sin(t + p.y * 0.05) * p.drift * gust;
          if (p.y > h) reset(p);
        }
      } else if (scene === "forest") {
        // soft god-rays
        for (let i = 0; i < 3; i++) {
          const bx = w * (0.2 + i * 0.3) + Math.sin(t * 0.1 + i) * 20;
          const grad = ctx.createLinearGradient(bx, 0, bx + w * 0.15, h);
          grad.addColorStop(0, "rgba(220,255,180,0.10)");
          grad.addColorStop(1, "rgba(220,255,180,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(bx - w * 0.05, 0);
          ctx.lineTo(bx + w * 0.05, 0);
          ctx.lineTo(bx + w * 0.2, h);
          ctx.lineTo(bx - w * 0.2, h);
          ctx.closePath();
          ctx.fill();
        }
        for (const p of particles) {
          const glow = 0.3 + 0.7 * Math.abs(Math.sin(t * 2 + p.drift));
          glowDot(
            ctx,
            p.x + Math.sin(t + p.drift) * 15,
            p.y + Math.cos(t * 0.7 + p.drift) * 10,
            p.size * 4,
            "190,242,100",
            glow * 0.9,
          );
        }
      } else if (scene === "starry-night") {
        for (const p of particles) {
          const glow = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + p.drift));
          glowDot(ctx, p.x, p.y, p.size * 3, "255,255,255", glow);
        }
        nextShootingStar -= 0.02;
        if (!shootingStar && nextShootingStar <= 0) {
          shootingStar = { x: Math.random() * w * 0.6, y: Math.random() * h * 0.3, life: 1 };
          nextShootingStar = 8 + Math.random() * 10;
        }
        if (shootingStar) {
          const s = shootingStar;
          ctx.strokeStyle = `rgba(255,255,255,${s.life})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - 60 * s.life, s.y - 30 * s.life);
          ctx.stroke();
          s.x += 6;
          s.y += 3;
          s.life -= 0.03;
          if (s.life <= 0) shootingStar = null;
        }
      } else if (scene === "campfire") {
        const pulse = 0.5 + 0.5 * Math.abs(Math.sin(t * 1.3));
        glowDot(ctx, w / 2, h * 0.72, 90 + pulse * 10, "251,146,60", 0.18 + pulse * 0.12);
        for (let i = 0; i < 30; i++) {
          const fx = w / 2 + Math.sin(t * 3 + i) * (10 + i);
          const fy = h * 0.72 - ((t * 45 + i * 20) % (h * 0.55));
          const alpha = 1 - ((t * 45 + i * 20) % (h * 0.55)) / (h * 0.55);
          glowDot(ctx, fx, fy, 3 + alpha * 5, "251,191,36", alpha * 0.8);
        }
      } else if (scene === "coffee-shop") {
        const pulse = 0.15 + 0.05 * Math.sin(t * 0.5);
        ctx.fillStyle = `rgba(251,191,36,${pulse})`;
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 3; i++) {
          const sx = w * 0.3 + i * w * 0.2;
          const cycle = (t * 15 + i * 40) % (h * 0.4);
          const alpha = 0.3 * (1 - cycle / (h * 0.4));
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1.5;
          let sy = h * 0.62 - cycle;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          for (let seg = 0; seg < 3; seg++) {
            const nx = sx + Math.sin(t * 1.5 + i + seg) * 8;
            sy -= 12;
            ctx.quadraticCurveTo(sx + Math.sin(t + i + seg) * 10, sy + 6, nx, sy);
          }
          ctx.stroke();
        }
      } else if (scene === "ocean") {
        for (let i = 0; i < 4; i++) {
          const grad = ctx.createLinearGradient(0, h * 0.65 + i * 12 - 8, 0, h * 0.65 + i * 12 + 8);
          grad.addColorStop(0, "rgba(224,242,254,0.55)");
          grad.addColorStop(1, "rgba(186,230,253,0.15)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 8) {
            const y = h * 0.7 + i * 12 + Math.sin(x * 0.02 + t * 2 + i) * 6;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        // moonlit sparkle on the water
        for (let i = 0; i < 12; i++) {
          const sx = w * 0.5 + Math.sin(i * 3.1 + t * 0.6) * w * 0.25;
          const sy = h * 0.72 + i * 3 + Math.sin(t * 3 + i) * 2;
          const alpha = 0.3 + 0.5 * Math.abs(Math.sin(t * 2 + i));
          glowDot(ctx, sx, sy, 2, "255,255,255", alpha);
        }
      } else if (scene === "library") {
        const grad = ctx.createRadialGradient(w * 0.5, h * 0.25, 0, w * 0.5, h * 0.3, w * 0.4);
        grad.addColorStop(0, "rgba(253,224,71,0.10)");
        grad.addColorStop(1, "rgba(253,224,71,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.3, w * 0.4, h * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        for (const p of particles) {
          const glow = 0.15 + 0.25 * Math.abs(Math.sin(t + p.drift));
          glowDot(
            ctx,
            w * 0.5 + Math.sin(t * 0.3 + p.drift) * w * 0.3,
            h * 0.15 + ((t * 3 + p.drift * 20) % (h * 0.4)),
            2,
            "253,224,71",
            glow,
          );
        }
      } else {
        // Generic fallback for admin-added custom scenes with no bespoke
        // animation yet — soft drifting motes.
        for (const p of particles) {
          const glow = 0.2 + 0.5 * Math.abs(Math.sin(t * 1.2 + p.drift));
          glowDot(
            ctx,
            p.x + Math.sin(t + p.drift) * 10,
            p.y + Math.cos(t * 0.6 + p.drift) * 8,
            p.size * 3,
            "255,255,255",
            glow * 0.6,
          );
        }
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, scene, active]);
}

export function SceneBackground({ theme, active }: { theme: Theme | null; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasKey = !theme || theme.kind === "canvas" ? (theme?.urlOrKey ?? "rainy-window") : null;
  useParticles(canvasRef, canvasKey ?? "rainy-window", active && canvasKey !== null);

  return (
    <div
      data-scene-bg
      className="fixed inset-0 -z-10 overflow-hidden transition-[background] duration-700"
      style={{ background: SCENE_GRADIENTS[canvasKey ?? "rainy-window"] ?? DEFAULT_GRADIENT }}
    >
      {theme?.kind === "youtube" ? (
        <YoutubeBackground
          key={theme.urlOrKey}
          videoId={theme.urlOrKey}
          startSeconds={theme.startSeconds}
          endSeconds={theme.endSeconds}
        />
      ) : theme?.kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={theme.urlOrKey} src={themeImageSrc(theme)} alt="" className="h-full w-full object-cover" />
      ) : (
        <canvas ref={canvasRef} className="h-full w-full" />
      )}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}
