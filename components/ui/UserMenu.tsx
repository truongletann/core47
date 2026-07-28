"use client";

import { useEffect, useRef, useState } from "react";

interface MeUser {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}

function defaultAvatarUrl(nameOrEmail: string) {
  const label = encodeURIComponent(nameOrEmail || "U");
  return `https://ui-avatars.com/api/?name=${label}&background=0D7A82&color=fff&rounded=true`;
}

export function UserMenu({ homeUrl }: { homeUrl: string }) {
  const [user, setUser] = useState<MeUser | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://core47.xyz/api/auth/me", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { user?: MeUser | null } }>)
      .then((json) => setUser(json?.data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    function onAvatarUpdated() {
      setAvatarBroken(false);
      setAvatarVersion(Date.now());
    }
    window.addEventListener("core47:avatar-updated", onAvatarUpdated);
    return () => window.removeEventListener("core47:avatar-updated", onAvatarUpdated);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("https://core47.xyz/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.reload();
  }

  const base = homeUrl.replace(/\/$/, "");

  if (user === undefined) {
    return <div className="h-8 w-8 rounded-full bg-[rgb(var(--border))]" />;
  }

  if (!user) {
    const returnTo = typeof window !== "undefined" ? window.location.href : "";
    const loginHref = `${base}/login?returnTo=${encodeURIComponent(returnTo)}`;
    return (
      <a href={loginHref} className="font-data text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] transition-colors">
        Log in
      </a>
    );
  }

  const avatarSrc = avatarBroken
    ? defaultAvatarUrl(user.name || user.email)
    : `https://core47.xyz/api/avatar/${user.id}?v=${avatarVersion}`;

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setOpen((v) => !v)} className="block h-8 w-8 overflow-hidden rounded-full border border-[rgb(var(--border))]">
        <img
          src={avatarSrc}
          alt={user.email}
          onError={() => setAvatarBroken(true)}
          className="h-full w-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-lg">
          <div className="border-b border-[rgb(var(--border))] px-3 py-2">
            <p className="truncate text-xs font-medium text-[rgb(var(--fg))]">
              {user.name || user.email}
            </p>
            {user.isAdmin && (
              <span className="font-data text-[10px] text-[rgb(var(--accent))]">Admin</span>
            )}
          </div>
          <a
            href={`${base}/profile`}
            className="block px-3 py-2 text-sm text-[rgb(var(--fg))] hover:bg-[rgb(var(--accent)/0.06)]"
          >
            Settings
          </a>
          <button
            onClick={handleLogout}
            className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
