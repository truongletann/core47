import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { clearSessionCookie } from "@/lib/auth/cookies";
import { corsHeaders } from "@/lib/cors";

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (sessionId) {
    await deleteSession(sessionId);
  }
  const res = NextResponse.json({ success: true }, { headers: corsHeaders(origin) });
  clearSessionCookie(res);
  return res;
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}