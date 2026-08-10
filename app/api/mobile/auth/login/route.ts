import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { loginUser } from "@/lib/auth/service";
import { LoginSchema } from "@/lib/auth/schema";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

const MobileLoginSchema = LoginSchema.extend({
  platform: z.enum(["ios", "android"]).optional(),
  deviceName: z.string().max(120).optional(),
});

// Mobile counterpart to /api/auth/login: same credential check
// (loginUser()), but the session id is returned in the JSON body instead
// of only a cookie, since a native app stores it itself (expo-secure-store)
// and sends it back as `Authorization: Bearer <sessionId>`. No CORS
// handling needed here (unlike the web routes) — native fetch isn't
// subject to browser CORS.
export async function POST(req: NextRequest) {
  const allowed = await checkRateLimit(`mobile-login:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ success: false, error: "TOO_MANY_ATTEMPTS" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = MobileLoginSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  const { platform, deviceName, ...credentials } = parseResult.data;

  try {
    const { user, sessionId } = await loginUser(credentials, { platform, deviceName });
    return NextResponse.json({ success: true, data: { user, sessionId } }, { status: 200 });
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
