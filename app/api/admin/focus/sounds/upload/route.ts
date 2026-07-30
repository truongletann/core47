import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { getFocusSoundsBucket } from "@/lib/storage/r2";
import { createSoundTrack } from "@/lib/focus/service";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_FORM" }, { status: 400 });
  }

  const file = formData.get("file");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "NO_FILE" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ success: false, error: "INVALID_TYPE" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, error: "TOO_LARGE" }, { status: 400 });
  }
  if (!name || !category) {
    return NextResponse.json({ success: false, error: "MISSING_FIELDS" }, { status: 400 });
  }

  const ext = file.type === "audio/wav" ? "wav" : file.type === "audio/ogg" ? "ogg" : "mp3";
  const key = `${crypto.randomUUID()}.${ext}`;

  const bucket = await getFocusSoundsBucket();
  await bucket.put(`sounds/${key}`, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  const track = await createSoundTrack({
    name,
    category,
    source: "r2",
    urlOrKey: key,
    isEnabled: true,
    sortOrder: 0,
  });

  return NextResponse.json({ success: true, data: { track } }, { status: 201 });
}
