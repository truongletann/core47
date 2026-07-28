import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (sessionId) {
    await deleteSession(sessionId);
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    domain: ".core47.xyz",
    path: "/",
    maxAge: 0,
  });
  return res;
}