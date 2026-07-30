import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listAllSoundTracksAdmin, createSoundTrack } from "@/lib/focus/service";
import { SoundTrackSchema } from "@/lib/focus/schema";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const tracks = await listAllSoundTracksAdmin();
  return NextResponse.json({ success: true, data: { tracks } });
}

// Creates a metadata row for a "bundled" or "external" track (no file
// upload). R2 uploads go through /api/admin/focus/sounds/upload instead.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = SoundTrackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const track = await createSoundTrack(parsed.data);
  return NextResponse.json({ success: true, data: { track } }, { status: 201 });
}
