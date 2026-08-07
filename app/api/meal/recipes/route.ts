import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { listRecipes } from "@/lib/meal/service";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const recipes = await listRecipes();
  return NextResponse.json({ success: true, data: { recipes } });
}
