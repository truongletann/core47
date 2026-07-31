import { NextResponse } from "next/server";
import { listEnabledScenes } from "@/lib/focus/service";

export async function GET() {
  const scenes = await listEnabledScenes();
  return NextResponse.json({ success: true, data: { scenes } });
}
