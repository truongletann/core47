"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import { secureRandomFloat } from "@/lib/random/secureRandom";
import { playTick, playWinFanfare } from "@/lib/audio/tones";

const PALETTE = ["#f2b705", "#22c55e", "#3b82f6", "#a855f7", "#ef4444", "#f97316"];
const MIN_SPINS = 6;
const SPIN_DURATION_MS = 5200;

function normalizeAngle(a: number): number {
  const twoPi = Math.PI * 2;
  return ((a % twoPi) + twoPi) % twoPi;
}

// Cumulative angle boundaries so slices can be sized proportionally to
// weight instead of always equal — boundaries[i]..boundaries[i+1] is slice i.
function computeBoundaries(weights: number[]): number[] {
  const total = weights.reduce((s, w) => s + w, 0) || 1;
  const boundaries: number[] = [0];
  let acc = 0;
  for (const w of weights) {
    acc += (w / total) * Math.PI * 2;
    boundaries.push(acc);
  }
  return boundaries;
}

function pickWeightedIndex(weights: number[]): number {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = secureRandomFloat(0, total, 6);
  for (let i = 0; i < weights.length; i++) {
    if (r < weights[i]) return i;
    r -= weights[i];
  }
  return weights.length - 1;
}

export function SpinWheel({
  items,
  weights,
  onItemsChange,
}: {
  items: string[];
  weights: number[];
  onItemsChange: (items: string[]) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const lastTickBoundaryRef = useRef(0);

  const [spinning, setSpinning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [removeWinner, setRemoveWinner] = useState(true);
  const [winner, setWinner] = useState<{ name: string; index: number } | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const draw = (rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    if (canvas.width !== size * dpr) {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 10;
    const n = Math.max(items.length, 1);
    const boundaries = computeBoundaries(weights.length === items.length ? weights : items.map(() => 1));

    if (items.length === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgb(226 232 240)";
      ctx.fill();
    } else {
      // Wedges
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      items.forEach((_, i) => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, boundaries[i], boundaries[i + 1]);
        ctx.closePath();
        ctx.fillStyle = PALETTE[i % PALETTE.length];
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      ctx.restore();

      // Labels (own rotation per slice so the left half can flip for readability)
      items.forEach((label, i) => {
        const mid = (boundaries[i] + boundaries[i + 1]) / 2;
        const visualMid = normalizeAngle(mid + rotation);
        const flip = visualMid > Math.PI * 0.5 && visualMid < Math.PI * 1.5;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation + mid + (flip ? Math.PI : 0));
        ctx.fillStyle = "#ffffff";
        ctx.font = `600 ${Math.max(11, Math.min(16, 220 / n))}px "Space Grotesk", ui-sans-serif, sans-serif`;
        ctx.textBaseline = "middle";
        const maxWidth = radius - 34;
        let text = label;
        while (ctx.measureText(text).width > maxWidth && text.length > 1) {
          text = text.slice(0, -1);
        }
        if (text !== label) text = text.slice(0, -1) + "…";
        if (flip) {
          ctx.textAlign = "left";
          ctx.fillText(text, -(radius - 14), 0);
        } else {
          ctx.textAlign = "right";
          ctx.fillText(text, radius - 14, 0);
        }
        ctx.restore();
      });
    }

    // Rim
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    // Hub
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.16, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `600 ${radius * 0.09}px "Space Grotesk", ui-sans-serif, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("QUAY", cx, cy);

    // Pointer, fixed at the east edge pointing into the wheel
    ctx.beginPath();
    ctx.moveTo(cx + radius + 4, cy);
    ctx.lineTo(cx + radius + 28, cy - 14);
    ctx.lineTo(cx + radius + 28, cy + 14);
    ctx.closePath();
    ctx.fillStyle = "#0f172a";
    ctx.fill();
  };

  useEffect(() => {
    if (!spinning) draw(rotationRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, weights, spinning]);

  useEffect(() => {
    draw(rotationRef.current);
    function onResize() {
      if (!spinning) draw(rotationRef.current);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function spin() {
    if (spinning || items.length < 2) return;

    const w = weights.length === items.length ? weights : items.map(() => 1);
    const boundaries = computeBoundaries(w);
    const winnerIndex = pickWeightedIndex(w);
    const sliceStart = boundaries[winnerIndex];
    const sliceEnd = boundaries[winnerIndex + 1];
    const jitter = secureRandomFloat((sliceEnd - sliceStart) * 0.15, (sliceEnd - sliceStart) * 0.85, 6);
    const targetNorm = sliceStart + jitter;
    const base = normalizeAngle(-targetNorm);
    const currentNorm = normalizeAngle(rotationRef.current);
    const diff = normalizeAngle(base - currentNorm);
    const start = rotationRef.current;
    const final = start + MIN_SPINS * Math.PI * 2 + diff;

    setSpinning(true);
    setWinner(null);
    lastTickBoundaryRef.current = 0;
    const t0 = performance.now();

    function frame(now: number) {
      const t = Math.min(1, (now - t0) / SPIN_DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + (final - start) * eased;
      rotationRef.current = current;
      draw(current);

      // Tick whenever we cross a slice boundary, evenly spaced regardless of weight.
      const avgSliceAngle = (Math.PI * 2) / Math.max(items.length, 1);
      const currentSlot = Math.floor(current / avgSliceAngle);
      if (currentSlot !== lastTickBoundaryRef.current) {
        lastTickBoundaryRef.current = currentSlot;
        playTick(muted);
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        setSpinning(false);
        playWinFanfare(muted);
        setWinner({ name: items[winnerIndex], index: winnerIndex });
        setHistory((prev) => [items[winnerIndex], ...prev].slice(0, 20));
      }
    }
    animRef.current = requestAnimationFrame(frame);
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  function closeWinnerModal() {
    if (winner && removeWinner) {
      const next = items.filter((_, i) => i !== winner.index);
      onItemsChange(next);
    }
    setWinner(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMuted((v) => !v)}
          aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
          className="flex items-center gap-1.5 rounded-md border border-[rgb(var(--border))] px-2.5 py-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          {muted ? "Đã tắt tiếng" : "Âm thanh"}
        </button>
        {history.length > 0 && (
          <button
            type="button"
            onClick={() => setHistory([])}
            className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            Xoá lịch sử
          </button>
        )}
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-pointer"
          style={{ width: "100%", height: "100%" }}
          onClick={spin}
        />
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning || items.length < 2}
        className="mx-auto flex w-full max-w-[420px] items-center justify-center gap-2 rounded-lg bg-[rgb(var(--accent))] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {spinning ? "Đang quay..." : items.length < 2 ? "Cần ít nhất 2 mục" : "Quay vòng quay"}
      </button>

      {history.length > 0 && (
        <div className="mx-auto flex max-w-[420px] flex-wrap justify-center gap-1.5">
          {history.map((name, i) => (
            <span
              key={i}
              className="font-data rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-2.5 py-1 text-[11px] text-[rgb(var(--muted))]"
            >
              {name}
            </span>
          ))}
        </div>
      )}

      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-sm rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <p className="font-data text-xs text-[rgb(var(--muted))]">Kết quả</p>
              <button
                type="button"
                onClick={closeWinnerModal}
                aria-label="Đóng"
                className="text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
              >
                <X size={16} />
              </button>
            </div>
            <div
              className="flex items-center justify-center rounded-xl px-4 py-5 text-center font-display text-2xl font-bold text-white shadow-inner"
              style={{ backgroundColor: PALETTE[winner.index % PALETTE.length] }}
            >
              {winner.name}
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={removeWinner}
                onChange={(e) => setRemoveWinner(e.target.checked)}
                className="h-4 w-4 accent-[rgb(var(--accent))]"
              />
              Xoá người thắng khỏi vòng quay
            </label>
            <button
              type="button"
              onClick={closeWinnerModal}
              className="mt-4 w-full rounded-lg border border-[rgb(var(--border))] px-4 py-2.5 text-sm font-semibold hover:bg-[rgb(var(--border)/0.5)]"
            >
              Tiếp tục →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
