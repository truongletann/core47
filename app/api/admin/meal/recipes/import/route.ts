import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { createRecipe } from "@/lib/meal/service";
import { RecipeSchema, MEAL_GOALS } from "@/lib/meal/schema";
import { parseCsv, parseIngredientsCell } from "@/lib/meal/csv";

const COLUMNS = [
  "name",
  "description",
  "instructions",
  "servings",
  "caloriesPerServing",
  "proteinG",
  "fatG",
  "carbG",
  "goalTags",
  "ingredients",
] as const;

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const csv = (body as { csv?: unknown })?.csv;
  if (typeof csv !== "string" || csv.trim().length === 0) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  const rows = parseCsv(csv);
  if (rows.length < 2) {
    return NextResponse.json({ success: false, error: "EMPTY_CSV" }, { status: 400 });
  }

  const header = rows[0].map((h) => h.trim());
  const colIndex = (col: string) => header.indexOf(col);
  const missing = COLUMNS.filter((c) => colIndex(c) === -1);
  if (missing.length > 0) {
    return NextResponse.json(
      { success: false, error: "MISSING_COLUMNS", missing },
      { status: 400 },
    );
  }

  let created = 0;
  const errors: { row: number; message: string }[] = [];

  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const get = (col: (typeof COLUMNS)[number]) => cells[colIndex(col)] ?? "";

    try {
      const goalTags = get("goalTags")
        .split(",")
        .map((g) => g.trim())
        .filter((g): g is (typeof MEAL_GOALS)[number] => (MEAL_GOALS as readonly string[]).includes(g));

      const ingredients = parseIngredientsCell(get("ingredients")).map((ing) => ({ ...ing, foodId: null }));

      const parsed = RecipeSchema.safeParse({
        name: get("name"),
        description: get("description") || null,
        instructions: get("instructions"),
        servings: get("servings"),
        caloriesPerServing: get("caloriesPerServing"),
        proteinG: get("proteinG"),
        fatG: get("fatG"),
        carbG: get("carbG"),
        goalTags,
        ingredients,
      });

      if (!parsed.success) {
        errors.push({
          row: r + 1,
          message: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
        });
        continue;
      }

      await createRecipe(parsed.data);
      created++;
    } catch (err) {
      errors.push({ row: r + 1, message: err instanceof Error ? err.message : "Unknown error" });
    }
  }

  return NextResponse.json({ success: true, data: { created, errors } });
}
