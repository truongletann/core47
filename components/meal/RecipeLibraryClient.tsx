"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Flame, Beef, Droplet, Wheat, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { filterRecipesByIngredientQuery } from "@/lib/meal/ingredientSearch";
import {
  FOOD_CATEGORY_LABELS,
  FOOD_CATEGORY_ORDER,
  COOKING_METHOD_LABELS,
  COOKING_METHOD_ORDER,
  deriveCookingMethods,
  CALORIE_RANGES,
  GOAL_LABELS,
  GOAL_ORDER,
} from "@/lib/meal/recipeFilters";

interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  foodName: string | null;
  foodCategory: string | null;
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
  servingNotes: string | null;
  tips: string | null;
  expertAdvice: string | null;
  suggestedCombo: string | null;
  ingredients: RecipeIngredient[];
}

const SORT_OPTIONS = [
  { key: "name", label: "Tên (A-Z)" },
  { key: "calAsc", label: "Calo: thấp → cao" },
  { key: "calDesc", label: "Calo: cao → thấp" },
  { key: "proteinDesc", label: "Đạm: cao → thấp" },
] as const;
type SortKey = (typeof SORT_OPTIONS)[number]["key"];

type FilterSection = "ingredient" | "cooking" | "goal" | "calorie";

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function RecipeLibraryClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<FilterSection | null>("ingredient");
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [selectedCookingMethods, setSelectedCookingMethods] = useState<Set<string>>(new Set());
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());
  const [selectedCalorieRanges, setSelectedCalorieRanges] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/meal/recipes", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { recipes?: Recipe[] } }>)
      .then((json) => setRecipes(json?.data?.recipes ?? []))
      .finally(() => setLoading(false));
  }, []);

  // Ingredient checkboxes are built from whatever's actually linked across
  // the loaded recipes (grouped by the food's category), not a hardcoded
  // list — stays accurate as the admin adds recipes/foods.
  const ingredientsByCategory = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const recipe of recipes) {
      for (const ing of recipe.ingredients) {
        if (!ing.foodName || !ing.foodCategory) continue;
        const set = map.get(ing.foodCategory) ?? new Set<string>();
        set.add(ing.foodName);
        map.set(ing.foodCategory, set);
      }
    }
    return map;
  }, [recipes]);

  const activeFilterCount =
    selectedIngredients.size + selectedCookingMethods.size + selectedGoals.size + selectedCalorieRanges.size;

  const filtered = useMemo(() => {
    let result = filterRecipesByIngredientQuery(recipes, search);

    if (selectedIngredients.size > 0) {
      result = result.filter((r) =>
        r.ingredients.some((ing) => ing.foodName && selectedIngredients.has(ing.foodName)),
      );
    }
    if (selectedCookingMethods.size > 0) {
      result = result.filter((r) => deriveCookingMethods(r.name).some((m) => selectedCookingMethods.has(m)));
    }
    if (selectedGoals.size > 0) {
      result = result.filter((r) => r.goalTags.some((g) => selectedGoals.has(g)));
    }
    if (selectedCalorieRanges.size > 0) {
      result = result.filter((r) =>
        CALORIE_RANGES.some((range) => selectedCalorieRanges.has(range.key) && range.test(r.caloriesPerServing)),
      );
    }

    const sorted = [...result];
    if (sortKey === "calAsc") sorted.sort((a, b) => a.caloriesPerServing - b.caloriesPerServing);
    else if (sortKey === "calDesc") sorted.sort((a, b) => b.caloriesPerServing - a.caloriesPerServing);
    else if (sortKey === "proteinDesc") sorted.sort((a, b) => b.proteinG - a.proteinG);
    else sorted.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    return sorted;
  }, [recipes, search, selectedIngredients, selectedCookingMethods, selectedGoals, selectedCalorieRanges, sortKey]);

  function clearAllFilters() {
    setSelectedIngredients(new Set());
    setSelectedCookingMethods(new Set());
    setSelectedGoals(new Set());
    setSelectedCalorieRanges(new Set());
  }

  const checkboxRowClass = "flex items-center gap-2 text-sm";
  const checkboxClass = "h-4 w-4 accent-[rgb(var(--accent))]";

  function SectionHeader({ section, label }: { section: FilterSection; label: string }) {
    const expanded = expandedSection === section;
    return (
      <button
        type="button"
        onClick={() => setExpandedSection((s) => (s === section ? null : section))}
        className="flex w-full items-center justify-between border-b border-[rgb(var(--border))] py-3 text-left"
      >
        <span className={`text-sm font-semibold ${expanded ? "text-[rgb(var(--accent))]" : ""}`}>{label}</span>
        <ChevronDown
          size={16}
          className={`text-[rgb(var(--muted))] transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
    );
  }

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

      {/* Filter toggle + sort */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterPanelOpen((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold ${
            activeFilterCount > 0
              ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.1)] text-[rgb(var(--accent))]"
              : "border-[rgb(var(--border))] text-[rgb(var(--fg))] hover:bg-[rgb(var(--border)/0.5)]"
          }`}
        >
          <SlidersHorizontal size={15} />
          {filterPanelOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
          {activeFilterCount > 0 && (
            <span className="font-data rounded-full bg-[rgb(var(--accent))] px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button onClick={clearAllFilters} className="text-xs text-[rgb(var(--muted))] hover:underline">
            Xóa hết bộ lọc
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-medium text-[rgb(var(--muted))]">Sắp xếp:</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-2.5 py-1.5 text-xs outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Accordion filter panel */}
        {filterPanelOpen && (
          <div className="w-full shrink-0 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 md:w-64">
            <div>
              <SectionHeader section="ingredient" label="Nguyên liệu" />
              {expandedSection === "ingredient" && (
                <div className="flex flex-col gap-3 py-3">
                  {FOOD_CATEGORY_ORDER.filter((cat) => ingredientsByCategory.has(cat)).map((cat) => (
                    <div key={cat}>
                      <p className="mb-1.5 text-xs font-semibold text-[rgb(var(--muted))]">
                        {FOOD_CATEGORY_LABELS[cat]}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {[...(ingredientsByCategory.get(cat) ?? [])].sort((a, b) => a.localeCompare(b, "vi")).map((name) => (
                          <label key={name} className={checkboxRowClass}>
                            <input
                              type="checkbox"
                              checked={selectedIngredients.has(name)}
                              onChange={() => setSelectedIngredients((s) => toggleInSet(s, name))}
                              className={checkboxClass}
                            />
                            {name}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <SectionHeader section="cooking" label="Cách nấu" />
              {expandedSection === "cooking" && (
                <div className="flex flex-col gap-1.5 py-3">
                  {COOKING_METHOD_ORDER.map((key) => (
                    <label key={key} className={checkboxRowClass}>
                      <input
                        type="checkbox"
                        checked={selectedCookingMethods.has(key)}
                        onChange={() => setSelectedCookingMethods((s) => toggleInSet(s, key))}
                        className={checkboxClass}
                      />
                      {COOKING_METHOD_LABELS[key]}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <SectionHeader section="goal" label="Theo nhu cầu dinh dưỡng" />
              {expandedSection === "goal" && (
                <div className="flex flex-col gap-1.5 py-3">
                  {GOAL_ORDER.map((key) => (
                    <label key={key} className={checkboxRowClass}>
                      <input
                        type="checkbox"
                        checked={selectedGoals.has(key)}
                        onChange={() => setSelectedGoals((s) => toggleInSet(s, key))}
                        className={checkboxClass}
                      />
                      {GOAL_LABELS[key]}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <SectionHeader section="calorie" label="Calo" />
              {expandedSection === "calorie" && (
                <div className="flex flex-col gap-1.5 py-3">
                  {CALORIE_RANGES.map((range) => (
                    <label key={range.key} className={checkboxRowClass}>
                      <input
                        type="checkbox"
                        checked={selectedCalorieRanges.has(range.key)}
                        onChange={() => setSelectedCalorieRanges((s) => toggleInSet(s, range.key))}
                        className={checkboxClass}
                      />
                      {range.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="min-w-0 flex-1">
          <p className="mb-3 text-xs text-[rgb(var(--muted))]">{filtered.length} món</p>

          {loading ? (
            <p className="text-center text-sm text-[rgb(var(--muted))]">Loading...</p>
          ) : recipes.length === 0 ? (
            <p className="text-center text-sm text-[rgb(var(--muted))]">Chưa có công thức nào trong hệ thống.</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-[rgb(var(--muted))]">Không tìm thấy món nào khớp bộ lọc.</p>
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
        </div>
      </div>

      {openRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">{openRecipe.name}</h2>
              <button onClick={() => setOpenRecipe(null)} aria-label="Close" className="shrink-0">
                <X size={18} />
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

            {openRecipe.servingNotes && (
              <>
                <h3 className="mb-1.5 mt-4 text-sm font-semibold">Cách dùng</h3>
                <div className="whitespace-pre-line text-sm text-[rgb(var(--fg))]">{openRecipe.servingNotes}</div>
              </>
            )}

            {openRecipe.tips && (
              <>
                <h3 className="mb-1.5 mt-4 text-sm font-semibold">Mẹo nhỏ</h3>
                <div className="whitespace-pre-line text-sm text-[rgb(var(--fg))]">{openRecipe.tips}</div>
              </>
            )}

            {openRecipe.expertAdvice && (
              <>
                <h3 className="mb-1.5 mt-4 text-sm font-semibold">Lời khuyên chuyên gia</h3>
                <div className="whitespace-pre-line text-sm text-[rgb(var(--fg))]">{openRecipe.expertAdvice}</div>
              </>
            )}

            {openRecipe.suggestedCombo && (
              <>
                <h3 className="mb-1.5 mt-4 text-sm font-semibold">Gợi ý dùng kèm</h3>
                <div className="whitespace-pre-line text-sm text-[rgb(var(--fg))]">{openRecipe.suggestedCombo}</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
