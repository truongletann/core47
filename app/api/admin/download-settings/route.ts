import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { getDownloaderSettingsSafe, updateDownloaderSettings } from "@/lib/downloader/settingsService";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
  }
  const settings = await getDownloaderSettingsSafe();
  return NextResponse.json({ success: true, data: { settings } });
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  try {
    await updateDownloaderSettings(body as Parameters<typeof updateDownloaderSettings>[0]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }
}
