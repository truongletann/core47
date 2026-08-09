// GZip compress/decompress using the native CompressionStream/DecompressionStream
// Web APIs (supported in Workers + all modern browsers) — no dependency needed.

async function readAll(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64.trim());
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export async function gzipCompress(text: string): Promise<string> {
  const input = new TextEncoder().encode(text);
  const stream = new Blob([input.slice()]).stream().pipeThrough(new CompressionStream("gzip"));
  const compressed = await readAll(stream);
  return bytesToBase64(compressed);
}

export async function gzipDecompress(base64: string): Promise<string> {
  const input = base64ToBytes(base64);
  const stream = new Blob([input.slice()]).stream().pipeThrough(new DecompressionStream("gzip"));
  const decompressed = await readAll(stream);
  return new TextDecoder("utf-8", { fatal: true }).decode(decompressed);
}
