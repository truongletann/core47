import { NextRequest, NextResponse } from "next/server";
import { updateProfile } from "@/lib/auth/service";
import { requireUser } from "@/lib/auth/guard";
import { UpdateProfileSchema } from "@/lib/auth/schema";

export async function POST(req: NextRequest) {
  const currentUser = await requireUser(req);
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