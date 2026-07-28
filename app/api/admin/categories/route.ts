import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listCategoriesAdmin, createCategory } from "@/lib/admin/service";
import { CategorySchema } from "@/lib/admin/schema";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const list = await listCategoriesAdmin();
  return NextResponse.json({ success: true, data: { categories: list } });
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

  const parseResult = CategorySchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    const category = await createCategory(parseResult.data);
    return NextResponse.json({ success: true, data: { category } }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "ID_TAKEN") {
      return NextResponse.json({ success: false, error: "ID_TAKEN" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
