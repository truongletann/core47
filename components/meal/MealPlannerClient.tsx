"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, ShoppingCart, Settings2, X, Search, Sparkles } from "lucide-react";
import { filterRecipesByIngredientQuery } from "@/lib/meal/ingredientSearch";

interface RecipeIngredient {
  name: string;
  foodName: string | null;
  calories: number | null;
}

interface Recipe {
  id: string;
  name: string;
  servings: number;
  caloriesPerServing: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  goalTags: string[];
  mealCategories: string[];
  ingredients: RecipeIngredient[];
}

interface PlanEntry {
  id: string;
  date: string;
  mealSlot: "breakfast" | "lunch" | "dinner" | "snack";
  recipeId: string;
  recipeName: string;
  servings: number;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
}

interface Target {
  goal: "lose_weight" | "maintain" | "gain_weight" | "gain_muscle";
  targetCalories: number;
  targetProteinG: number;
  targetFatG: number;
  targetCarbG: number;
}

const SLOTS: { key: PlanEntry["mealSlot"]; label: string }[] = [
  { key: "breakfast", label: "Sáng" },
  { key: "lunch", label: "Trưa" },
  { key: "dinner", label: "Tối" },
  { key: "snack", label: "Ăn vặt" },
];

const GOAL_LABELS: Record<Target["goal"], string> = {
  lose_weight: "Giảm cân",
  maintain: "Duy trì",
  gain_weight: "Tăng cân",
  gain_muscle: "Tăng cơ",
};

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number): Date {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}

export function MealPlannerClient() {
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [selectedDate, setSelectedDate] = useState<string>(() => toISODate(new Date()));
  const [entries, setEntries] = useState<PlanEntry[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [target, setTarget] = useState<Target | null>(null);
  const [loading, setLoading] = useState(true);
  const [pickerSlot, setPickerSlot] = useState<PlanEntry["mealSlot"] | null>(null);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [shoppingList, setShoppingList] = useState<{ name: string; unit: string; quantity: number }[]>([]);
  const [targetPanelOpen, setTargetPanelOpen] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const from = toISODate(weekDays[0]);
  const to = toISODate(weekDays[6]);

  function loadWeek() {
    setLoading(true);
    Promise.all([
      fetch(`/api/meal/plan?from=${from}&to=${to}`, { credentials: "include" }).then(
        (r) => r.json() as Promise<{ data?: { entries?: PlanEntry[] } }>,
      ),
      fetch("/api/meal/target", { credentials: "include" }).then(
        (r) => r.json() as Promise<{ data?: { target?: Target | null } }>,
      ),
    ])
      .then(([planJson, targetJson]) => {
        setEntries(planJson?.data?.entries ?? []);
        setTarget(targetJson?.data?.target ?? null);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadWeek();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  useEffect(() => {
    // ?all=1 returns the full recipe pool (lightweight fields only) — the
    // picker/auto-suggest below need to search/rank across every recipe,
    // not just one page of the library's paginated listing.
    fetch("/api/meal/recipes?all=1", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { recipes?: Recipe[] } }>)
      .then((json) => setRecipes(json?.data?.recipes ?? []));
  }, []);

  const dayEntries = entries.filter((e) => e.date === selectedDate);
  const dayTotals = dayEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      fat: acc.fat + e.fat,
      carb: acc.carb + e.carb,
    }),
    { calories: 0, protein: 0, fat: 0, carb: 0 },
  );

  async function handleAddRecipe(recipeId: string, servings: number) {
    if (!pickerSlot) return;
    await fetch("/api/meal/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selectedDate, mealSlot: pickerSlot, recipeId, servings }),
      credentials: "include",
    });
    setPickerSlot(null);
    loadWeek();
  }

  async function handleRemoveEntry(id: string) {
    await fetch(`/api/meal/plan/${id}`, { method: "DELETE", credentials: "include" });
    loadWeek();
  }

  // Fills whichever meal slots are still empty for the selected day: splits
  // the daily calorie target across slots (breakfast/lunch/dinner/snack ≈
  // 25/35/30/10%), narrows the recipe pool to the user's goal tag when set,
  // and for each slot picks whichever candidate's calo/serving is closest to
  // that slot's share — reusing a recipe only if every candidate is already
  // used once. Real optimization (macro balance, variety over multiple
  // days) is out of scope for a first pass.
  async function handleAutoSuggest() {
    if (recipes.length === 0) return;
    const filledSlots = new Set(dayEntries.map((e) => e.mealSlot));
    const emptySlots = SLOTS.filter((s) => !filledSlots.has(s.key));
    if (emptySlots.length === 0) return;

    setSuggesting(true);
    try {
      const slotWeights: Record<PlanEntry["mealSlot"], number> = {
        breakfast: 0.25,
        lunch: 0.35,
        dinner: 0.3,
        snack: 0.1,
      };
      const dailyCalories = target?.targetCalories ?? 2000;
      const goalPool = target ? recipes.filter((r) => r.goalTags.includes(target.goal)) : [];
      const candidates = goalPool.length > 0 ? goalPool : recipes;

      const usedIds = new Set<string>();
      for (const slot of emptySlots) {
        const slotTarget = dailyCalories * slotWeights[slot.key];
        // Prefer recipes tagged for this slot's meal time — falls back to
        // the full goal pool when nothing matches (most of the imported
        // recipe set doesn't have a snack/dessert tag, for instance).
        const slotTagged = candidates.filter((r) => r.mealCategories.includes(slot.key));
        const timeFiltered = slotTagged.length > 0 ? slotTagged : candidates;
        const unused = timeFiltered.filter((r) => !usedIds.has(r.id));
        const pool = unused.length > 0 ? unused : timeFiltered;
        const best = pool.reduce((closest, r) =>
          Math.abs(r.caloriesPerServing - slotTarget) < Math.abs(closest.caloriesPerServing - slotTarget)
            ? r
            : closest,
        );
        usedIds.add(best.id);
        await fetch("/api/meal/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: selectedDate, mealSlot: slot.key, recipeId: best.id, servings: 1 }),
          credentials: "include",
        });
      }
      loadWeek();
    } finally {
      setSuggesting(false);
    }
  }

  async function handleOpenShoppingList() {
    const res = await fetch(`/api/meal/shopping-list?from=${from}&to=${to}`, { credentials: "include" });
    const json = (await res.json()) as { data?: { items?: typeof shoppingList } };
    setShoppingList(json?.data?.items ?? []);
    setShoppingListOpen(true);
  }

  const inputClass =
    "w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Meal Planner</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Lên thực đơn theo tuần, theo dõi calo/macro, tự tạo danh sách đi chợ.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTargetPanelOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-sm hover:bg-[rgb(var(--border)/0.5)]"
          >
            <Settings2 size={15} /> Mục tiêu
          </button>
          <button
            onClick={handleOpenShoppingList}
            className="flex items-center gap-1.5 rounded-lg bg-[rgb(var(--accent))] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <ShoppingCart size={15} /> Danh sách đi chợ (tuần)
          </button>
        </div>
      </div>

      {targetPanelOpen && (
        <TargetPanel
          initial={target}
          onSaved={(t) => {
            setTarget(t);
            setTargetPanelOpen(false);
          }}
          onClose={() => setTargetPanelOpen(false)}
        />
      )}

      {/* Week nav */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setWeekStart((d) => addDays(d, -7))}
          className="rounded-md border border-[rgb(var(--border))] p-2 hover:bg-[rgb(var(--border)/0.5)]"
          aria-label="Previous week"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-data text-xs text-[rgb(var(--muted))]">
          {from} → {to}
        </span>
        <button
          onClick={() => setWeekStart((d) => addDays(d, 7))}
          className="rounded-md border border-[rgb(var(--border))] p-2 hover:bg-[rgb(var(--border)/0.5)]"
          aria-label="Next week"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day tabs */}
      <div className="mb-6 grid grid-cols-7 gap-1.5">
        {weekDays.map((d, i) => {
          const iso = toISODate(d);
          const isToday = iso === toISODate(new Date());
          const active = iso === selectedDate;
          return (
            <button
              key={iso}
              onClick={() => setSelectedDate(iso)}
              className={`rounded-lg border px-1 py-2 text-center text-xs ${
                active
                  ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.12)] text-[rgb(var(--accent))]"
                  : "border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)]"
              }`}
            >
              <div className="font-medium">{WEEKDAY_LABELS[i]}</div>
              <div className={isToday ? "font-semibold" : ""}>{d.getDate()}</div>
            </button>
          );
        })}
      </div>

      {/* Auto-suggest */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs text-[rgb(var(--muted))]">
          {SLOTS.filter((s) => !dayEntries.some((e) => e.mealSlot === s.key)).length === 0
            ? "Ngày này đã đủ bữa."
            : "Còn bữa trống — để hệ thống tự gợi ý theo mục tiêu calo của bạn."}
        </p>
        <button
          onClick={handleAutoSuggest}
          disabled={
            suggesting || recipes.length === 0 || SLOTS.every((s) => dayEntries.some((e) => e.mealSlot === s.key))
          }
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[rgb(var(--accent))] px-3 py-2 text-sm font-semibold text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent)/0.1)] disabled:opacity-40"
        >
          <Sparkles size={15} /> {suggesting ? "Đang gợi ý..." : "Gợi ý thực đơn"}
        </button>
      </div>

      {/* Totals vs target */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Calo", value: dayTotals.calories, target: target?.targetCalories, unit: "kcal" },
          { label: "Đạm", value: dayTotals.protein, target: target?.targetProteinG, unit: "g" },
          { label: "Béo", value: dayTotals.fat, target: target?.targetFatG, unit: "g" },
          { label: "Tinh bột", value: dayTotals.carb, target: target?.targetCarbG, unit: "g" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-[rgb(var(--border))] p-3">
            <p className="font-data text-[10px] text-[rgb(var(--muted))]">{stat.label}</p>
            <p className="font-display mt-1 text-lg font-semibold">
              {Math.round(stat.value)}
              {stat.target ? (
                <span className="text-xs font-normal text-[rgb(var(--muted))]"> / {Math.round(stat.target)} {stat.unit}</span>
              ) : (
                <span className="text-xs font-normal text-[rgb(var(--muted))]"> {stat.unit}</span>
              )}
            </p>
          </div>
        ))}
      </div>
      {dayTotals.calories > 0 && (
        <p className="-mt-4 mb-6 text-[10px] italic text-[rgb(var(--muted))]">
          *Calo/macro mỗi món là ước tính từ nguyên liệu khớp được với CSDL dinh dưỡng, có thể chưa
          gồm hết gia vị và chưa quy đổi theo khẩu phần thực tế — chỉ mang tính tham khảo, không thay
          thế tư vấn dinh dưỡng chuyên môn.
        </p>
      )}

      {/* Meal slots */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <p className="text-center text-sm text-[rgb(var(--muted))]">Loading...</p>
        ) : (
          SLOTS.map((slot) => {
            const items = dayEntries.filter((e) => e.mealSlot === slot.key);
            return (
              <div key={slot.key} className="rounded-xl border border-[rgb(var(--border))] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-display text-sm font-semibold">{slot.label}</h3>
                  <button
                    onClick={() => setPickerSlot(slot.key)}
                    className="flex items-center gap-1 text-xs text-[rgb(var(--accent))] hover:underline"
                  >
                    <Plus size={13} /> Thêm món
                  </button>
                </div>
                {items.length === 0 ? (
                  <p className="text-xs text-[rgb(var(--muted))]">Chưa có món nào.</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {items.map((e) => (
                      <div key={e.id} className="flex items-center justify-between gap-2 text-sm">
                        <span>
                          {e.recipeName} <span className="text-xs text-[rgb(var(--muted))]">× {e.servings}</span>
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-data text-xs text-[rgb(var(--muted))]">
                            {Math.round(e.calories)} kcal
                          </span>
                          <button
                            onClick={() => handleRemoveEntry(e.id)}
                            className="text-[rgb(var(--muted))] hover:text-red-600"
                            aria-label="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {pickerSlot && (
        <RecipePickerModal
          recipes={recipes}
          onClose={() => setPickerSlot(null)}
          onPick={handleAddRecipe}
        />
      )}

      {shoppingListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Danh sách đi chợ</h2>
              <button onClick={() => setShoppingListOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <p className="mb-3 text-xs text-[rgb(var(--muted))]">
              {from} → {to}
            </p>
            {shoppingList.length === 0 ? (
              <p className="text-sm text-[rgb(var(--muted))]">
                Chưa có nguyên liệu nào — hãy thêm món vào thực đơn tuần này trước.
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5 text-sm">
                {shoppingList.map((item) => (
                  <li
                    key={`${item.name}-${item.unit}`}
                    className="flex items-center justify-between border-b border-[rgb(var(--border))] pb-1.5 last:border-0"
                  >
                    <span>{item.name}</span>
                    <span className="font-data text-xs text-[rgb(var(--muted))]">
                      {Math.round(item.quantity * 100) / 100} {item.unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RecipePickerModal({
  recipes,
  onClose,
  onPick,
}: {
  recipes: Recipe[];
  onClose: () => void;
  onPick: (recipeId: string, servings: number) => void;
}) {
  const [servingsByRecipe, setServingsByRecipe] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => filterRecipesByIngredientQuery(recipes, search), [recipes, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Chọn món</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo nguyên liệu, vd: thịt, thịt trứng..."
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] py-2 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
          />
        </div>
        {recipes.length === 0 ? (
          <p className="text-sm text-[rgb(var(--muted))]">Chưa có công thức nào trong hệ thống.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-[rgb(var(--muted))]">Không tìm thấy món nào khớp nguyên liệu.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-[rgb(var(--border))] p-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="font-data text-xs text-[rgb(var(--muted))]">
                    {r.caloriesPerServing} kcal/khẩu phần
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-[rgb(var(--muted))]" title={r.ingredients
                    .map((i) => (i.calories !== null ? `${i.name} (≈${Math.round(i.calories)} kcal)` : i.name))
                    .join(", ")}
                  >
                    {r.ingredients.map((i) => i.name).join(", ")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={servingsByRecipe[r.id] ?? 1}
                    onChange={(e) =>
                      setServingsByRecipe((s) => ({ ...s, [r.id]: Number(e.target.value) }))
                    }
                    className="w-16 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-xs"
                  />
                  <button
                    onClick={() => onPick(r.id, servingsByRecipe[r.id] ?? 1)}
                    className="rounded-md bg-[rgb(var(--accent))] px-2.5 py-1 text-xs font-semibold text-white hover:opacity-90"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TargetPanel({
  initial,
  onSaved,
  onClose,
}: {
  initial: Target | null;
  onSaved: (t: Target) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Target>(
    initial ?? { goal: "maintain", targetCalories: 2000, targetProteinG: 100, targetFatG: 60, targetCarbG: 220 },
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/meal/target", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; data?: { target: Target } };
      if (json.success && json.data) onSaved(json.data.target);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]";

  return (
    <div className="mb-6 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold">Mục tiêu calo/macro mỗi ngày</h3>
        <button onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>
      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">Mục tiêu</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(GOAL_LABELS) as Target["goal"][]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setForm((f) => ({ ...f, goal: g }))}
              className={`rounded-full border px-3 py-1 text-xs ${
                form.goal === g
                  ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.12)] text-[rgb(var(--accent))]"
                  : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
              }`}
            >
              {GOAL_LABELS[g]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">Calo/ngày</label>
          <input
            type="number"
            min={0}
            value={form.targetCalories}
            onChange={(e) => setForm((f) => ({ ...f, targetCalories: Number(e.target.value) }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">Đạm (g)</label>
          <input
            type="number"
            min={0}
            value={form.targetProteinG}
            onChange={(e) => setForm((f) => ({ ...f, targetProteinG: Number(e.target.value) }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">Béo (g)</label>
          <input
            type="number"
            min={0}
            value={form.targetFatG}
            onChange={(e) => setForm((f) => ({ ...f, targetFatG: Number(e.target.value) }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[rgb(var(--muted))]">Tinh bột (g)</label>
          <input
            type="number"
            min={0}
            value={form.targetCarbG}
            onChange={(e) => setForm((f) => ({ ...f, targetCarbG: Number(e.target.value) }))}
            className={inputClass}
          />
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : "Lưu mục tiêu"}
        </button>
      </div>
    </div>
  );
}
