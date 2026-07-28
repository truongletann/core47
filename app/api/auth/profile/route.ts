import { NextRequest, NextResponse } from "next/server";
import { getUserBySessionId, updateProfile } from "@/lib/auth/service";
import { UpdateProfileSchema } from "@/lib/auth/schema";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const currentUser = await getUserBySessionId(sessionId);
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = UpdateProfileSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    const user = await updateProfile(currentUser.id, parseResult.data);
    return NextResponse.json({ success: true, data: { user } });
  } catch (err) {
    if (err instanceof Error && err.message === "USERNAME_TAKEN") {
      return NextResponse.json({ success: false, error: "USERNAME_TAKEN" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}