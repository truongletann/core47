import { NextResponse } from "next/server";
import { listSceneBackgrounds } from "@/lib/focus/service";

export async function GET() {
  const backgrounds = await listSceneBackgrounds();
  return NextResponse.json({ success: true, data: { backgrounds } });
}
