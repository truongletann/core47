"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/ui/LogoMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/ui/UserMenu";
import { cn } from "@/lib/utils/cn";

const ROOT_DOMAIN = "core47.xyz";

export function Navbar({ isAdminArea = false }: { isAdminArea?: boolean }) {
  const [homeUrl, setHomeUrl] = useState("/");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { hostname, protocol, port } = window.location;
    const isAlreadyOnRoot =
      hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}` || hostname === "localhost";

    if (!isAlreadyOnRoot) {
      const portSuffix = port ? `:${port}` : "";
      setHomeUrl(`${protocol}//${ROOT_DOMAIN}${portSuffix}/`);
    }
  }, []);

  useEffect(() => {
    fetch("https://core47.xyz/api/auth/me", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { user?: { isAdmin?: boolean } | null } }>)
      .then((json) => setIsAdmin(Boolean(json?.data?.user?.isAdmin)))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg)/0.8)] backdrop-blur-md">
      <div
        className={cn(
          "mx-auto flex h-14 items-center justify-between px-6",
          isAdminArea ? "max-w-none" : "max-w-7xl",
        )}
      >
        <a href={homeUrl}>
          <LogoMark />
        </a>

        <div className="flex items-center gap-6">
          <nav className="font-data flex items-center gap-6 text-sm text-[rgb(var(--muted))]">
            <a href={homeUrl.replace(/\/$/, "") + "/blog"} className="hover:text-[rgb(var(--fg))] transition-colors">
              Blog
            </a>
            <a href={homeUrl.replace(/\/$/, "") + "/list100"} className="hover:text-[rgb(var(--fg))] transition-colors">
              List 100
            </a>
            <a href={homeUrl.replace(/\/$/, "") + "/market"} className="hover:text-[rgb(var(--fg))] transition-colors">
              Market
            </a>
            {isAdmin && (
              <a
                href="https://admin.core47.xyz/"
                className="text-[rgb(var(--accent))] hover:opacity-80 transition-opacity"
              >
                Admin
              </a>
            )}
          </nav>
          <UserMenu homeUrl={homeUrl} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}