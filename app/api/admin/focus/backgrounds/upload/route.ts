import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { getFocusSoundsBucket } from "@/lib/storage/r2";
import { upsertSceneBackground } from "@/lib/focus/service";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES: Record<string, "image" | "video"> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "video/mp4": "video",
  "video/webm": "video",
};

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
  const sceneKey = String(formData.get("sceneKey") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "NO_FILE" }, { status: 400 });
  }
  const mediaType = ALLOWED_TYPES[file.type];
  if (!mediaType) {
    return NextResponse.json({ success: false, error: "INVALID_TYPE" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, error: "TOO_LARGE" }, { status: 400 });
  }
  if (!sceneKey) {
    return NextResponse.json({ success: false, error: "MISSING_FIELDS" }, { status: 400 });
  }

  const ext = file.type.split("/")[1];
  const key = `${sceneKey}-${crypto.randomUUID()}.${ext}`;

  const bucket = await getFocusSoundsBucket();
  await bucket.put(`backgrounds/${key}`, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  const background = await upsertSceneBackground({
    sceneKey,
    mediaType,
    source: "r2",
    urlOrKey: key,
  });

  return NextResponse.json({ success: true, data: { background } }, { status: 201 });
}
