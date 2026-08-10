import { NextRequest } from "next/server";
import { getUserBySessionId } from "@/lib/auth/service";
import type { User } from "@/types/auth";

const BEARER_PREFIX = "Bearer ";

function bearerSessionId(req: NextRequest): string | undefined {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith(BEARER_PREFIX)) return undefined;
  return header.slice(BEARER_PREFIX.length).trim() || undefined;
}

// Mobile counterpart to lib/auth/guard.ts's requireUser() — same session
// table, same expiry/disabled checks (getUserBySessionId), just read from
// `Authorization: Bearer <sessionId>` instead of the web cookie, since a
// native app doesn't carry the httpOnly cookie.
export async function requireUserBearer(req: NextRequest): Promise<User | null> {
  return getUserBySessionId(bearerSessionId(req));
}

export function getBearerSessionId(req: NextRequest): string | undefined {
  return bearerSessionId(req);
}
