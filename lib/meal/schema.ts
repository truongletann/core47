import { z } from "zod";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);
const nullableString = (max: number) =>
  z.string().trim().max(max).nullable().optional().transform(emptyToNull);

export const MEAL_GOALS = ["lose_weight", "maintain", "gain_weight", "gain_muscle"] as const;
export const MEAL_SLOTS = ["breakfast", "lunch", "dinner", "snack"] as const;

export const RecipeIngredientSchema = z.object({
  name: z.string().trim().min(1).max(120),
  quantity: z.coerce.number().positive(),
  unit: z.string().trim().min(1).max(30),
});

export const RecipeSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: nullableString(400),
  instructions: z.string().trim().min(1).max(5000),
  servings: z.coerce.number().int().positive(),
  caloriesPerServing: z.coerce.number().nonnegative(),
  proteinG: z.coerce.number().nonnegative(),
  fatG: z.coerce.number().nonnegative(),
  carbG: z.coerce.number().nonnegative(),
  goalTags: z.array(z.enum(MEAL_GOALS)).default([]),
  ingredients: z.array(RecipeIngredientSchema).min(1).max(60),
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
