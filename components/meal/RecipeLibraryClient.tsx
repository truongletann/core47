"use client";

import { useEffect, useState } from "react";
import { Search, Flame, Beef, Droplet, Wheat, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  FOOD_CATEGORY_LABELS,
  FOOD_CATEGORY_ORDER,
  COOKING_METHOD_LABELS,
  COOKING_METHOD_ORDER,
  CALORIE_RANGES,
  GOAL_LABELS,
  GOAL_ORDER,
  MEAL_TIME_LABELS,
  MEAL_TIME_ORDER,
} from "@/lib/meal/recipeFilters";

interface RecipeCard {
  id: string;
  name: string;
  description: string | null;
  servings: number;
  caloriesPerServing: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  goalTags: string[];
  mealCategories: string[];
  ingredients: { name: string; foodName: string | null; foodCategory: string | null }[];
}

interface RecipeDetail extends RecipeCard {
  instructions: string;
  servingNotes: string | null;
  tips: string | null;
  expertAdvice: string | null;
  suggestedCombo: string | null;
  dailyMenuNote: string | null;
  dailyMenuItems: { slot: string | null; dish: string; note: string | null; energy: string | null }[];
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    foodName: string | null;
    foodCategory: string | null;
    calories: number | null;
  }[];
}

const SORT_OPTIONS = [
  { key: "name", label: "Tên (A-Z)" },
  { key: "calAsc", label: "Calo: thấp → cao" },
  { key: "calDesc", label: "Calo: cao → thấp" },
  { key: "proteinDesc", label: "Đạm: cao → thấp" },
] as const;
type SortKey = (typeof SORT_OPTIONS)[number]["key"];

const PAGE_SIZE = 24;

type FilterSection = "ingredient" | "cooking" | "goal" | "calorie" | "mealTime";

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function RecipeLibraryClient() {
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [facets, setFacets] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const [openRecipeId, setOpenRecipeId] = useState<string | null>(null);
  const [openRecipe, setOpenRecipe] = useState<RecipeDetail | null>(null);
  const [openRecipeLoading, setOpenRecipeLoading] = useState(false);

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<FilterSection | null>("ingredient");
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [selectedCookingMethods, setSelectedCookingMethods] = useState<Set<string>>(new Set());
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());
  const [selectedCalorieRanges, setSelectedCalorieRanges] = useState<Set<string>>(new Set());
  const [selectedMealTimes, setSelectedMealTimes] = useState<Set<string>>(new Set());

  // Debounce the search box so every keystroke doesn't fire a request.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Any filter/search/sort change resets back to page 1.
  useEffect(() => {
    setPage(1);
  }, [
    search,
    sortKey,
    selectedIngredients,
    selectedCookingMethods,
    selectedGoals,
    selectedCalorieRanges,
    selectedMealTimes,
  ]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(PAGE_SIZE));
    params.set("sort", sortKey);
    if (search.trim()) params.set("q", search.trim());
    if (selectedIngredients.size) params.set("ingredients", [...selectedIngredients].join(","));
    if (selectedCookingMethods.size) params.set("cooking", [...selectedCookingMethods].join(","));
    if (selectedGoals.size) params.set("goals", [...selectedGoals].join(","));
    if (selectedCalorieRanges.size) params.set("calorie", [...selectedCalorieRanges].join(","));
    if (selectedMealTimes.size) params.set("mealTimes", [...selectedMealTimes].join(","));

    fetch(`/api/meal/recipes?${params.toString()}`, { credentials: "include" })
      .then(
        (r) =>
          r.json() as Promise<{
            data?: { recipes?: RecipeCard[]; total?: number; facets?: Record<string, string[]> };
          }>,
      )
      .then((json) => {
        setRecipes(json?.data?.recipes ?? []);
        setTotal(json?.data?.total ?? 0);
        setFacets(json?.data?.facets ?? {});
      })
      .finally(() => setLoading(false));
  }, [
    page,
    sortKey,
    search,
    selectedIngredients,
    selectedCookingMethods,
    selectedGoals,
    selectedCalorieRanges,
    selectedMealTimes,
  ]);

  useEffect(() => {
    if (!openRecipeId) {
      setOpenRecipe(null);
      return;
    }
    setOpenRecipeLoading(true);
    fetch(`/api/meal/recipes/${openRecipeId}`, { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { recipe?: RecipeDetail } }>)
      .then((json) => setOpenRecipe(json?.data?.recipe ?? null))
      .finally(() => setOpenRecipeLoading(false));
  }, [openRecipeId]);

  const activeFilterCount =
    selectedIngredients.size +
    selectedCookingMethods.size +
    selectedGoals.size +
    selectedCalorieRanges.size +
    selectedMealTimes.size;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function clearAllFilters() {
    setSelectedIngredients(new Set());
    setSelectedCookingMethods(new Set());
    setSelectedGoals(new Set());
    setSelectedCalorieRanges(new Set());
    setSelectedMealTimes(new Set());
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
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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
                  {FOOD_CATEGORY_ORDER.filter((cat) => (facets[cat]?.length ?? 0) > 0).map((cat) => (
                    <div key={cat}>
                      <p className="mb-1.5 text-xs font-semibold text-[rgb(var(--muted))]">
                        {FOOD_CATEGORY_LABELS[cat]}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {(facets[cat] ?? []).map((name) => (
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
              <SectionHeader section="mealTime" label="Bữa ăn" />
              {expandedSection === "mealTime" && (
                <div className="flex flex-col gap-1.5 py-3">
                  {MEAL_TIME_ORDER.map((key) => (
                    <label key={key} className={checkboxRowClass}>
                      <input
                        type="checkbox"
                        checked={selectedMealTimes.has(key)}
                        onChange={() => setSelectedMealTimes((s) => toggleInSet(s, key))}
                        className={checkboxClass}
                      />
                      {MEAL_TIME_LABELS[key]}
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
          <p className="mb-3 text-xs text-[rgb(var(--muted))]">{total} món</p>

          {loading ? (
            <p className="text-center text-sm text-[rgb(var(--muted))]">Loading...</p>
          ) : recipes.length === 0 ? (
            <p className="text-center text-sm text-[rgb(var(--muted))]">
              {total === 0 && activeFilterCount === 0 && !search
                ? "Chưa có công thức nào trong hệ thống."
                : "Không tìm thấy món nào khớp bộ lọc."}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setOpenRecipeId(r.id)}
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
                      {r.caloriesPerServing > 0 ? (
                        <>
                          <span className="flex items-center gap-1">
                            <Flame size={12} className="text-[rgb(var(--accent))]" /> {Math.round(r.caloriesPerServing)} kcal
                          </span>
                          {/* proteinG/fatG/carbG can be legitimately unset (0) even when
                              calories is known — a sourced calorie figure with no ingredient-
                              linked macro basis. Showing "0g" there would read as "known
                              zero" rather than "unknown", so only show macros when at least
                              one is nonzero. */}
                          {(r.proteinG > 0 || r.fatG > 0 || r.carbG > 0) && (
                            <>
                              <span className="flex items-center gap-1">
                                <Beef size={12} /> {Math.round(r.proteinG)}g
                              </span>
                              <span className="flex items-center gap-1">
                                <Droplet size={12} /> {Math.round(r.fatG)}g
                              </span>
                              <span className="flex items-center gap-1">
                                <Wheat size={12} /> {Math.round(r.carbG)}g
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <span className="italic">Chưa rõ calo</span>
                      )}
                    </div>
                    {(r.mealCategories.length > 0 || r.goalTags.length > 0) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {r.mealCategories.map((m) => (
                          <span
                            key={m}
                            className="rounded-full bg-[rgb(var(--border)/0.6)] px-2 py-0.5 text-[10px] text-[rgb(var(--muted))]"
                          >
                            {MEAL_TIME_LABELS[m] ?? m}
                          </span>
                        ))}
                        {r.goalTags
                          // "maintain" is applied to every recipe that has any
                          // goal tag at all (see backfill migration), so as a
                          // badge it's just noise — still usable as a filter.
                          .filter((g) => g !== "maintain")
                          .map((g) => (
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

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    aria-label="Trang trước"
                    className="flex items-center gap-1 rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--border)/0.5)] disabled:opacity-40"
                  >
                    <ChevronLeft size={14} /> Trước
                  </button>
                  <span className="font-data text-xs text-[rgb(var(--muted))]">
                    Trang {page}/{totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    aria-label="Trang sau"
                    className="flex items-center gap-1 rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--border)/0.5)] disabled:opacity-40"
                  >
                    Sau <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {openRecipeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">{openRecipe?.name ?? "Đang tải..."}</h2>
              <button onClick={() => setOpenRecipeId(null)} aria-label="Close" className="shrink-0">
                <X size={18} />
              </button>
            </div>

            {openRecipeLoading || !openRecipe ? (
              <p className="text-center text-sm text-[rgb(var(--muted))]">Loading...</p>
            ) : (
              <>
                {openRecipe.description && (
                  <p className="mb-3 text-sm text-[rgb(var(--muted))]">{openRecipe.description}</p>
                )}

                <div className="font-data mb-1 flex flex-wrap gap-3 text-xs text-[rgb(var(--muted))]">
                  <span>{openRecipe.servings} khẩu phần</span>
                  {openRecipe.caloriesPerServing > 0 ? (
                    <>
                      <span>{Math.round(openRecipe.caloriesPerServing)} kcal</span>
                      {(openRecipe.proteinG > 0 || openRecipe.fatG > 0 || openRecipe.carbG > 0) && (
                        <>
                          <span>Đạm {Math.round(openRecipe.proteinG)}g</span>
                          <span>Béo {Math.round(openRecipe.fatG)}g</span>
                          <span>Tinh bột {Math.round(openRecipe.carbG)}g</span>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="italic">Chưa rõ calo/macro</span>
                  )}
                </div>
                {openRecipe.caloriesPerServing > 0 && (
                  <p className="mb-4 text-[10px] italic text-[rgb(var(--muted))]">
                    *Ước tính từ nguyên liệu khớp được với CSDL dinh dưỡng — có thể chưa gồm hết gia
                    vị/nguyên liệu và chưa quy đổi theo khẩu phần thực tế, chỉ mang tính tham khảo.
                  </p>
                )}

                <h3 className="mb-1.5 text-sm font-semibold">Nguyên liệu</h3>
                <ul className="mb-4 flex flex-col gap-1 text-sm">
                  {openRecipe.ingredients.map((ing, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between border-b border-[rgb(var(--border))] pb-1 last:border-0"
                    >
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

                {openRecipe.dailyMenuItems.length > 0 && (
                  <>
                    <h3 className="mb-1.5 mt-4 text-sm font-semibold">Gợi ý thực đơn cả ngày</h3>
                    {openRecipe.dailyMenuNote && (
                      <p className="mb-2 text-xs text-[rgb(var(--muted))]">{openRecipe.dailyMenuNote}</p>
                    )}
                    <ul className="flex flex-col gap-1 text-sm">
                      {openRecipe.dailyMenuItems.map((item, i) => (
                        <li key={i} className="flex items-start justify-between gap-2 border-b border-[rgb(var(--border))] pb-1 last:border-0">
                          <span>
                            {item.slot && (
                              <span className="font-data mr-1.5 text-[10px] font-semibold text-[rgb(var(--accent))]">
                                {item.slot}
                              </span>
                            )}
                            {item.dish}
                            {item.note && <span className="text-xs text-[rgb(var(--muted))]"> — {item.note}</span>}
                          </span>
                          {item.energy && (
                            <span className="font-data shrink-0 text-xs text-[rgb(var(--muted))]">{item.energy} kcal</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
