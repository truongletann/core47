import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { deleteSceneBackground } from "@/lib/focus/service";
import { getFocusSoundsBucket } from "@/lib/storage/r2";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ sceneKey: string }> }) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const { sceneKey } = await params;
  const existing = await deleteSceneBackground(sceneKey);

  if (existing?.source === "r2") {
    const bucket = await getFocusSoundsBucket();
    await bucket.delete(`backgrounds/${existing.urlOrKey}`);
  }

  return NextResponse.json({ success: true });
}
