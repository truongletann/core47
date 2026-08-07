import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listRecipes, createRecipe } from "@/lib/meal/service";
import { RecipeSchema } from "@/lib/meal/schema";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const recipes = await listRecipes();
  return NextResponse.json({ success: true, data: { recipes } });
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

  const parseResult = RecipeSchema.safeParse(body);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return NextResponse.json({ success: false, error: "INVALID_INPUT", issues }, { status: 400 });
  }

  const recipe = await createRecipe(parseResult.data);
  return NextResponse.json({ success: true, data: { recipe } }, { status: 201 });
}
