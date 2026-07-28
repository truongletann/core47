"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface AdminUser {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  isAdmin: boolean;
  isDisabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/users", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { users?: AdminUser[] } }>)
      .then((json) => setUsers(json?.data?.users ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleToggle() {
    if (!confirmTarget) return;
    setError(null);
    const res = await fetch(`/api/admin/users/${confirmTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDisabled: !confirmTarget.isDisabled }),
      credentials: "include",
    });
    const json = (await res.json()) as { success: boolean; error?: string };
    if (!json.success) {
      setError(
        json.error === "CANNOT_DISABLE_SELF" ? "You cannot disable your own account." : "Failed.",
      );
      return;
    }
    setConfirmTarget(null);
    load();
  }

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-semibold">Users</h1>

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Last login</th>
              <th className="px-4 py-2">Joined</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  Loading...
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="font-data px-4 py-2 text-xs">{u.username ?? "—"}</td>
                  <td className="px-4 py-2">{u.name ?? "—"}</td>
                  <td className="px-4 py-2">
                    {u.isAdmin && (
                      <span className="font-data rounded bg-[rgb(var(--accent)/0.1)] px-1.5 py-0.5 text-[10px] text-[rgb(var(--accent))]">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {u.isDisabled ? (
                      <span className="font-data text-[11px] text-red-600">Disabled</span>
                    ) : (
                      <span className="font-data text-[11px] text-[rgb(var(--accent))]">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {u.lastLoginAt ? timeAgo(u.lastLoginAt) : "Never"}
                  </td>
                  <td className="px-4 py-2 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setConfirmTarget(u)}
                      className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                    >
                      {u.isDisabled ? "Enable" : "Disable"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {confirmTarget && (
        <Modal title="Confirm" onClose={() => setConfirmTarget(null)}>
          <p className="text-sm">
            {confirmTarget.isDisabled ? "Re-enable" : "Disable"} account{" "}
            <strong>{confirmTarget.email}</strong>?
          </p>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setConfirmTarget(null)}
              className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-sm hover:bg-[rgb(var(--border)/0.5)]"
            >
              Cancel
            </button>
            <button
              onClick={handleToggle}
              className="rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
