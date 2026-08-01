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

// A short burst of filtered white noise reads as a mechanical-keyboard
// "clack" far better than a pure tone — press is sharper/higher-passed,
// release is a softer, lower thud, mirroring how a real switch sounds.
function clack(ctx: AudioContext, { filterFreq, q, duration, gain }: { filterFreq: number; q: number; duration: number; gain: number }) {
  const sampleCount = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = filterFreq;
  filter.Q.value = q;

  const gainNode = ctx.createGain();
  const t0 = ctx.currentTime;
  gainNode.gain.setValueAtTime(gain, t0);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  noise.connect(filter).connect(gainNode).connect(ctx.destination);
  noise.start(t0);
  noise.stop(t0 + duration + 0.01);
}

export function playKeyClick(muted: boolean, down: boolean) {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;
  clack(
    ctx,
    down
      ? { filterFreq: 2400, q: 0.9, duration: 0.045, gain: 0.5 }
      : { filterFreq: 1400, q: 1.1, duration: 0.035, gain: 0.28 },
  );
}
