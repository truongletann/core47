import { NextResponse } from "next/server";
import { listEnabledPlaylists } from "@/lib/focus/service";

export async function GET() {
  const playlists = await listEnabledPlaylists();
  return NextResponse.json({ success: true, data: { playlists } });
}
