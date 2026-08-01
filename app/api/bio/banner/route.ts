import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { getAvatarsBucket } from "@/lib/storage/r2";
import { setBioBanner } from "@/lib/bio/service";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB — wider cover image, a bit more headroom than the avatar
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_FORM" }, { status: 400 });
  }

  const file = formData.get("banner");
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
  const key = `bio-banner/${user.id}`;
  await bucket.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  await setBioBanner(user.id, key);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const bucket = await getAvatarsBucket();
  await bucket.delete(`bio-banner/${user.id}`);
  await setBioBanner(user.id, null);

  return NextResponse.json({ success: true });
}
