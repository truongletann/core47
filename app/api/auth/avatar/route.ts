import { NextRequest, NextResponse } from "next/server";
import { getUserBySessionId } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { getAvatarsBucket } from "@/lib/storage/r2";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_FORM" }, { status: 400 });
  }

  const file = formData.get("avatar");
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "NO_FILE" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ success: false, error: "INVALID_TYPE" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, error: "TOO_LARGE" }, { status: 400 });
  }

  const bucket = await getAvatarsBucket();
  const key = `avatars/${user.id}`; // fixed key — a new upload automatically overwrites the old one

  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  return NextResponse.json({ success: true });
}
