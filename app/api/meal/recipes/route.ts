import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { listRecipesPaged, listRecipeSummaries } from "@/lib/meal/service";

function csvParam(sp: URLSearchParams, key: string): string[] | undefined {
  const raw = sp.get(key);
  if (!raw) return undefined;
  return raw.split(",").filter(Boolean);
}

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const sp = req.nextUrl.searchParams;

  // The meal planner's recipe picker + auto-suggest need the full pool
  // (lightweight fields only) to search/rank across every recipe — not one
  // page of it.
  if (sp.get("all") === "1") {
    const recipes = await listRecipeSummaries();
    return NextResponse.json({ success: true, data: { recipes } });
  }

  const sortParam = sp.get("sort");
  const sort =
    sortParam === "calAsc" || sortParam === "calDesc" || sortParam === "proteinDesc" ? sortParam : "name";

  const result = await listRecipesPaged({
    page: sp.has("page") ? Number(sp.get("page")) : undefined,
    pageSize: sp.has("pageSize") ? Number(sp.get("pageSize")) : undefined,
    search: sp.get("q") ?? undefined,
    ingredients: csvParam(sp, "ingredients"),
    cookingMethods: csvParam(sp, "cooking"),
    goals: csvParam(sp, "goals"),
    calorieRanges: csvParam(sp, "calorie"),
    mealTimes: csvParam(sp, "mealTimes"),
    sort,
  });

  return NextResponse.json({ success: true, data: result });
}
