// Cryptographically-strong random helpers (Web Crypto — available in both
// the browser and the Cloudflare Workers runtime, unlike Math.random which
// is fine here too but crypto avoids any "is this fair?" doubt for a tool
// whose whole point is picking winners/numbers).

export function secureRandomInt(min: number, max: number): number {
  // Inclusive [min, max]. Rejection sampling avoids modulo bias.
  const range = max - min + 1;
  if (range <= 0) return min;

  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % range);
  const buf = new Uint32Array(1);

  let value: number;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);

  return min + (value % range);
}

export function secureRandomFloat(min: number, max: number, decimals: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const fraction = buf[0] / (0xffffffff + 1);
  const value = min + fraction * (max - min);
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// Fisher-Yates using the CSPRNG above.
export function secureShuffle<T>(items: T[]): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
