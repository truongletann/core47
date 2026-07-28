import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { updateCategory, deleteCategory } from "@/lib/admin/service";
import { UpdateCategorySchema } from "@/lib/admin/schema";

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

  const parseResult = UpdateCategorySchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  await updateCategory(id, parseResult.data);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const { id } = await params;
  try {
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "CATEGORY_IN_USE") {
      return NextResponse.json({ success: false, error: "CATEGORY_IN_USE" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
