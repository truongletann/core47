import { NextResponse } from "next/server";
import { listEnabledThemes } from "@/lib/focus/service";

export async function GET() {
  const themes = await listEnabledThemes();
  return NextResponse.json({ success: true, data: { themes } });
}
