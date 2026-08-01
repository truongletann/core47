import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import type { User } from "@/types/auth";

export async function requireAdmin(req: NextRequest): Promise<User | null> {
  const user = await requireUser(req);
  if (!user || !user.isAdmin) return null;
  return user;
}
