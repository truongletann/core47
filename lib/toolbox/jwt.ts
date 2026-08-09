// JWT decode/verify — pure client-side, uses Web Crypto for HMAC verification only.

export interface DecodedJwt {
  header: unknown;
  payload: unknown;
  signatureB64: string;
  signingInput: string;
}

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("A JWT must have 3 dot-separated parts (header.payload.signature).");

  const [headerB64, payloadB64, signatureB64] = parts;
  let header: unknown;
  let payload: unknown;
  try {
    header = JSON.parse(base64UrlDecode(headerB64));
  } catch {
    throw new Error("Could not decode/parse the header segment.");
  }
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64));
  } catch {
    throw new Error("Could not decode/parse the payload segment.");
  }

  return { header, payload, signatureB64, signingInput: `${headerB64}.${payloadB64}` };
}

const HMAC_ALGOS: Record<string, string> = { HS256: "SHA-256", HS384: "SHA-384", HS512: "SHA-512" };

export async function verifyHmacSignature(
  alg: string,
  signingInput: string,
  signatureB64: string,
  secret: string,
): Promise<boolean> {
  const hash = HMAC_ALGOS[alg];
  if (!hash) throw new Error(`Unsupported algorithm for verification: ${alg}. Only HS256/HS384/HS512 are supported.`);

  let expected: Uint8Array;
  try {
    expected = base64UrlToBytes(signatureB64);
  } catch {
    throw new Error("Could not decode the signature segment — this doesn't look like a valid JWT.");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signingInput));
  const actual = new Uint8Array(signature);
  if (expected.length !== actual.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ actual[i];
  return diff === 0;
}
