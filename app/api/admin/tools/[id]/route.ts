import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { updateTool, deleteTool } from "@/lib/admin/service";
import { ToolSchema } from "@/lib/admin/schema";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const { id } = await params;
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
    await updateTool(id, parseResult.data);
    return NextResponse.json({ success: true });
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const { id } = await params;
  await deleteTool(id);
  return NextResponse.json({ success: true });
}
