import { NextResponse } from "next/server";
import { getFocusSettings } from "@/lib/focus/service";

// Public read of the default Pomodoro durations (no secrets in this row) —
// used to seed the timer before the user customizes it in the Pomo modal.
export async function GET() {
  const settings = await getFocusSettings();
  return NextResponse.json({ success: true, data: { settings } });
}
