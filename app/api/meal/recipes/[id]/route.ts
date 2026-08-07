import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { getRecipeById } from "@/lib/meal/service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await params;
  const recipe = await getRecipeById(id);
  if (!recipe) return NextResponse.json({ success: false, error: "NOT_FOUND" }, { status: 404 });

  return NextResponse.json({ success: true, data: { recipe } });
}
