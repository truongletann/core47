"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FOOD_CATEGORY_LABELS, FOOD_CATEGORY_ORDER } from "@/lib/meal/recipeFilters";

interface Food {
  id: string;
  name: string;
  category: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbPer100g: number;
}

export function FoodLibraryClient() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/meal/foods", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { foods?: Food[] } }>)
      .then((json) => setFoods(json?.data?.foods ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? foods.filter((f) => f.name.toLowerCase().includes(q)) : foods;
  }, [foods, search]);

  const byCategory = useMemo(() => {
    const map = new Map<string, Food[]>();
    for (const f of filtered) {
      const list = map.get(f.category) ?? [];
      list.push(f);
      map.set(f.category, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    return map;
  }, [filtered]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Nguyên liệu</h1>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">
          Tra cứu calo, đạm, béo, tinh bột của từng nguyên liệu tươi sống — tính trên 100g.
        </p>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm nguyên liệu..."
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] py-3.5 pl-12 pr-4 text-base shadow-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
        />
      </div>

      {loading ? (
        <p className="text-center text-sm text-[rgb(var(--muted))]">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-[rgb(var(--muted))]">Không tìm thấy nguyên liệu nào.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {FOOD_CATEGORY_ORDER.filter((cat) => byCategory.has(cat)).map((cat) => (
            <div key={cat}>
              <h2 className="font-display mb-3 text-lg font-semibold">{FOOD_CATEGORY_LABELS[cat]}</h2>
              <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs uppercase text-[rgb(var(--muted))]">
                      <th className="px-4 py-2">Nguyên liệu</th>
                      <th className="px-4 py-2">Kcal/100g</th>
                      <th className="px-4 py-2">Đạm (g)</th>
                      <th className="px-4 py-2">Béo (g)</th>
                      <th className="px-4 py-2">Tinh bột (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(byCategory.get(cat) ?? []).map((f) => (
                      <tr key={f.id} className="border-b border-[rgb(var(--border))] last:border-0">
                        <td className="px-4 py-2">{f.name}</td>
                        <td className="font-data px-4 py-2 text-xs">{f.caloriesPer100g}</td>
                        <td className="font-data px-4 py-2 text-xs">{f.proteinPer100g}</td>
                        <td className="font-data px-4 py-2 text-xs">{f.fatPer100g}</td>
                        <td className="font-data px-4 py-2 text-xs">{f.carbPer100g}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
