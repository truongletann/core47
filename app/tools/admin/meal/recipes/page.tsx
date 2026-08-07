"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";

interface RecipeRow {
  id: string;
  name: string;
  servings: number;
  caloriesPerServing: number;
  updatedAt: string;
}

export default function AdminMealRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<RecipeRow | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/meal/recipes", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { recipes?: RecipeRow[] } }>)
      .then((json) => setRecipes(json?.data?.recipes ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/meal/recipes/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Meal Recipes</h1>
        <Link
          href="/meal/recipes/new"
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + New recipe
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Servings</th>
              <th className="px-4 py-2">Kcal/serving</th>
              <th className="px-4 py-2">Updated</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  Loading...
                </td>
              </tr>
            ) : recipes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  No recipes yet.
                </td>
              </tr>
            ) : (
              recipes.map((r) => (
                <tr key={r.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2 text-xs">{r.servings}</td>
                  <td className="px-4 py-2 text-xs">{r.caloriesPerServing}</td>
                  <td className="px-4 py-2 text-xs">
                    {new Date(r.updatedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/meal/recipes/${r.id}`}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(r)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <Modal title="Delete recipe" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Delete <strong>{deleteTarget.name}</strong>? This also removes it from any meal plans
            it was added to. This cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-sm hover:bg-[rgb(var(--border)/0.5)]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
