import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { getAvatarsBucket } from "@/lib/storage/r2";
import { setBioLinkThumbnail } from "@/lib/bio/service";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }
  const { id } = await params;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_FORM" }, { status: 400 });
  }

  const file = formData.get("thumbnail");
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "NO_FILE" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ success: false, error: "INVALID_TYPE" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, error: "TOO_LARGE" }, { status: 400 });
  }

  try {
    const key = `bio-link-thumb/${id}`;
    const bucket = await getAvatarsBucket();
    await bucket.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    await setBioLinkThumbnail(user.id, id, key);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "ERROR";
    return NextResponse.json({ success: false, error: message }, { status: message === "NOT_FOUND" ? 404 : 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const bucket = await getAvatarsBucket();
    await bucket.delete(`bio-link-thumb/${id}`);
    await setBioLinkThumbnail(user.id, id, null);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "ERROR";
    return NextResponse.json({ success: false, error: message }, { status: message === "NOT_FOUND" ? 404 : 400 });
  }
}
