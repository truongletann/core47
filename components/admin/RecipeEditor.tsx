"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { MEAL_GOALS } from "@/lib/meal/schema";

interface IngredientForm {
  name: string;
  quantity: number;
  unit: string;
}

interface EditorInitial {
  name: string;
  description: string;
  instructions: string;
  servings: number;
  caloriesPerServing: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  goalTags: string[];
  ingredients: IngredientForm[];
}

const emptyInitial: EditorInitial = {
  name: "",
  description: "",
  instructions: "",
  servings: 1,
  caloriesPerServing: 0,
  proteinG: 0,
  fatG: 0,
  carbG: 0,
  goalTags: [],
  ingredients: [{ name: "", quantity: 0, unit: "" }],
};

const GOAL_LABELS: Record<string, string> = {
  lose_weight: "Giảm cân",
  maintain: "Duy trì",
  gain_weight: "Tăng cân",
  gain_muscle: "Tăng cơ",
};

export function RecipeEditor({
  mode,
  recipeId,
  initial,
}: {
  mode: "create" | "edit";
  recipeId?: string;
  initial?: EditorInitial;
}) {
  const router = useRouter();
  const [form, setForm] = useState<EditorInitial>(initial ?? emptyInitial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateIngredient(index: number, patch: Partial<IngredientForm>) {
    setForm((f) => ({
      ...f,
      ingredients: f.ingredients.map((ing, i) => (i === index ? { ...ing, ...patch } : ing)),
    }));
  }

  function addIngredient() {
    setForm((f) => ({ ...f, ingredients: [...f.ingredients, { name: "", quantity: 0, unit: "" }] }));
  }

  function removeIngredient(index: number) {
    setForm((f) => ({ ...f, ingredients: f.ingredients.filter((_, i) => i !== index) }));
  }

  function toggleGoal(goal: string) {
    setForm((f) => ({
      ...f,
      goalTags: f.goalTags.includes(goal) ? f.goalTags.filter((g) => g !== goal) : [...f.goalTags, goal],
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        ingredients: form.ingredients.filter((i) => i.name.trim() && i.unit.trim() && i.quantity > 0),
      };
      if (payload.ingredients.length === 0) {
        setError("Add at least one ingredient with a valid quantity and unit.");
        return;
      }

      const url = mode === "create" ? "/api/admin/meal/recipes" : `/api/admin/meal/recipes/${recipeId}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setError(json.error ?? "Save failed");
        return;
      }
      router.push("/meal/recipes");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]";

  return (
    <div className="max-w-3xl">
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">
            Description (optional)
          </label>
          <input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">
            Instructions (one step per line)
          </label>
          <textarea
            rows={6}
            value={form.instructions}
            onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">Servings</label>
            <input
              type="number"
              min={1}
              value={form.servings}
              onChange={(e) => setForm((f) => ({ ...f, servings: Number(e.target.value) }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">Kcal/serving</label>
            <input
              type="number"
              min={0}
              value={form.caloriesPerServing}
              onChange={(e) => setForm((f) => ({ ...f, caloriesPerServing: Number(e.target.value) }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">Protein (g)</label>
            <input
              type="number"
              min={0}
              value={form.proteinG}
              onChange={(e) => setForm((f) => ({ ...f, proteinG: Number(e.target.value) }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">Fat (g)</label>
            <input
              type="number"
              min={0}
              value={form.fatG}
              onChange={(e) => setForm((f) => ({ ...f, fatG: Number(e.target.value) }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">Carb (g)</label>
            <input
              type="number"
              min={0}
              value={form.carbG}
              onChange={(e) => setForm((f) => ({ ...f, carbG: Number(e.target.value) }))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[rgb(var(--muted))]">Suited for goal</label>
          <div className="flex flex-wrap gap-2">
            {MEAL_GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  form.goalTags.includes(goal)
                    ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.12)] text-[rgb(var(--accent))]"
                    : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                }`}
              >
                {GOAL_LABELS[goal]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-[rgb(var(--muted))]">Ingredients</label>
            <button
              type="button"
              onClick={addIngredient}
              className="text-xs text-[rgb(var(--accent))] hover:underline"
            >
              + Add ingredient
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {form.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  placeholder="Name"
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, { name: e.target.value })}
                  className={`${inputClass} flex-1`}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Qty"
                  value={ing.quantity || ""}
                  onChange={(e) => updateIngredient(i, { quantity: Number(e.target.value) })}
                  className={`${inputClass} w-24`}
                />
                <input
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(i, { unit: e.target.value })}
                  className={`${inputClass} w-24`}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="shrink-0 text-[rgb(var(--muted))] hover:text-red-600"
                  aria-label="Remove ingredient"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[rgb(var(--accent))] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save recipe"}
          </button>
        </div>
      </div>
    </div>
  );
}
