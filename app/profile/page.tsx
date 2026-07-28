"use client";

import { useEffect, useRef, useState } from "react";

interface MeUser {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  isAdmin: boolean;
}

type Section = "profile" | "security";

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
];

export default function ProfilePage() {
  const [section, setSection] = useState<Section>("profile");
  const [user, setUser] = useState<MeUser | null | undefined>(undefined);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { user?: MeUser | null } }>)
      .then((json) => {
        const u = json?.data?.user ?? null;
        setUser(u);
        if (u) {
          setName(u.name || "");
          setUsername(u.username || "");
        } else {
          window.location.href = "/login";
        }
      });
  }, []);

  async function handleSaveProfile() {
    setSaving(true);
    setSaved(false);
    setProfileError(null);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username }),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setProfileError(
          json.error === "USERNAME_TAKEN"
            ? "This username is already taken."
            : "Something went wrong, try again.",
        );
        return;
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch("/api/auth/avatar", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setAvatarError(
          json.error === "TOO_LARGE"
            ? "Image must be under 2MB."
            : json.error === "INVALID_TYPE"
              ? "Only PNG, JPEG or WEBP images are allowed."
              : "Upload failed, try again.",
        );
        return;
      }
      setAvatarVersion(Date.now());
      window.dispatchEvent(new CustomEvent("core47:avatar-updated"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleChangePassword() {
    setPwError(null);
    setPwSaved(false);
    setPwSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) {
        setPwError(
          json.error === "WRONG_CURRENT_PASSWORD"
            ? "Current password is incorrect."
            : "Something went wrong, try again.",
        );
        return;
      }
      setPwSaved(true);
      setCurrentPassword("");
      setNewPassword("");
    } finally {
      setPwSaving(false);
    }
  }

  if (user === undefined) return null;
  if (!user) return null;

  const avatarSrc = `https://core47.xyz/api/avatar/${user.id}?v=${avatarVersion}`;

  return (
    <main className="mx-auto flex max-w-6xl gap-8 px-6 py-16">
      <nav className="w-40 shrink-0">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-[rgb(var(--muted))]">
          Settings
        </p>
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setSection(item.id)}
                className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
                  section === item.id
                    ? "bg-[rgb(var(--accent)/0.1)] font-medium text-[rgb(var(--accent))]"
                    : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)]"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 flex-1">
        {section === "profile" && (
          <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))]">
            <h2 className="font-display border-b border-[rgb(var(--border))] px-4 py-3 text-sm font-semibold">
              Profile
            </h2>

            <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3">
              <span className="text-sm">Avatar</span>
              <div className="flex items-center gap-3">
                <img
                  key={avatarVersion}
                  src={avatarSrc}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                  alt=""
                  className="h-10 w-10 rounded-full border border-[rgb(var(--border))] object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-xs font-medium hover:bg-[rgb(var(--accent)/0.06)] disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Change"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
            {avatarError && (
              <p className="border-b border-[rgb(var(--border))] px-4 py-2 text-xs text-red-600">
                {avatarError}
              </p>
            )}

            <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3">
              <span className="text-sm">Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-56 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5 text-right text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
              />
            </div>

            <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3">
              <span className="text-sm">Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="font-data w-56 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5 text-right text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
              />
            </div>

            <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3">
              <span className="text-sm">Email</span>
              <span className="font-data text-sm text-[rgb(var(--muted))]">{user.email}</span>
            </div>

            <div className="px-4 py-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
              {profileError && <p className="mt-2 text-xs text-red-600">{profileError}</p>}
              {saved && !saving && !profileError && (
                <p className="mt-2 text-xs text-[rgb(var(--accent))]">Saved.</p>
              )}
            </div>
          </div>
        )}

        {section === "security" && (
          <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))]">
            <h2 className="font-display border-b border-[rgb(var(--border))] px-4 py-3 text-sm font-semibold">
              Change password
            </h2>
            <div className="flex flex-col gap-3 px-4 py-4">
              <label className="text-sm">
                <span className="mb-1 block text-[rgb(var(--muted))]">Current password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-[rgb(var(--muted))]">New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
                />
              </label>
              {pwError && <p className="text-sm text-red-600">{pwError}</p>}
              {pwSaved && <p className="text-sm text-[rgb(var(--accent))]">Password updated.</p>}
              <button
                onClick={handleChangePassword}
                disabled={pwSaving || !currentPassword || newPassword.length < 8}
                className="mt-1 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {pwSaving ? "Saving..." : "Update password"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}