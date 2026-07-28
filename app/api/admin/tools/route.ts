import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listToolsAdmin, createTool } from "@/lib/admin/service";
import { ToolSchema } from "@/lib/admin/schema";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const list = await listToolsAdmin();
  return NextResponse.json({ success: true, data: { tools: list } });
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

  const parseResult = ToolSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    const tool = await createTool(parseResult.data);
    return NextResponse.json({ success: true, data: { tool } }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "SLUG_TAKEN") {
      return NextResponse.json({ success: false, error: "SLUG_TAKEN" }, { status: 409 });
    }
    if (err instanceof Error && err.message === "SUBDOMAIN_TAKEN") {
      return NextResponse.json({ success: false, error: "SUBDOMAIN_TAKEN" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
