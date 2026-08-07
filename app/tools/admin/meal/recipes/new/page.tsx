import { RecipeEditor } from "@/components/admin/RecipeEditor";

export default function NewMealRecipePage() {
  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-semibold">New recipe</h1>
      <RecipeEditor mode="create" />
    </div>
  );
}
