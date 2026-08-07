"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Flame, Beef, Droplet, Wheat } from "lucide-react";
import { filterRecipesByIngredientQuery } from "@/lib/meal/ingredientSearch";

interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  foodName: string | null;
  calories: number | null;
}

interface Recipe {
  id: string;
  name: string;
  description: string | null;
  instructions: string;
  servings: number;
  caloriesPerServing: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  goalTags: string[];
  ingredients: RecipeIngredient[];
}

const GOAL_LABELS: Record<string, string> = {
  lose_weight: "Giảm cân",
  maintain: "Duy trì",
  gain_weight: "Tăng cân",
  gain_muscle: "Tăng cơ",
};

export function RecipeLibraryClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeGoal, setActiveGoal] = useState<string | null>(null);
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetch("/api/meal/recipes", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { recipes?: Recipe[] } }>)
      .then((json) => setRecipes(json?.data?.recipes ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const bySearch = filterRecipesByIngredientQuery(recipes, search);
    return activeGoal ? bySearch.filter((r) => r.goalTags.includes(activeGoal)) : bySearch;
  }, [recipes, search, activeGoal]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Công thức</h1>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">
          Tìm món theo tên hoặc nguyên liệu — vd &ldquo;thịt&rdquo;, &ldquo;thịt trứng&rdquo;.
        </p>
      </div>

      {/* Big prominent search bar */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm món ăn hoặc nguyên liệu..."
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] py-3.5 pl-12 pr-4 text-base shadow-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
        />
      </div>

      {/* Goal filter tags */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveGoal(null)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            activeGoal === null
              ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.12)] text-[rgb(var(--accent))]"
              : "border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)]"
          }`}
        >
          Tất cả
        </button>
        {Object.entries(GOAL_LABELS).map(([goal, label]) => (
          <button
            key={goal}
            onClick={() => setActiveGoal((g) => (g === goal ? null : goal))}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              activeGoal === goal
                ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.12)] text-[rgb(var(--accent))]"
                : "border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-sm text-[rgb(var(--muted))]">Loading...</p>
      ) : recipes.length === 0 ? (
        <p className="text-center text-sm text-[rgb(var(--muted))]">Chưa có công thức nào trong hệ thống.</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-[rgb(var(--muted))]">
          Không tìm thấy món nào khớp &ldquo;{search}&rdquo;.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setOpenRecipe(r)}
              className="flex flex-col rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-left transition-colors hover:border-[rgb(var(--accent))]"
            >
              <h3 className="font-display text-sm font-semibold">{r.name}</h3>
              {r.description && (
                <p className="mt-1 line-clamp-2 text-xs text-[rgb(var(--muted))]">{r.description}</p>
              )}
              <p className="mt-2 truncate text-[11px] text-[rgb(var(--muted))]">
                {r.ingredients.map((i) => i.name).join(", ")}
              </p>
              <div className="font-data mt-3 flex items-center gap-3 text-[11px] text-[rgb(var(--muted))]">
                <span className="flex items-center gap-1">
                  <Flame size={12} className="text-[rgb(var(--accent))]" /> {Math.round(r.caloriesPerServing)} kcal
                </span>
                <span className="flex items-center gap-1">
                  <Beef size={12} /> {Math.round(r.proteinG)}g
                </span>
                <span className="flex items-center gap-1">
                  <Droplet size={12} /> {Math.round(r.fatG)}g
                </span>
                <span className="flex items-center gap-1">
                  <Wheat size={12} /> {Math.round(r.carbG)}g
                </span>
              </div>
              {r.goalTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.goalTags.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-[rgb(var(--accent)/0.1)] px-2 py-0.5 text-[10px] text-[rgb(var(--accent))]"
                    >
                      {GOAL_LABELS[g] ?? g}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {openRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">{openRecipe.name}</h2>
              <button onClick={() => setOpenRecipe(null)} aria-label="Close" className="shrink-0">
                ✕
              </button>
            </div>
            {openRecipe.description && (
              <p className="mb-3 text-sm text-[rgb(var(--muted))]">{openRecipe.description}</p>
            )}

            <div className="font-data mb-4 flex flex-wrap gap-3 text-xs text-[rgb(var(--muted))]">
              <span>{openRecipe.servings} khẩu phần</span>
              <span>{Math.round(openRecipe.caloriesPerServing)} kcal/khẩu phần</span>
              <span>Đạm {Math.round(openRecipe.proteinG)}g</span>
              <span>Béo {Math.round(openRecipe.fatG)}g</span>
              <span>Tinh bột {Math.round(openRecipe.carbG)}g</span>
            </div>

            <h3 className="mb-1.5 text-sm font-semibold">Nguyên liệu</h3>
            <ul className="mb-4 flex flex-col gap-1 text-sm">
              {openRecipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center justify-between border-b border-[rgb(var(--border))] pb-1 last:border-0">
                  <span>{ing.name}</span>
                  <span className="font-data text-xs text-[rgb(var(--muted))]">
                    {ing.quantity} {ing.unit}
                    {ing.calories !== null && ` · ≈${Math.round(ing.calories)} kcal`}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mb-1.5 text-sm font-semibold">Cách làm</h3>
            <div className="whitespace-pre-line text-sm text-[rgb(var(--fg))]">{openRecipe.instructions}</div>
          </div>
        </div>
      )}
    </div>
  );
}
