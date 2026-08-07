import { eq, and, asc, gte, lte, inArray } from "drizzle-orm";
import { getDb } from "@/db/client";
import { mealRecipes, mealRecipeIngredients, mealTargets, mealPlanEntries } from "@/db/schema";
import type { RecipeInput, TargetInput, PlanEntryInput } from "./schema";

function toRecipe(r: typeof mealRecipes.$inferSelect) {
  return { ...r, goalTags: r.goalTags ? r.goalTags.split(",").filter(Boolean) : [] };
}

async function attachIngredients(recipe: ReturnType<typeof toRecipe>) {
  const db = await getDb();
  const ingredients = await db
    .select()
    .from(mealRecipeIngredients)
    .where(eq(mealRecipeIngredients.recipeId, recipe.id))
    .orderBy(asc(mealRecipeIngredients.sortOrder));
  return { ...recipe, ingredients };
}

export async function listRecipes() {
  const db = await getDb();
  const rows = await db.select().from(mealRecipes).orderBy(asc(mealRecipes.name));
  const recipes = rows.map(toRecipe);
  return Promise.all(recipes.map(attachIngredients));
}

export async function getRecipeById(id: string) {
  const db = await getDb();
  const row = await db.select().from(mealRecipes).where(eq(mealRecipes.id, id)).get();
  if (!row) return null;
  return attachIngredients(toRecipe(row));
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
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(mealRecipeIngredients).values(
    input.ingredients.map((ing, i) => ({
      id: crypto.randomUUID(),
      recipeId: id,
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
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
      updatedAt: new Date().toISOString(),
    })
    .where(eq(mealRecipes.id, id));

  await db.delete(mealRecipeIngredients).where(eq(mealRecipeIngredients.recipeId, id));
  await db.insert(mealRecipeIngredients).values(
    input.ingredients.map((ing, i) => ({
      id: crypto.randomUUID(),
      recipeId: id,
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
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
  const ingredients = await db
    .select()
    .from(mealRecipeIngredients)
    .where(inArray(mealRecipeIngredients.recipeId, recipeIds));

  const byRecipe = new Map<string, typeof ingredients>();
  for (const ing of ingredients) {
    const list = byRecipe.get(ing.recipeId) ?? [];
    list.push(ing);
    byRecipe.set(ing.recipeId, list);
  }

  const totals = new Map<string, { name: string; unit: string; quantity: number }>();
  for (const entry of entries) {
    const recipeIngredients = byRecipe.get(entry.recipeId) ?? [];
    for (const ing of recipeIngredients) {
      const key = `${ing.name.trim().toLowerCase()}|${ing.unit.trim().toLowerCase()}`;
      const existing = totals.get(key);
      const addQty = ing.quantity * entry.servings;
      if (existing) {
        existing.quantity += addQty;
      } else {
        totals.set(key, { name: ing.name, unit: ing.unit, quantity: addQty });
      }
    }
  }

  return [...totals.values()].sort((a, b) => a.name.localeCompare(b.name));
}
