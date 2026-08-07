import { notFound } from "next/navigation";
import { RecipeEditor } from "@/components/admin/RecipeEditor";
import { getRecipeById } from "@/lib/meal/service";

export default async function EditMealRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipeById(id);
  if (!recipe) notFound();

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-semibold">Edit recipe</h1>
      <RecipeEditor
        mode="edit"
        recipeId={recipe.id}
        initial={{
          name: recipe.name,
          description: recipe.description ?? "",
          instructions: recipe.instructions,
          servings: recipe.servings,
          caloriesPerServing: recipe.caloriesPerServing,
          proteinG: recipe.proteinG,
          fatG: recipe.fatG,
          carbG: recipe.carbG,
          goalTags: recipe.goalTags,
          ingredients: recipe.ingredients.map((i) => ({ name: i.name, quantity: i.quantity, unit: i.unit })),
        }}
      />
    </div>
  );
}
