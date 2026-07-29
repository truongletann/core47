"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface List100Item {
  id: string;
  rank: number;
  title: string;
  note: string | null;
  link: string | null;
  isDone: boolean;
  isPublic: boolean;
}

interface Suggestion {
  id: string;
  name: string | null;
  content: string;
  createdAt: string;
}

const emptyForm = {
  rank: "1",
  title: "",
  note: "",
  link: "",
  isDone: false,
  isPublic: true,
};

type FormState = typeof emptyForm;

function List100Form({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[100px_1fr] gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">#</span>
          <input
            type="number"
            min={1}
            max={100}
            value={form.rank}
            onChange={(e) => setForm({ ...form, rank: e.target.value })}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Điều muốn làm</span>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="vd: Học tiếng Tây Ban Nha"
            autoComplete="off"
            maxLength={280}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Ghi chú (tuỳ chọn, hiện trong ngoặc)</span>
        <input
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="vd: đã làm ở 3 nước: VN, Ấn Độ, Mỹ"
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Link tham khảo (tuỳ chọn)</span>
        <input
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          placeholder="https://..."
          className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isDone}
            onChange={(e) => setForm({ ...form, isDone: e.target.checked })}
          />
          <span>Đã hoàn thành</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
          />
          <span>Hiện công khai trên trang List 100</span>
        </label>
      </div>
    </div>
  );
}

export default function AdminList100Page() {
  const [items, setItems] = useState<List100Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<List100Item | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<List100Item | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [approvingSuggestionId, setApprovingSuggestionId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/list100", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { items?: List100Item[] } }>)
      .then((json) => setItems(json?.data?.items ?? []))
      .finally(() => setLoading(false));
  }

  function loadSuggestions() {
    fetch("/api/admin/list100/suggestions", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { suggestions?: Suggestion[] } }>)
      .then((json) => setSuggestions(json?.data?.suggestions ?? []));
  }

  useEffect(() => {
    load();
    loadSuggestions();
  }, []);

  function openCreate() {
    const nextRank = items.length > 0 ? Math.max(...items.map((i) => i.rank)) + 1 : 1;
    setForm({ ...emptyForm, rank: String(Math.min(nextRank, 100)) });
    setApprovingSuggestionId(null);
    setError(null);
    setCreating(true);
  }

  function openApprove(s: Suggestion) {
    const nextRank = items.length > 0 ? Math.max(...items.map((i) => i.rank)) + 1 : 1;
    setForm({ ...emptyForm, rank: String(Math.min(nextRank, 100)), title: s.content.slice(0, 280) });
    setApprovingSuggestionId(s.id);
    setError(null);
    setCreating(true);
  }

  async function handleRejectSuggestion(id: string) {
    await fetch(`/api/admin/list100/suggestions/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    loadSuggestions();
  }

  function openEdit(i: List100Item) {
    setForm({
      rank: String(i.rank),
      title: i.title,
      note: i.note ?? "",
      link: i.link ?? "",
      isDone: i.isDone,
      isPublic: i.isPublic,
    });
    setError(null);
    setEditing(i);
  }

  const fieldLabel: Record<string, string> = {
    rank: "Số thứ tự",
    title: "Điều muốn làm",
    note: "Ghi chú",
    link: "Link tham khảo",
  };

  function errorMessage(json: { error?: string; issues?: { path: string; message: string }[] }) {
    if (json.error === "INVALID_INPUT" && json.issues?.length) {
      return json.issues
        .map((i) => `${fieldLabel[i.path] ?? i.path}: ${i.message}`)
        .join(" · ");
    }
    return "Đã có lỗi xảy ra.";
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/list100", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        issues?: { path: string; message: string }[];
      };
      if (!json.success) {
        setError(errorMessage(json));
        return;
      }
      if (approvingSuggestionId) {
        await fetch(`/api/admin/list100/suggestions/${approvingSuggestionId}`, {
          method: "DELETE",
          credentials: "include",
        });
        setApprovingSuggestionId(null);
        loadSuggestions();
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
      const res = await fetch(`/api/admin/list100/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        issues?: { path: string; message: string }[];
      };
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
    await fetch(`/api/admin/list100/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">List 100</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Thêm mục
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mb-6 rounded-xl border border-[rgb(var(--border))]">
          <div className="border-b border-[rgb(var(--border))] px-4 py-2.5">
            <h2 className="text-sm font-semibold">
              Góp ý chờ duyệt{" "}
              <span className="font-data text-xs font-normal text-[rgb(var(--muted))]">
                ({suggestions.length})
              </span>
            </h2>
          </div>
          <ul className="divide-y divide-[rgb(var(--border))]">
            {suggestions.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="min-w-0 flex-1 text-sm">
                  <p>{s.content}</p>
                  <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                    {s.name ? `Gửi bởi ${s.name}` : "Ẩn danh"} ·{" "}
                    {new Date(s.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => openApprove(s)}
                    className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => handleRejectSuggestion(s.id)}
                    className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Từ chối
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Điều muốn làm</th>
              <th className="px-4 py-2">Xong?</th>
              <th className="px-4 py-2">Công khai</th>
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
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  Chưa có mục nào.
                </td>
              </tr>
            ) : (
              items.map((i) => (
                <tr key={i.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="font-data px-4 py-2 text-xs">{i.rank}</td>
                  <td className="px-4 py-2">
                    {i.title}
                    {i.note && <span className="text-[rgb(var(--muted))]"> ({i.note})</span>}
                  </td>
                  <td className="px-4 py-2 text-xs">{i.isDone ? "✓" : "✗"}</td>
                  <td className="px-4 py-2 text-xs">{i.isPublic ? "Có" : "Ẩn"}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(i)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(i)}
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
        <Modal
          title={approvingSuggestionId ? "Duyệt góp ý → Thêm mục List 100" : "Thêm mục List 100"}
          onClose={() => {
            setCreating(false);
            setApprovingSuggestionId(null);
          }}
        >
          <List100Form form={form} setForm={setForm} />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={saving || !form.title}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : approvingSuggestionId ? "Duyệt & tạo mục" : "Create"}
          </button>
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit: ${editing.title}`} onClose={() => setEditing(null)}>
          <List100Form form={form} setForm={setForm} />
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
        <Modal title="Delete item" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Delete <strong>{deleteTarget.title}</strong>? This cannot be undone.
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
