import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_DURATION_DAYS } from "@/lib/auth/config";

export function setSessionCookie(res: NextResponse, sessionId: string): void {
  res.cookies.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    domain: ".core47.xyz",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    domain: ".core47.xyz",
    path: "/",
    maxAge: 0,
  });
}
