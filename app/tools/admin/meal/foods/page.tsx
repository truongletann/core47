"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface Food {
  id: string;
  name: string;
  category: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbPer100g: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  thit: "Thịt",
  hai_san: "Hải sản",
  rau_cu_qua: "Rau củ quả",
  tinh_bot: "Tinh bột",
  khac: "Khác",
};

const emptyForm = {
  name: "",
  category: "khac",
  caloriesPer100g: "0",
  proteinPer100g: "0",
  fatPer100g: "0",
  carbPer100g: "0",
};
type FormState = typeof emptyForm;

function FoodForm({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
  const inputClass =
    "w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none";
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Tên nguyên liệu</span>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Thịt heo (nạc)"
          className={inputClass}
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Nhóm nguyên liệu</span>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={inputClass}
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Kcal/100g</span>
          <input
            type="number"
            min={0}
            value={form.caloriesPer100g}
            onChange={(e) => setForm({ ...form, caloriesPer100g: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Đạm/100g (g)</span>
          <input
            type="number"
            min={0}
            value={form.proteinPer100g}
            onChange={(e) => setForm({ ...form, proteinPer100g: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Béo/100g (g)</span>
          <input
            type="number"
            min={0}
            value={form.fatPer100g}
            onChange={(e) => setForm({ ...form, fatPer100g: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Tinh bột/100g (g)</span>
          <input
            type="number"
            min={0}
            value={form.carbPer100g}
            onChange={(e) => setForm({ ...form, carbPer100g: e.target.value })}
            className={inputClass}
          />
        </label>
      </div>
    </div>
  );
}

export default function AdminMealFoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Food | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Food | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/admin/meal/foods", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { foods?: Food[] } }>)
      .then((json) => setFoods(json?.data?.foods ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setError(null);
    setCreating(true);
  }

  function openEdit(f: Food) {
    setForm({
      name: f.name,
      category: f.category,
      caloriesPer100g: String(f.caloriesPer100g),
      proteinPer100g: String(f.proteinPer100g),
      fatPer100g: String(f.fatPer100g),
      carbPer100g: String(f.carbPer100g),
    });
    setError(null);
    setEditing(f);
  }

  function errorMessage(json: { error?: string; issues?: { path: string; message: string }[] }) {
    if (json.error === "INVALID_INPUT" && json.issues?.length) {
      return json.issues.map((i) => `${i.path}: ${i.message}`).join(" · ");
    }
    return "Something went wrong.";
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/meal/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string; issues?: { path: string; message: string }[] };
      if (!json.success) {
        setError(errorMessage(json));
        return;
      }
      setCreating(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/meal/foods/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string; issues?: { path: string; message: string }[] };
      if (!json.success) {
        setError(errorMessage(json));
        return;
      }
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/meal/foods/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Meal: Foods (nutrition reference)</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add food
        </button>
      </div>
      <p className="mb-4 text-xs text-[rgb(var(--muted))]">
        Dinh dưỡng tính trên 100g, dùng để liên kết vào nguyên liệu công thức — giúp tính calo/macro
        từng nguyên liệu và tìm món ăn theo nguyên liệu.
      </p>

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Kcal/100g</th>
              <th className="px-4 py-2">Protein/100g</th>
              <th className="px-4 py-2">Fat/100g</th>
              <th className="px-4 py-2">Carb/100g</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  Loading...
                </td>
              </tr>
            ) : foods.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  No foods yet.
                </td>
              </tr>
            ) : (
              foods.map((f) => (
                <tr key={f.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="px-4 py-2">{f.name}</td>
                  <td className="px-4 py-2 text-xs">{CATEGORY_LABELS[f.category] ?? f.category}</td>
                  <td className="px-4 py-2 text-xs">{f.caloriesPer100g}</td>
                  <td className="px-4 py-2 text-xs">{f.proteinPer100g}</td>
                  <td className="px-4 py-2 text-xs">{f.fatPer100g}</td>
                  <td className="px-4 py-2 text-xs">{f.carbPer100g}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(f)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(f)}
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

      {creating && (
        <Modal title="Add food" onClose={() => setCreating(false)}>
          <FoodForm form={form} setForm={setForm} />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={saving || !form.name}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit: ${editing.name}`} onClose={() => setEditing(null)}>
          <FoodForm form={form} setForm={setForm} />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete food" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Delete <strong>{deleteTarget.name}</strong>? Recipe ingredients linked to it will keep
            their name/quantity but lose the nutrition link.
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
