// Pure, dependency-free so both the server (lib/meal/service.ts) and the
// client (MealPlannerClient/RecipeLibraryClient) can filter the same
// already-fetched recipe list without pulling DB code into the browser
// bundle. Matches the recipe's own name AND every ingredient/linked-food
// name — "thịt trứng" only matches a recipe that has both a "thịt..." and a
// "trứng..." ingredient (or dish name containing those words).
export function filterRecipesByIngredientQuery<
  T extends { name: string; ingredients: { name: string; foodName: string | null }[] },
>(recipes: T[], query: string): T[] {
  const keywords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (keywords.length === 0) return recipes;

  return recipes.filter((recipe) => {
    const haystacks = [
      recipe.name.toLowerCase(),
      ...recipe.ingredients.map((ing) => `${ing.name} ${ing.foodName ?? ""}`.toLowerCase()),
    ];
    return keywords.every((kw) => haystacks.some((h) => h.includes(kw)));
  });
}
