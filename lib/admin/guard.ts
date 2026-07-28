import { NextRequest } from "next/server";
import { getUserBySessionId } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import type { User } from "@/types/auth";

export async function requireAdmin(req: NextRequest): Promise<User | null> {
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);
  if (!user || !user.isAdmin) return null;
  return user;
}
