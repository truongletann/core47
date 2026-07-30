import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listAllSoundTracksAdmin, updateSoundTrack, deleteSoundTrack } from "@/lib/focus/service";
import { getFocusSoundsBucket } from "@/lib/storage/r2";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  await updateSoundTrack(id, body as Record<string, unknown>);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const { id } = await params;
  const tracks = await listAllSoundTracksAdmin();
  const track = tracks.find((t) => t.id === id);

  if (track?.source === "r2") {
    const bucket = await getFocusSoundsBucket();
    await bucket.delete(`sounds/${track.urlOrKey}`);
  }

  await deleteSoundTrack(id);
  return NextResponse.json({ success: true });
}
