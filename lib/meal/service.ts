import { eq, and, asc, gte, lte, inArray, like, count } from "drizzle-orm";
import { getDb } from "@/db/client";
import { mealRecipes, mealRecipeIngredients, mealFoods, mealTargets, mealPlanEntries } from "@/db/schema";
import type { RecipeInput, TargetInput, PlanEntryInput, FoodInput } from "./schema";
import { filterRecipesByIngredientQuery } from "./ingredientSearch";
import { deriveCookingMethods, CALORIE_RANGES } from "./recipeFilters";

// One block of a recipe's daily_menu_items JSON — either a section title
// (from the source's occasional themed-menu header, e.g. "THỰC ĐƠN GIÚP
// HOẠT ĐỘNG TRÍ NÃO HIỆU QUẢ") or a menu row. Rows come in two source
// shapes: a simple slot+dish+energy+note row, or a fuller per-dish
// nutrient breakdown (protein/fiber/sodium/saturated fat/added sugar) —
// the nutrient fields are null when the source only had the simple shape.
type DailyMenuBlock =
  | { type: "title"; text: string }
  | {
      type: "row";
      slot: string | null;
      dish: string;
      energy: number | null;
      protein: number | null;
      fiber: number | null;
      sodium: number | null;
      satFat: number | null;
      addedSugar: number | null;
      note: string | null;
      isTotal: boolean;
    };

function toRecipe(r: typeof mealRecipes.$inferSelect) {
  let dailyMenuItems: DailyMenuBlock[] = [];
  if (r.dailyMenuItems) {
    try {
      dailyMenuItems = JSON.parse(r.dailyMenuItems);
    } catch {
      dailyMenuItems = [];
    }
  }
  return {
    ...r,
    goalTags: r.goalTags ? r.goalTags.split(",").filter(Boolean) : [],
    mealCategories: r.mealCategories ? r.mealCategories.split(",").filter(Boolean) : [],
    dailyMenuItems,
  };
}

// ingredient.quantity is always "how much this ingredient line calls for to
// make the WHOLE recipe" (servings portions), not "per serving" — so the
// per-ingredient calo/macro contribution must be divided by servings to
// match caloriesPerServing/proteinG/etc, which ARE already per-serving.
// For the vast majority of recipes servings is 1 so this is a no-op; it
// matters for the ~41 recipes whose real serving count was later corrected
// from a sourced per-serving calorie figure (see 0106 migration) without
// touching their ingredient quantities.
function toIngredient(
  {
    ingredient,
    food,
  }: {
    ingredient: typeof mealRecipeIngredients.$inferSelect;
    food: typeof mealFoods.$inferSelect | null;
  },
  servings: number,
) {
  const perServing = Math.max(1, servings);
  return {
    ...ingredient,
    foodName: food?.name ?? null,
    foodCategory: food?.category ?? null,
    calories: food ? (ingredient.quantity / 100) * food.caloriesPer100g / perServing : null,
    proteinG: food ? (ingredient.quantity / 100) * food.proteinPer100g / perServing : null,
    fatG: food ? (ingredient.quantity / 100) * food.fatPer100g / perServing : null,
    carbG: food ? (ingredient.quantity / 100) * food.carbPer100g / perServing : null,
  };
}

// Attaches ingredient lines (joined with their linked meal_foods nutrition
// entry, if any) to a single recipe.
async function attachIngredients(recipe: ReturnType<typeof toRecipe>) {
  const db = await getDb();
  const rows = await db
    .select({ ingredient: mealRecipeIngredients, food: mealFoods })
    .from(mealRecipeIngredients)
    .leftJoin(mealFoods, eq(mealRecipeIngredients.foodId, mealFoods.id))
    .where(eq(mealRecipeIngredients.recipeId, recipe.id))
    .orderBy(asc(mealRecipeIngredients.sortOrder));

  return { ...recipe, ingredients: rows.map((r) => toIngredient(r, recipe.servings)) };
}

interface RecipeSummary {
  id: string;
  name: string;
  description: string | null;
  servings: number;
  caloriesPerServing: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  goalTags: string[];
  mealCategories: string[];
  updatedAt: string;
  ingredients: {
    name: string;
    foodName: string | null;
    foodCategory: string | null;
    calories: number | null;
  }[];
}

// Lightweight recipe shape (no instructions/tips/rawText/etc, no per-
// ingredient quantity/unit) — enough for cards, search, and filtering, at a
// fraction of the payload of the full recipe. Loads every recipe, so it's
// meant for callers (recipe library, meal planner picker) that need the
// whole pool to search/filter/pick from client-side, not a single detail
// view (use getRecipeById for that).
async function loadAllSummaries(): Promise<RecipeSummary[]> {
  const db = await getDb();
  const [recipeRows, ingredientRows] = await Promise.all([
    db
      .select({
        id: mealRecipes.id,
        name: mealRecipes.name,
        description: mealRecipes.description,
        servings: mealRecipes.servings,
        caloriesPerServing: mealRecipes.caloriesPerServing,
        proteinG: mealRecipes.proteinG,
        fatG: mealRecipes.fatG,
        carbG: mealRecipes.carbG,
        goalTags: mealRecipes.goalTags,
        mealCategories: mealRecipes.mealCategories,
        updatedAt: mealRecipes.updatedAt,
      })
      .from(mealRecipes)
      .orderBy(asc(mealRecipes.name)),
    db
      .select({
        recipeId: mealRecipeIngredients.recipeId,
        name: mealRecipeIngredients.name,
        quantity: mealRecipeIngredients.quantity,
        foodName: mealFoods.name,
        foodCategory: mealFoods.category,
        caloriesPer100g: mealFoods.caloriesPer100g,
      })
      .from(mealRecipeIngredients)
      .leftJoin(mealFoods, eq(mealRecipeIngredients.foodId, mealFoods.id)),
  ]);

  const ingredientRowsByRecipe = new Map<string, typeof ingredientRows>();
  for (const row of ingredientRows) {
    const list = ingredientRowsByRecipe.get(row.recipeId) ?? [];
    list.push(row);
    ingredientRowsByRecipe.set(row.recipeId, list);
  }

  return recipeRows.map((r) => {
    // See toIngredient's comment — ingredient quantity is for the whole
    // recipe (servings portions), so divide back down to match the
    // already-per-serving caloriesPerServing.
    const perServing = Math.max(1, r.servings);
    const ingredients = (ingredientRowsByRecipe.get(r.id) ?? []).map((row) => ({
      name: row.name,
      foodName: row.foodName ?? null,
      foodCategory: row.foodCategory ?? null,
      calories: row.caloriesPer100g != null ? ((row.quantity / 100) * row.caloriesPer100g) / perServing : null,
    }));
    return {
      ...r,
      goalTags: r.goalTags ? r.goalTags.split(",").filter(Boolean) : [],
      mealCategories: r.mealCategories ? r.mealCategories.split(",").filter(Boolean) : [],
      ingredients,
    };
  });
}

// Full pool of lightweight summaries — used by the meal planner's recipe
// picker + auto-suggest, which both need to search/rank across every
// recipe, not just one page of them.
export async function listRecipeSummaries() {
  return loadAllSummaries();
}

function buildIngredientFacets(recipes: RecipeSummary[]) {
  const seen = new Map<string, Set<string>>();
  for (const r of recipes) {
    for (const ing of r.ingredients) {
      if (!ing.foodName || !ing.foodCategory) continue;
      const set = seen.get(ing.foodCategory) ?? new Set<string>();
      set.add(ing.foodName);
      seen.set(ing.foodCategory, set);
    }
  }
  const facets: Record<string, string[]> = {};
  for (const [cat, names] of seen) facets[cat] = [...names].sort((a, b) => a.localeCompare(b, "vi"));
  return facets;
}

export interface ListRecipesPagedOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  ingredients?: string[];
  cookingMethods?: string[];
  goals?: string[];
  calorieRanges?: string[];
  mealTimes?: string[];
  sort?: "name" | "calAsc" | "calDesc" | "proteinDesc";
}

// Paginated + filtered recipe listing for the public recipe library.
// Filtering happens in memory over the lightweight summary set (D1 reads
// are cheap and this is a small dataset to hold in a Worker's memory), but
// only the current page — plus facet option lists built from the full set
// — actually goes over the wire to the browser.
export async function listRecipesPaged(options: ListRecipesPagedOptions = {}) {
  const all = await loadAllSummaries();
  const facets = buildIngredientFacets(all);

  let result = options.search ? filterRecipesByIngredientQuery(all, options.search) : all;

  if (options.ingredients?.length) {
    const set = new Set(options.ingredients);
    result = result.filter((r) => r.ingredients.some((i) => i.foodName && set.has(i.foodName)));
  }
  if (options.cookingMethods?.length) {
    const set = new Set(options.cookingMethods);
    result = result.filter((r) => deriveCookingMethods(r.name).some((m) => set.has(m)));
  }
  if (options.goals?.length) {
    const set = new Set(options.goals);
    result = result.filter((r) => r.goalTags.some((g) => set.has(g)));
  }
  if (options.calorieRanges?.length) {
    const set = new Set(options.calorieRanges);
    result = result.filter((r) =>
      CALORIE_RANGES.some((range) => set.has(range.key) && range.test(r.caloriesPerServing)),
    );
  }
  if (options.mealTimes?.length) {
    const set = new Set(options.mealTimes);
    result = result.filter((r) => r.mealCategories.some((m) => set.has(m)));
  }

  const sorted = [...result];
  // caloriesPerServing === 0 means "unknown", not "lowest possible" — for
  // ascending sort, push unknowns to the end instead of letting them float
  // to the top ahead of genuinely low-calorie dishes. Descending already
  // puts 0 last naturally, so it needs no special handling.
  if (options.sort === "calAsc") {
    sorted.sort((a, b) => (a.caloriesPerServing || Infinity) - (b.caloriesPerServing || Infinity));
  } else if (options.sort === "calDesc") sorted.sort((a, b) => b.caloriesPerServing - a.caloriesPerServing);
  else if (options.sort === "proteinDesc") sorted.sort((a, b) => b.proteinG - a.proteinG);
  else sorted.sort((a, b) => a.name.localeCompare(b.name, "vi"));

  const total = sorted.length;
  const pageSize = Math.min(Math.max(options.pageSize ?? 24, 1), 100);
  const page = Math.max(options.page ?? 1, 1);
  const recipes = sorted.slice((page - 1) * pageSize, page * pageSize);

  return { recipes, total, page, pageSize, facets };
}

export interface ListRecipeAdminSummariesOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

// Minimal paginated listing for the admin recipe table — pure SQL
// LIMIT/OFFSET, no ingredient join at all, since that table only ever
// shows name/servings/calories/updatedAt.
export async function listRecipeAdminSummaries(options: ListRecipeAdminSummariesOptions = {}) {
  const db = await getDb();
  const pageSize = Math.min(Math.max(options.pageSize ?? 30, 1), 200);
  const page = Math.max(options.page ?? 1, 1);
  const where = options.search ? like(mealRecipes.name, `%${options.search}%`) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: mealRecipes.id,
        name: mealRecipes.name,
        servings: mealRecipes.servings,
        caloriesPerServing: mealRecipes.caloriesPerServing,
        updatedAt: mealRecipes.updatedAt,
      })
      .from(mealRecipes)
      .where(where)
      .orderBy(asc(mealRecipes.name))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ total: count() }).from(mealRecipes).where(where),
  ]);

  return { recipes: rows, total, page, pageSize };
}

export async function getRecipeById(id: string) {
  const db = await getDb();
  const row = await db.select().from(mealRecipes).where(eq(mealRecipes.id, id)).get();
  if (!row) return null;
  return attachIngredients(toRecipe(row));
}

export async function listFoods() {
  const db = await getDb();
  return db.select().from(mealFoods).orderBy(asc(mealFoods.name));
}

export async function createFood(input: FoodInput) {
  const db = await getDb();
  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    name: input.name,
    category: input.category,
    caloriesPer100g: input.caloriesPer100g,
    proteinPer100g: input.proteinPer100g,
    fatPer100g: input.fatPer100g,
    carbPer100g: input.carbPer100g,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(mealFoods).values(record);
  return record;
}

export async function updateFood(id: string, input: FoodInput) {
  const db = await getDb();
  await db
    .update(mealFoods)
    .set({
      name: input.name,
      category: input.category,
      caloriesPer100g: input.caloriesPer100g,
      proteinPer100g: input.proteinPer100g,
      fatPer100g: input.fatPer100g,
      carbPer100g: input.carbPer100g,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(mealFoods.id, id));
}

export async function deleteFood(id: string) {
  const db = await getDb();
  await db.update(mealRecipeIngredients).set({ foodId: null }).where(eq(mealRecipeIngredients.foodId, id));
  await db.delete(mealFoods).where(eq(mealFoods.id, id));
}

export async function createRecipe(input: RecipeInput) {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  await db.insert(mealRecipes).values({
    id,
    name: input.name,
    description: input.description,
    instructions: input.instructions,
    servings: input.servings,
    caloriesPerServing: input.caloriesPerServing,
    proteinG: input.proteinG,
    fatG: input.fatG,
    carbG: input.carbG,
    goalTags: input.goalTags.join(","),
    mealCategories: input.mealCategories.join(","),
    servingNotes: input.servingNotes,
    tips: input.tips,
    expertAdvice: input.expertAdvice,
    suggestedCombo: input.suggestedCombo,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(mealRecipeIngredients).values(
    input.ingredients.map((ing, i) => ({
      id: crypto.randomUUID(),
      recipeId: id,
      foodId: ing.foodId,
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      note: ing.note,
      rawText: ing.rawText,
      sortOrder: i,
    })),
  );

  return getRecipeById(id);
}

export async function updateRecipe(id: string, input: RecipeInput) {
  const db = await getDb();
  const existing = await db.select().from(mealRecipes).where(eq(mealRecipes.id, id)).get();
  if (!existing) throw new Error("RECIPE_NOT_FOUND");

  await db
    .update(mealRecipes)
    .set({
      name: input.name,
      description: input.description,
      instructions: input.instructions,
      servings: input.servings,
      caloriesPerServing: input.caloriesPerServing,
      proteinG: input.proteinG,
      fatG: input.fatG,
      carbG: input.carbG,
      goalTags: input.goalTags.join(","),
      mealCategories: input.mealCategories.join(","),
      servingNotes: input.servingNotes,
      tips: input.tips,
      expertAdvice: input.expertAdvice,
      suggestedCombo: input.suggestedCombo,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(mealRecipes.id, id));

  await db.delete(mealRecipeIngredients).where(eq(mealRecipeIngredients.recipeId, id));
  await db.insert(mealRecipeIngredients).values(
    input.ingredients.map((ing, i) => ({
      id: crypto.randomUUID(),
      recipeId: id,
      foodId: ing.foodId,
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      note: ing.note,
      rawText: ing.rawText,
      sortOrder: i,
    })),
  );
}

export async function deleteRecipe(id: string) {
  const db = await getDb();
  await db.delete(mealRecipeIngredients).where(eq(mealRecipeIngredients.recipeId, id));
  await db.delete(mealPlanEntries).where(eq(mealPlanEntries.recipeId, id));
  await db.delete(mealRecipes).where(eq(mealRecipes.id, id));
}

export async function getTarget(userId: string) {
  const db = await getDb();
  const row = await db.select().from(mealTargets).where(eq(mealTargets.userId, userId)).get();
  return row ?? null;
}

export async function upsertTarget(userId: string, input: TargetInput) {
  const db = await getDb();
  const existing = await getTarget(userId);
  const now = new Date().toISOString();

  if (existing) {
    await db
      .update(mealTargets)
      .set({
        goal: input.goal,
        targetCalories: input.targetCalories,
        targetProteinG: input.targetProteinG,
        targetFatG: input.targetFatG,
        targetCarbG: input.targetCarbG,
        updatedAt: now,
      })
      .where(eq(mealTargets.userId, userId));
  } else {
    await db.insert(mealTargets).values({
      userId,
      goal: input.goal,
      targetCalories: input.targetCalories,
      targetProteinG: input.targetProteinG,
      targetFatG: input.targetFatG,
      targetCarbG: input.targetCarbG,
      updatedAt: now,
    });
  }
  return getTarget(userId);
}

async function listPlanEntriesRaw(userId: string, from: string, to: string) {
  const db = await getDb();
  return db
    .select()
    .from(mealPlanEntries)
    .where(and(eq(mealPlanEntries.userId, userId), gte(mealPlanEntries.date, from), lte(mealPlanEntries.date, to)))
    .orderBy(asc(mealPlanEntries.date));
}

export async function listPlanEntries(userId: string, from: string, to: string) {
  const db = await getDb();
  const entries = await listPlanEntriesRaw(userId, from, to);
  if (entries.length === 0) return [];

  const recipeIds = [...new Set(entries.map((e) => e.recipeId))];
  const recipes = await db.select().from(mealRecipes).where(inArray(mealRecipes.id, recipeIds));
  const recipeById = new Map(recipes.map((r) => [r.id, r]));

  return entries.map((e) => {
    const recipe = recipeById.get(e.recipeId);
    const perServing = recipe
      ? {
          caloriesPerServing: recipe.caloriesPerServing,
          proteinG: recipe.proteinG,
          fatG: recipe.fatG,
          carbG: recipe.carbG,
        }
      : { caloriesPerServing: 0, proteinG: 0, fatG: 0, carbG: 0 };
    return {
      ...e,
      recipeName: recipe?.name ?? "(deleted recipe)",
      calories: perServing.caloriesPerServing * e.servings,
      protein: perServing.proteinG * e.servings,
      fat: perServing.fatG * e.servings,
      carb: perServing.carbG * e.servings,
    };
  });
}

export async function createPlanEntry(userId: string, input: PlanEntryInput) {
  const db = await getDb();
  const recipe = await db.select().from(mealRecipes).where(eq(mealRecipes.id, input.recipeId)).get();
  if (!recipe) throw new Error("RECIPE_NOT_FOUND");

  const record = {
    id: crypto.randomUUID(),
    userId,
    date: input.date,
    mealSlot: input.mealSlot,
    recipeId: input.recipeId,
    servings: input.servings,
    createdAt: new Date().toISOString(),
  };
  await db.insert(mealPlanEntries).values(record);
  return record;
}

export async function deletePlanEntry(userId: string, id: string) {
  const db = await getDb();
  await db.delete(mealPlanEntries).where(and(eq(mealPlanEntries.id, id), eq(mealPlanEntries.userId, userId)));
}

export async function getShoppingList(userId: string, from: string, to: string) {
  const db = await getDb();
  const entries = await listPlanEntriesRaw(userId, from, to);
  if (entries.length === 0) return [];

  const recipeIds = [...new Set(entries.map((e) => e.recipeId))];
  const [ingredients, recipes] = await Promise.all([
    db.select().from(mealRecipeIngredients).where(inArray(mealRecipeIngredients.recipeId, recipeIds)),
    db.select({ id: mealRecipes.id, servings: mealRecipes.servings }).from(mealRecipes).where(inArray(mealRecipes.id, recipeIds)),
  ]);
  const servingsByRecipe = new Map(recipes.map((r) => [r.id, r.servings]));

  const byRecipe = new Map<string, typeof ingredients>();
  for (const ing of ingredients) {
    const list = byRecipe.get(ing.recipeId) ?? [];
    list.push(ing);
    byRecipe.set(ing.recipeId, list);
  }

  const totals = new Map<string, { name: string; unit: string; quantity: number }>();
  for (const entry of entries) {
    const recipeIngredients = byRecipe.get(entry.recipeId) ?? [];
    // ing.quantity is for the whole recipe (however many servings it
    // makes) — entry.servings is how many single servings the user wants,
    // so scale by servings/recipeServings rather than servings alone
    // (equal to entry.servings for the common recipeServings === 1 case).
    const recipeServings = Math.max(1, servingsByRecipe.get(entry.recipeId) ?? 1);
    const factor = entry.servings / recipeServings;
    for (const ing of recipeIngredients) {
      const key = `${ing.name.trim().toLowerCase()}|${ing.unit.trim().toLowerCase()}`;
      const existing = totals.get(key);
      const addQty = ing.quantity * factor;
      if (existing) {
        existing.quantity += addQty;
      } else {
        totals.set(key, { name: ing.name, unit: ing.unit, quantity: addQty });
      }
    }
  }

  return [...totals.values()].sort((a, b) => a.name.localeCompare(b.name));
}
