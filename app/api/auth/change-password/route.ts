import { NextRequest, NextResponse } from "next/server";
import { getUserBySessionId, changePassword } from "@/lib/auth/service";
import { ChangePasswordSchema } from "@/lib/auth/schema";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = ChangePasswordSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    await changePassword(user.id, parseResult.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "WRONG_CURRENT_PASSWORD") {
      return NextResponse.json({ success: false, error: "WRONG_CURRENT_PASSWORD" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
