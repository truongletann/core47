"use client";

import { useEffect, useState } from "react";

interface MeUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
}

interface HistoryLink {
  code: string;
  targetUrl: string;
  clicks: number;
  createdAt: string;
  creatorEmail: string | null;
}

function defaultAvatarUrl(nameOrEmail: string) {
  const label = encodeURIComponent(nameOrEmail || "U");
  return `https://ui-avatars.com/api/?name=${label}&background=0D7A82&color=fff&rounded=true`;
}

export default function ProfilePage() {
  const [tab, setTab] = useState<"account" | "history">("account");
  const [user, setUser] = useState<MeUser | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [links, setLinks] = useState<HistoryLink[]>([]);
  const [shortDomain, setShortDomain] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { user?: MeUser | null } }>)
      .then((json) => {
        const u = json?.data?.user ?? null;
        setUser(u);
        if (u) {
          setName(u.name || "");
          setAvatarUrl(u.avatarUrl || "");
        } else {
          window.location.href = "/login";
        }
      });
  }, []);

  useEffect(() => {
    if (tab !== "history") return;
    setLoadingHistory(true);
    fetch("https://shortlink.core47.xyz/api/shortlink/my", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { links?: HistoryLink[]; shortDomain?: string } }>)
      .then((json) => {
        setLinks(json?.data?.links ?? []);
        setShortDomain(json?.data?.shortDomain ?? "");
      })
      .finally(() => setLoadingHistory(false));
  }, [tab]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatarUrl }),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; data?: { user: MeUser } };
      if (json.success && json.data) {
        setUser(json.data.user);
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  if (user === undefined) return null;
  if (!user) return null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-6 flex items-center gap-4">
        <img
          src={avatarUrl || defaultAvatarUrl(name || user.email)}
          alt={user.email}
          className="h-14 w-14 rounded-full border border-[rgb(var(--border))] object-cover"
        />
        <div>
          <h1 className="font-display text-xl font-semibold">{name || user.email}</h1>
          <p className="text-sm text-[rgb(var(--muted))]">{user.email}</p>
        </div>
      </div>

      <div className="flex border-b border-[rgb(var(--border))]">
        <button
          onClick={() => setTab("account")}
          className={`px-4 py-2 text-sm ${tab === "account" ? "border-b-2 border-[rgb(var(--accent))] font-semibold text-[rgb(var(--fg))]" : "text-[rgb(var(--muted))]"}`}
        >
          Account
        </button>
        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 text-sm ${tab === "history" ? "border-b-2 border-[rgb(var(--accent))] font-semibold text-[rgb(var(--fg))]" : "text-[rgb(var(--muted))]"}`}
        >
          History
        </button>
      </div>

      {tab === "account" && (
        <div className="mt-6 flex flex-col gap-3">
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Display name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Avatar image URL</span>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="font-data w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            />
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-2 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          {saved && <p className="text-sm text-[rgb(var(--accent))]">Saved.</p>}
        </div>
      )}

      {tab === "history" && (
        <div className="mt-6 overflow-hidden rounded-xl border border-[rgb(var(--border))]">
          {loadingHistory ? (
            <p className="p-6 text-center text-sm text-[rgb(var(--muted))]">Loading...</p>
          ) : links.length === 0 ? (
            <p className="p-6 text-center text-sm text-[rgb(var(--muted))]">No links yet.</p>
          ) : (
            links.map((link) => (
              <div
                key={link.code}
                className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-data text-sm text-[rgb(var(--accent))]">
                    {shortDomain}/{link.code}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[rgb(var(--muted))]">
                    {link.targetUrl}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[rgb(var(--muted))]">
                    By {link.creatorEmail ?? "guest"} · {new Date(link.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="font-data shrink-0 text-xs text-[rgb(var(--muted))]">
                  {link.clicks} clicks
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
