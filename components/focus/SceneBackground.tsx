"use client";

import { useEffect, useRef, useState } from "react";
import { YoutubeBackground } from "@/components/focus/YoutubeBackground";

interface SceneOverride {
  sceneKey: string;
  mediaType: "image" | "video";
  source: "r2" | "external" | "youtube";
  urlOrKey: string;
  startSeconds?: number | null;
  endSeconds?: number | null;
}

function overrideSrc(bg: SceneOverride) {
  return bg.source === "r2" ? `/api/focus/backgrounds/${bg.urlOrKey}` : bg.urlOrKey;
}

// Admin-uploaded "live background" media, keyed by scene — set via
// admin.core47.xyz/focus/backgrounds. Falls back to the procedural canvas
// scene below when nothing's been uploaded for a given scene.
function useSceneOverrides() {
  const [overrides, setOverrides] = useState<Record<string, SceneOverride>>({});

  useEffect(() => {
    fetch("/api/focus/backgrounds")
      .then((r) => r.json() as Promise<{ data?: { backgrounds?: SceneOverride[] } }>)
      .then((json) => {
        const map: Record<string, SceneOverride> = {};
        for (const b of json?.data?.backgrounds ?? []) map[b.sceneKey] = b;
        setOverrides(map);
      })
      .catch(() => {});
  }, []);

  return overrides;
}

// Bespoke gradients for the original 9 scene keys — any custom scene an
// admin adds later falls back to DEFAULT_GRADIENT.
const SCENE_GRADIENTS: Record<string, string> = {
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
const DEFAULT_GRADIENT = "linear-gradient(180deg, #1e1b2e, #2d2440)";

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  drift: number;
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

    const count = scene === "rainy-window" || scene === "thunderstorm" ? 120 : scene === "snowfall" ? 80 : 40;
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
        p.speed = 0.4 + Math.random() * 0.8;
        p.size = 1.5 + Math.random() * 2.5;
        p.drift = (Math.random() - 0.5) * 0.6;
      } else if (scene === "forest") {
        p.y = Math.random() * h;
        p.speed = 0;
        p.size = 1 + Math.random() * 2;
        p.drift = Math.random() * Math.PI * 2;
      } else if (scene === "starry-night") {
        p.y = Math.random() * h;
        p.speed = 0;
        p.size = 0.5 + Math.random() * 1.5;
        p.drift = Math.random() * Math.PI * 2;
      } else if (scene === "rainy-window" || scene === "thunderstorm") {
        p.speed = 6 + Math.random() * 8;
        p.size = 1 + Math.random();
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
    function frame() {
      if (!ctx || !canvas) return;
      t += 0.02;
      ctx.clearRect(0, 0, w, h);

      if (scene === "rainy-window" || scene === "thunderstorm") {
        ctx.strokeStyle = "rgba(191,219,254,0.35)";
        ctx.lineWidth = 1;
        for (const p of particles) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.size * 8);
          ctx.stroke();
          p.y += p.speed;
          p.x -= 0.5;
          if (p.y > h) reset(p);
        }
        if (scene === "thunderstorm" && Math.random() < 0.01) {
          ctx.fillStyle = "rgba(255,255,255,0.25)";
          ctx.fillRect(0, 0, w, h);
        }
      } else if (scene === "snowfall") {
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          p.y += p.speed;
          p.x += Math.sin(t + p.y * 0.05) * p.drift;
          if (p.y > h) reset(p);
        }
      } else if (scene === "forest") {
        for (const p of particles) {
          const glow = 0.3 + 0.7 * Math.abs(Math.sin(t * 2 + p.drift));
          ctx.fillStyle = `rgba(190,242,100,${glow * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x + Math.sin(t + p.drift) * 15, p.y + Math.cos(t * 0.7 + p.drift) * 10, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (scene === "starry-night") {
        for (const p of particles) {
          const glow = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + p.drift));
          ctx.fillStyle = `rgba(255,255,255,${glow})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (scene === "campfire") {
        for (let i = 0; i < 30; i++) {
          const fx = w / 2 + Math.sin(t * 3 + i) * 20;
          const fy = h * 0.7 - ((t * 40 + i * 20) % (h * 0.5));
          const alpha = 1 - ((t * 40 + i * 20) % (h * 0.5)) / (h * 0.5);
          ctx.fillStyle = `rgba(251,146,60,${alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(fx, fy, 2 + alpha * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (scene === "coffee-shop") {
        for (let i = 0; i < 3; i++) {
          const sx = w * 0.3 + i * w * 0.2;
          const sy = h * 0.6 - ((t * 15 + i * 40) % (h * 0.4));
          const alpha = 0.25 * (1 - ((t * 15 + i * 40) % (h * 0.4)) / (h * 0.4));
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(sx + Math.sin(t + i) * 6, sy);
          ctx.quadraticCurveTo(sx + 15, sy - 15, sx, sy - 30);
          ctx.stroke();
        }
      } else if (scene === "ocean") {
        ctx.strokeStyle = "rgba(186,230,253,0.4)";
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          for (let x = 0; x <= w; x += 8) {
            const y = h * 0.7 + i * 12 + Math.sin(x * 0.02 + t * 2 + i) * 6;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (scene === "library") {
        ctx.fillStyle = "rgba(253,224,71,0.06)";
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.3, w * 0.4, h * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Generic fallback for admin-added custom scenes with no bespoke
        // animation yet — soft drifting motes.
        for (const p of particles) {
          const glow = 0.2 + 0.5 * Math.abs(Math.sin(t * 1.2 + p.drift));
          ctx.fillStyle = `rgba(255,255,255,${glow * 0.5})`;
          ctx.beginPath();
          ctx.arc(p.x + Math.sin(t + p.drift) * 10, p.y + Math.cos(t * 0.6 + p.drift) * 8, p.size, 0, Math.PI * 2);
          ctx.fill();
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

export function SceneBackground({ scene, active }: { scene: string; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overrides = useSceneOverrides();
  const override = overrides[scene];
  useParticles(canvasRef, scene, active && !override);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden transition-[background] duration-700"
      style={{ background: SCENE_GRADIENTS[scene] ?? DEFAULT_GRADIENT }}
    >
      {override ? (
        override.source === "youtube" ? (
          <YoutubeBackground
            key={override.urlOrKey}
            videoId={override.urlOrKey}
            startSeconds={override.startSeconds}
            endSeconds={override.endSeconds}
          />
        ) : override.mediaType === "video" ? (
          <video
            key={override.urlOrKey}
            src={overrideSrc(override)}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={override.urlOrKey} src={overrideSrc(override)} alt="" className="h-full w-full object-cover" />
        )
      ) : (
        <canvas ref={canvasRef} className="h-full w-full" />
      )}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}
