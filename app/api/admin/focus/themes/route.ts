import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listAllThemesAdmin, createTheme } from "@/lib/focus/service";
import { ThemeSchema } from "@/lib/focus/schema";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const themes = await listAllThemesAdmin();
  return NextResponse.json({ success: true, data: { themes } });
}

// Creates an "image" (external URL) or "youtube" theme. Image uploads go
// through /api/admin/focus/themes/upload instead.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = ThemeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const theme = await createTheme(parsed.data);
    return NextResponse.json({ success: true, data: { theme } }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_YOUTUBE_URL") {
      return NextResponse.json({ success: false, error: "INVALID_YOUTUBE_URL" }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: "SERVER_ERROR", message }, { status: 500 });
  }
}
