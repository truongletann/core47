"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Upload,
  Share2,
  Loader2,
} from "lucide-react";
import { BioPreview, type BioPreviewLink } from "@/components/bio/BioPreview";
import { BIO_THEME_CONFIG } from "@/lib/bio/themes";
import { SOCIAL_PLATFORMS } from "@/lib/bio/schema";
import type { BioTheme } from "@/lib/bio/themes";

interface Me {
  id: string;
  username: string | null;
  name: string | null;
}

interface EditorLink extends BioPreviewLink {
  isEnabled: boolean;
}

function normalizeLink(raw: BioPreviewLink & { isEnabled?: boolean | number }): EditorLink {
  return { ...raw, isEnabled: raw.isEnabled === undefined ? true : Boolean(raw.isEnabled) };
}

type ButtonStyle = "solid" | "outline" | "soft";

const THEME_KEYS = Object.keys(BIO_THEME_CONFIG) as BioTheme[];

export default function BioEditorPage() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Me | null>(null);

  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState<BioTheme>("sunset");
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>("solid");
  const [isPublished, setIsPublished] = useState(true);
  const [links, setLinks] = useState<EditorLink[]>([]);
  const [avatarVersion, setAvatarVersion] = useState(0);

  const [saving, setSaving] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const [newLinkKind, setNewLinkKind] = useState<"link" | "social">("link");
  const [newLinkPlatform, setNewLinkPlatform] = useState<(typeof SOCIAL_PLATFORMS)[number]>("website");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [addingLink, setAddingLink] = useState(false);

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { user?: Me | null } }>)
      .then((json) => {
        setMe(json?.data?.user ?? null);
        if (!json?.data?.user) {
          setLoading(false);
          return;
        }
        return fetch("/api/bio", { credentials: "include" })
          .then((r) => r.json() as Promise<{
            data?: {
              page?: { title: string; bio: string; theme: string; buttonStyle: string; isPublished: number };
              links?: (BioPreviewLink & { isEnabled: number })[];
            };
          }>)
          .then((json2) => {
            const page = json2?.data?.page;
            if (page) {
              setTitle(page.title);
              setBio(page.bio);
              setTheme((page.theme as BioTheme) || "sunset");
              setButtonStyle((page.buttonStyle as ButtonStyle) || "solid");
              setIsPublished(Boolean(page.isPublished));
            }
            setLinks((json2?.data?.links ?? []).map(normalizeLink));
          });
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSavePage() {
    setSaving(true);
    try {
      await fetch("/api/bio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, bio, theme, buttonStyle, isPublished }),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveUsername() {
    if (!usernameDraft.trim()) return;
    setUsernameSaving(true);
    setUsernameError(null);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: usernameDraft.trim() }),
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setUsernameError(json.error === "USERNAME_TAKEN" ? "That username is taken." : "Couldn't save username.");
        return;
      }
      setMe((prev) => (prev ? { ...prev, username: usernameDraft.trim() } : prev));
    } finally {
      setUsernameSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    await fetch("/api/auth/avatar", { method: "POST", credentials: "include", body: formData });
    setAvatarVersion((v) => v + 1);
  }

  async function handleAddLink() {
    if (!newLinkUrl.trim()) return;
    setAddingLink(true);
    try {
      const res = await fetch("/api/bio/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          kind: newLinkKind,
          platform: newLinkKind === "social" ? newLinkPlatform : undefined,
          title: newLinkKind === "link" ? newLinkTitle || undefined : undefined,
          url: newLinkUrl,
        }),
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: { link: BioPreviewLink & { isEnabled: number } };
      };
      if (json.success && json.data) {
        setLinks((prev) => [...prev, normalizeLink(json.data!.link)]);
        setNewLinkTitle("");
        setNewLinkUrl("");
      }
    } finally {
      setAddingLink(false);
    }
  }

  async function handleDeleteLink(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/bio/links/${id}`, { method: "DELETE", credentials: "include" });
  }

  async function handleToggleLink(link: EditorLink) {
    const nextEnabled = !link.isEnabled;
    setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, isEnabled: nextEnabled } : l)));
    await fetch(`/api/bio/links/${link.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isEnabled: nextEnabled }),
    });
  }

  function move(index: number, dir: -1 | 1) {
    setLinks((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      fetch("/api/bio/links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderedIds: next.map((l) => l.id) }),
      }).catch(() => {});
      return next;
    });
  }

  async function handleShare() {
    setSharing(true);
    try {
      const res = await fetch("/api/bio/share", { method: "POST", credentials: "include" });
      const json = (await res.json()) as { success: boolean; data?: { shortUrl: string }; error?: string };
      if (json.success && json.data) {
        setShareUrl(json.data.shortUrl);
      } else if (json.error === "USERNAME_REQUIRED") {
        setUsernameError("Set a username first, then share.");
      }
    } finally {
      setSharing(false);
    }
  }

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (loading) {
    return <main className="mx-auto max-w-6xl px-6 py-20 text-center text-[rgb(var(--muted))]">Loading...</main>;
  }

  if (!me) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Sign in to build your bio page</h1>
        <p className="mt-3 text-[rgb(var(--muted))]">
          Bio pages are tied to your core47.xyz account so your links stay yours.
        </p>
        <a
          href="https://core47.xyz/login"
          className="mt-6 inline-block rounded-lg bg-[rgb(var(--accent))] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Log in
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1fr_360px]">
      {/* Editor column */}
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Bio page editor</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            Everything auto-shows in the preview. Save when you're happy.
          </p>
        </div>

        {!me.username && (
          <div className="rounded-xl border border-amber-400/50 bg-amber-50 p-4 dark:bg-amber-950/30">
            <p className="text-sm font-semibold">Pick a username to publish your page</p>
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">
              Your public URL will be bio.core47.xyz/&lt;username&gt;
            </p>
            <div className="mt-3 flex gap-2">
              <input
                value={usernameDraft}
                onChange={(e) => setUsernameDraft(e.target.value)}
                placeholder="username"
                className="font-data flex-1 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={handleSaveUsername}
                disabled={usernameSaving}
                className="rounded-md bg-[rgb(var(--accent))] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {usernameSaving ? "Saving..." : "Save"}
              </button>
            </div>
            {usernameError && <p className="mt-2 text-xs text-red-600">{usernameError}</p>}
          </div>
        )}

        {/* Profile */}
        <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h2 className="font-display text-sm font-semibold">Profile</h2>
          <div className="mt-4 flex items-center gap-4">
            <img
              src={`/api/avatar/${me.id}?v=${avatarVersion}`}
              alt="avatar"
              className="h-16 w-16 rounded-full border border-[rgb(var(--border))] object-cover"
              onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")}
            />
            <label className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs font-semibold hover:bg-[rgb(var(--border)/0.5)]">
              <Upload size={13} /> Upload photo
              <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>

          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Display title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              placeholder={me.name ?? "Your name"}
              className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block text-[rgb(var(--muted))]">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={280}
              rows={3}
              className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
          </label>
        </section>

        {/* Theme */}
        <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h2 className="font-display text-sm font-semibold">Theme</h2>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {THEME_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`h-12 rounded-lg border-2 ${theme === key ? "border-[rgb(var(--accent))]" : "border-transparent"}`}
                style={{ background: BIO_THEME_CONFIG[key].background }}
                title={BIO_THEME_CONFIG[key].label}
              />
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            {(["solid", "outline", "soft"] as ButtonStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => setButtonStyle(s)}
                className={`rounded-md border px-3 py-1.5 text-xs font-semibold capitalize ${
                  buttonStyle === s
                    ? "border-[rgb(var(--accent))] text-[rgb(var(--accent))]"
                    : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--accent))]"
            />
            Published (visible to others)
          </label>

          <button
            onClick={handleSavePage}
            disabled={saving}
            className="mt-4 rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </section>

        {/* Links */}
        <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h2 className="font-display text-sm font-semibold">Links & socials</h2>

          <div className="mt-4 flex flex-col gap-2">
            {links.map((link, i) => (
              <div
                key={link.id}
                className="flex items-center gap-2 rounded-lg border border-[rgb(var(--border))] px-3 py-2"
              >
                <div className="flex flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-[rgb(var(--muted))] disabled:opacity-30">
                    <ArrowUp size={13} />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === links.length - 1} className="text-[rgb(var(--muted))] disabled:opacity-30">
                    <ArrowDown size={13} />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {link.kind === "social" ? `${link.platform} (social icon)` : link.title || link.url}
                  </p>
                  <p className="truncate text-xs text-[rgb(var(--muted))]">{link.url}</p>
                </div>
                <button
                  onClick={() => handleToggleLink(link)}
                  className="text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  title={link.isEnabled ? "Visible" : "Hidden"}
                >
                  {link.isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => handleDeleteLink(link.id)} className="text-[rgb(var(--muted))] hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {links.length === 0 && (
              <p className="py-4 text-center text-sm text-[rgb(var(--muted))]">No links yet — add one below.</p>
            )}
          </div>

          <div className="mt-5 rounded-lg border border-dashed border-[rgb(var(--border))] p-3">
            <div className="flex gap-2">
              <button
                onClick={() => setNewLinkKind("link")}
                className={`rounded-md px-2 py-1 text-xs font-semibold ${newLinkKind === "link" ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))]"}`}
              >
                Link
              </button>
              <button
                onClick={() => setNewLinkKind("social")}
                className={`rounded-md px-2 py-1 text-xs font-semibold ${newLinkKind === "social" ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))]"}`}
              >
                Social icon
              </button>
            </div>

            {newLinkKind === "social" && (
              <select
                value={newLinkPlatform}
                onChange={(e) => setNewLinkPlatform(e.target.value as (typeof SOCIAL_PLATFORMS)[number])}
                className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              >
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
            {newLinkKind === "link" && (
              <input
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="Label (optional)"
                className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
              />
            )}
            <input
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder="https://..."
              className="font-data mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={handleAddLink}
              disabled={addingLink || !newLinkUrl.trim()}
              className="mt-2 flex items-center gap-1.5 rounded-md bg-[rgb(var(--accent))] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            >
              <Plus size={13} /> {addingLink ? "Adding..." : "Add"}
            </button>
          </div>
        </section>

        {/* Share */}
        <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h2 className="font-display text-sm font-semibold">Share your page</h2>
          <p className="mt-1 text-xs text-[rgb(var(--muted))]">
            Get a short to2.site link that points at your published bio page.
          </p>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="mt-3 flex items-center gap-1.5 rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {sharing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
            {sharing ? "Generating..." : "Get share link"}
          </button>
          {shareUrl && (
            <div className="mt-3 flex items-center gap-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2">
              <span className="font-data flex-1 truncate text-sm text-[rgb(var(--accent))]">{shareUrl}</span>
              <button onClick={handleCopy} className="text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Live preview column */}
      <div className="lg:sticky lg:top-6 lg:h-fit">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">Live preview</p>
        <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[2rem] border-4 border-[rgb(var(--border))] shadow-xl" style={{ aspectRatio: "9 / 18" }}>
          <div className="h-full overflow-y-auto">
            <BioPreview
              avatarUrl={`/api/avatar/${me.id}?v=${avatarVersion}`}
              name={me.name}
              title={title}
              bio={bio}
              theme={theme}
              buttonStyle={buttonStyle}
              links={links.filter((l) => l.isEnabled)}
              interactive={false}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
