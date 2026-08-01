import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth/service";
import { RegisterSchema } from "@/lib/auth/schema";
import { setSessionCookie } from "@/lib/auth/cookies";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const allowed = await checkRateLimit(`register:${clientIp(req)}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ success: false, error: "TOO_MANY_ATTEMPTS" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = RegisterSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", issues: parseResult.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { user, sessionId } = await registerUser(parseResult.data);
    const res = NextResponse.json({ success: true, data: { user } }, { status: 201 });
    setSessionCookie(res, sessionId);
    return res;
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return NextResponse.json({ success: false, error: "EMAIL_TAKEN" }, { status: 409 });
    }
    if (err instanceof Error && err.message === "USERNAME_TAKEN") {
      return NextResponse.json({ success: false, error: "USERNAME_TAKEN" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
