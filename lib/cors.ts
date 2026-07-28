const ROOT_DOMAIN = "core47.xyz";

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  try {
    const hostname = new URL(origin).hostname;
    return hostname === ROOT_DOMAIN || hostname.endsWith(`.${ROOT_DOMAIN}`);
  } catch {
    return false;
  }
}

export function corsHeaders(origin: string | null): HeadersInit {
  if (!isAllowedOrigin(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin as string,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}