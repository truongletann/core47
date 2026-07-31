import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth/service";
import { LoginSchema } from "@/lib/auth/schema";
import { SESSION_COOKIE_NAME, SESSION_DURATION_DAYS } from "@/lib/auth/config";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const allowed = await checkRateLimit(`login:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ success: false, error: "TOO_MANY_ATTEMPTS" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = LoginSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    const { user, sessionId } = await loginUser(parseResult.data);
    const res = NextResponse.json({ success: true, data: { user } }, { status: 200 });
    res.cookies.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: ".core47.xyz",
      maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
      return NextResponse.json({ success: false, error: "INVALID_CREDENTIALS" }, { status: 401 });
    }
    if (err instanceof Error && err.message === "ACCOUNT_DISABLED") {
      return NextResponse.json({ success: false, error: "ACCOUNT_DISABLED" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
