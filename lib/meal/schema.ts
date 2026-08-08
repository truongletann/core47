import { z } from "zod";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);
const nullableString = (max: number) =>
  z.string().trim().max(max).nullable().optional().transform(emptyToNull);

export const MEAL_GOALS = ["lose_weight", "maintain", "gain_weight", "gain_muscle"] as const;
export const MEAL_SLOTS = ["breakfast", "lunch", "dinner", "snack"] as const;
// Superset of MEAL_SLOTS — a recipe's suggested meal-time(s), which also
// includes "dessert" (not a plan slot on its own, just a dish tag).
export const MEAL_TIME_CATEGORIES = ["breakfast", "lunch", "dinner", "snack", "dessert"] as const;

export const RecipeIngredientSchema = z.object({
  name: z.string().trim().min(1).max(200),
  quantity: z.coerce.number().positive(),
  unit: z.string().trim().max(60).nullable().optional().transform((v) => v ?? ""),
  // Links this line to a meal_foods nutrition entry. When set, quantity is
  // interpreted in grams and the ingredient's own calo/macro contribution
  // can be computed — powers per-ingredient breakdown + ingredient search.
  foodId: z.string().trim().min(1).nullable().optional().transform((v) => v ?? null),
  note: nullableString(300),
  rawText: nullableString(500),
});

export const FOOD_CATEGORIES = ["thit", "hai_san", "rau_cu_qua", "tinh_bot", "khac"] as const;

export const FoodSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.enum(FOOD_CATEGORIES),
  caloriesPer100g: z.coerce.number().nonnegative(),
  proteinPer100g: z.coerce.number().nonnegative(),
  fatPer100g: z.coerce.number().nonnegative(),
  carbPer100g: z.coerce.number().nonnegative(),
});

export const RecipeSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: nullableString(1000),
  instructions: z.string().trim().min(1).max(8000),
  servings: z.coerce.number().int().positive(),
  caloriesPerServing: z.coerce.number().nonnegative(),
  proteinG: z.coerce.number().nonnegative(),
  fatG: z.coerce.number().nonnegative(),
  carbG: z.coerce.number().nonnegative(),
  goalTags: z.array(z.enum(MEAL_GOALS)).default([]),
  mealCategories: z.array(z.enum(MEAL_TIME_CATEGORIES)).default([]),
  servingNotes: nullableString(4000),
  tips: nullableString(4000),
  expertAdvice: nullableString(4000),
  suggestedCombo: nullableString(1000),
  ingredients: z.array(RecipeIngredientSchema).min(1).max(80),
});

export const TargetSchema = z.object({
  goal: z.enum(MEAL_GOALS),
  targetCalories: z.coerce.number().positive(),
  targetProteinG: z.coerce.number().nonnegative(),
  targetFatG: z.coerce.number().nonnegative(),
  targetCarbG: z.coerce.number().nonnegative(),
});

export const PlanEntrySchema = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  mealSlot: z.enum(MEAL_SLOTS),
  recipeId: z.string().trim().min(1),
  servings: z.coerce.number().positive().default(1),
});

export type RecipeInput = z.infer<typeof RecipeSchema>;
export type TargetInput = z.infer<typeof TargetSchema>;
export type PlanEntryInput = z.infer<typeof PlanEntrySchema>;
export type FoodInput = z.infer<typeof FoodSchema>;
