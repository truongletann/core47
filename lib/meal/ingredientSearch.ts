// Pure, dependency-free so both the server (lib/meal/service.ts) and the
// client (components/meal/MealPlannerClient.tsx) can filter the same
// already-fetched recipe list without pulling DB code into the browser
// bundle.
export function filterRecipesByIngredientQuery<
  T extends { ingredients: { name: string; foodName: string | null }[] },
>(recipes: T[], query: string): T[] {
  const keywords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (keywords.length === 0) return recipes;

  return recipes.filter((recipe) => {
    const haystacks = recipe.ingredients.map((ing) => `${ing.name} ${ing.foodName ?? ""}`.toLowerCase());
    return keywords.every((kw) => haystacks.some((h) => h.includes(kw)));
  });
}
