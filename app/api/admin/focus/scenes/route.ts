import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listAllScenesAdmin, createScene } from "@/lib/focus/service";
import { SceneSchema } from "@/lib/focus/schema";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const scenes = await listAllScenesAdmin();
  return NextResponse.json({ success: true, data: { scenes } });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = SceneSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const scene = await createScene(parsed.data);
    return NextResponse.json({ success: true, data: { scene } }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("UNIQUE")) {
      return NextResponse.json({ success: false, error: "KEY_TAKEN" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "SERVER_ERROR", message }, { status: 500 });
  }
}
