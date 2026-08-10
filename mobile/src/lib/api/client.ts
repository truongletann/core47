import Constants from 'expo-constants';

// core47's existing backend — same API the web app calls, just with a
// bearer token instead of a cookie (see IMPLEMENTATION_PLAN.md §4). No
// separate mobile backend, no separate database.
//
// Override for local development via app.json -> expo.extra.apiBaseUrl,
// e.g. "http://192.168.1.20:3000" (a phone/simulator can't reach
// "localhost" meaning itself) — defaults to production.
const API_BASE_URL: string =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? 'https://core47.xyz';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; sessionId?: string | null } = {},
): Promise<T> {
  const { method = 'GET', body, sessionId } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (sessionId) headers.Authorization = `Bearer ${sessionId}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let json: ApiEnvelope<T>;
  try {
    json = await res.json();
  } catch {
    throw new ApiError(res.status, 'INVALID_RESPONSE');
  }

  if (!res.ok || !json.success) {
    throw new ApiError(res.status, json.error ?? 'UNKNOWN_ERROR');
  }
  return json.data as T;
}
