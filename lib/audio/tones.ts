// Small synthesized sound effects via the Web Audio API — no audio assets
// needed (keeps the Worker bundle light, see CONVENTIONS.md size limit),
// works everywhere a user gesture (click/keypress) already triggered them.

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedCtx) sharedCtx = new Ctor();
  if (sharedCtx.state === "suspended") sharedCtx.resume().catch(() => {});
  return sharedCtx;
}

function beep(
  ctx: AudioContext,
  { freq, duration, type = "sine", gain = 0.15, delay = 0 }: { freq: number; duration: number; type?: OscillatorType; gain?: number; delay?: number },
) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + delay;
  gainNode.gain.setValueAtTime(gain, t0);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gainNode).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function playTick(muted: boolean) {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;
  beep(ctx, { freq: 900, duration: 0.03, type: "square", gain: 0.08 });
}

export function playWinFanfare(muted: boolean) {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
    beep(ctx, { freq, duration: 0.22, type: "triangle", gain: 0.12, delay: i * 0.09 }),
  );
}

export function playKeyClick(muted: boolean, down: boolean) {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;
  beep(ctx, { freq: down ? 260 : 190, duration: 0.045, type: "square", gain: 0.06 });
}
