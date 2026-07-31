"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface List100Item {
  id: string;
  rank: number;
  title: string;
  note: string | null;
  link: string | null;
  isDone: boolean;
  progressCurrent: number | null;
  progressTarget: number | null;
  isPinnedEnd: boolean;
  isPublic: boolean;
  suggestedBy: string | null;
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
  progressCurrent: "",
  progressTarget: "",
  isPinnedEnd: false,
  isPublic: true,
  suggestedBy: "",
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
            value={form.rank}
            onChange={(e) => setForm({ ...form, rank: e.target.value })}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Thing to do</span>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Learn Spanish"
            autoComplete="off"
            maxLength={280}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>
      {form.suggestedBy && (
        <p className="text-xs text-[rgb(var(--muted))]">
          Suggested by <strong>{form.suggestedBy}</strong> — admin-only.
        </p>
      )}
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Note (optional, shown in parentheses)</span>
        <input
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="e.g. done this in 3 countries: US, India, Vietnam"
          maxLength={300}
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Reference link (optional)</span>
        <input
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          placeholder="https://..."
          maxLength={500}
          className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Progress (optional)</span>
          <input
            type="number"
            min={0}
            value={form.progressCurrent}
            onChange={(e) => setForm({ ...form, progressCurrent: e.target.value })}
            placeholder="e.g. 320"
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Target (optional)</span>
          <input
            type="number"
            min={0}
            value={form.progressTarget}
            onChange={(e) => setForm({ ...form, progressTarget: e.target.value })}
            placeholder="e.g. 1000"
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>
      <p className="-mt-1 text-xs text-[rgb(var(--muted))]">
        For countable goals (e.g. "Read 1000 books") — leave both blank to just use the Done checkbox.
      </p>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isDone}
            onChange={(e) => setForm({ ...form, isDone: e.target.checked })}
          />
          <span>Done</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
          />
          <span>Show publicly on the Bucket List page</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPinnedEnd}
            onChange={(e) => setForm({ ...form, isPinnedEnd: e.target.checked })}
          />
          <span>Pin to the end of the list (e.g. closing lines)</span>
        </label>
      </div>
    </div>
  );
}

export default function AdminBucketListPage() {
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
    setForm({ ...emptyForm, rank: String(nextRank) });
    setApprovingSuggestionId(null);
    setError(null);
    setCreating(true);
  }

  function openApprove(s: Suggestion) {
    const nextRank = items.length > 0 ? Math.max(...items.map((i) => i.rank)) + 1 : 1;
    setForm({
      ...emptyForm,
      rank: String(nextRank),
      title: s.content.slice(0, 280),
      suggestedBy: s.name ?? "",
    });
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
      progressCurrent: i.progressCurrent === null ? "" : String(i.progressCurrent),
      progressTarget: i.progressTarget === null ? "" : String(i.progressTarget),
      isPinnedEnd: i.isPinnedEnd,
      isPublic: i.isPublic,
      suggestedBy: i.suggestedBy ?? "",
    });
    setError(null);
    setEditing(i);
  }

  async function moveRank(index: number, direction: -1 | 1) {
    const otherIndex = index + direction;
    if (otherIndex < 0 || otherIndex >= items.length) return;
    await fetch("/api/admin/list100/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idA: items[index].id, idB: items[otherIndex].id }),
      credentials: "include",
    });
    load();
  }

  const fieldLabel: Record<string, string> = {
    rank: "Rank",
    title: "Thing to do",
    note: "Note",
    link: "Reference link",
    progressCurrent: "Progress",
    progressTarget: "Target",
  };

  function errorMessage(json: {
    error?: string;
    issues?: { path: string; message: string }[];
    message?: string;
  }) {
    if (json.error === "INVALID_INPUT" && json.issues?.length) {
      return json.issues
        .map((i) => `${fieldLabel[i.path] ?? i.path}: ${i.message}`)
        .join(" · ");
    }
    if (json.error === "SERVER_ERROR" && json.message) {
      return `Server error: ${json.message}`;
    }
    return "Something went wrong.";
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
        message?: string;
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
        message?: string;
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
        <h1 className="font-display text-2xl font-semibold">Bucket List</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add item
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mb-6 rounded-xl border border-[rgb(var(--border))]">
          <div className="border-b border-[rgb(var(--border))] px-4 py-2.5">
            <h2 className="text-sm font-semibold">
              Suggestions pending review{" "}
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
                    {s.name ? `From ${s.name}` : "Anonymous"} ·{" "}
                    {new Date(s.createdAt).toLocaleDateString("en-US")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => openApprove(s)}
                    className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectSuggestion(s.id)}
                    className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Reject
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
              <th className="px-4 py-2">Thing to do</th>
              <th className="px-4 py-2">Done?</th>
              <th className="px-4 py-2">Public</th>
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
                  No items yet.
                </td>
              </tr>
            ) : (
              items.map((i, index) => (
                <tr key={i.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex flex-col">
                        <button
                          onClick={() => moveRank(index, -1)}
                          disabled={index === 0}
                          aria-label="Move up"
                          className="text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] disabled:opacity-25"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => moveRank(index, 1)}
                          disabled={index === items.length - 1}
                          aria-label="Move down"
                          className="text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] disabled:opacity-25"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                      <span className="font-data text-xs">{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {i.isPinnedEnd && (
                      <span className="mr-1.5 rounded-md border border-[rgb(var(--border))] px-1 py-0.5 text-[10px] text-[rgb(var(--muted))]">
                        Pinned
                      </span>
                    )}
                    {i.title}
                    {i.note && <span className="text-[rgb(var(--muted))]"> ({i.note})</span>}
                    {i.suggestedBy && (
                      <span className="mt-0.5 block text-[10px] text-[rgb(var(--muted))]">
                        Suggested by {i.suggestedBy}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {i.progressTarget ? `${i.progressCurrent ?? 0}/${i.progressTarget}` : i.isDone ? "✓" : "✗"}
                  </td>
                  <td className="px-4 py-2 text-xs">{i.isPublic ? "Yes" : "Hidden"}</td>
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
          title={approvingSuggestionId ? "Approve suggestion → Add to Bucket List" : "Add item to Bucket List"}
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
            {saving ? "Saving..." : approvingSuggestionId ? "Approve & create" : "Create"}
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
