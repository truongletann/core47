import { NextResponse } from "next/server";
import { listEnabledSoundTracks } from "@/lib/focus/service";

export async function GET() {
  const tracks = await listEnabledSoundTracks();
  return NextResponse.json({ success: true, data: { tracks } });
}
