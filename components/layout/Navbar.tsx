"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/ui/LogoMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/ui/UserMenu";
import { cn } from "@/lib/utils/cn";

const ROOT_DOMAIN = "core47.xyz";

export function Navbar({ isAdminArea = false }: { isAdminArea?: boolean }) {
  const [homeUrl, setHomeUrl] = useState("/");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOnRoot, setIsOnRoot] = useState(false);
  const [isOnAdminSubdomain, setIsOnAdminSubdomain] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const { hostname, protocol, port } = window.location;
    const isAlreadyOnRoot =
      hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}` || hostname === "localhost";
    setIsOnRoot(isAlreadyOnRoot);
    setIsOnAdminSubdomain(hostname === `admin.${ROOT_DOMAIN}`);

    if (!isAlreadyOnRoot) {
      const portSuffix = port ? `:${port}` : "";
      setHomeUrl(`${protocol}//${ROOT_DOMAIN}${portSuffix}/`);
    }
  }, []);

  const isBlogActive = isOnRoot && pathname.startsWith("/blog");
  const isBucketListActive = isOnRoot && pathname.startsWith("/bucket-list");
  const isMarketActive = isOnRoot && pathname.startsWith("/market");

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

        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="font-data hidden items-center gap-6 text-sm text-[rgb(var(--muted))] sm:flex">
            <a
              href={homeUrl.replace(/\/$/, "") + "/blog"}
              className={cn(
                "hover:text-[rgb(var(--fg))] transition-colors",
                isBlogActive && "text-[rgb(var(--fg))]",
              )}
            >
              Blog
            </a>
            <a
              href={homeUrl.replace(/\/$/, "") + "/bucket-list"}
              className={cn(
                "hover:text-[rgb(var(--fg))] transition-colors",
                isBucketListActive && "text-[rgb(var(--fg))]",
              )}
            >
              Bucket List
            </a>
            <a
              href={homeUrl.replace(/\/$/, "") + "/market"}
              className={cn(
                "hover:text-[rgb(var(--fg))] transition-colors",
                isMarketActive && "text-[rgb(var(--fg))]",
              )}
            >
              Market
            </a>
            {isAdmin && (
              <a
                href="https://admin.core47.xyz/"
                className={cn(
                  "transition-opacity hover:opacity-80",
                  isOnAdminSubdomain
                    ? "text-[rgb(var(--accent))]"
                    : "text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))]",
                )}
              >
                Admin
              </a>
            )}
          </nav>
          <UserMenu homeUrl={homeUrl} />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex items-center justify-center rounded-md p-1.5 text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)] sm:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="font-data flex flex-col gap-1 border-t border-[rgb(var(--border))] px-6 py-3 text-sm text-[rgb(var(--muted))] sm:hidden">
          <a
            href={homeUrl.replace(/\/$/, "") + "/blog"}
            className={cn(
              "rounded-md px-2 py-2 hover:bg-[rgb(var(--border)/0.5)] hover:text-[rgb(var(--fg))]",
              isBlogActive && "text-[rgb(var(--fg))]",
            )}
          >
            Blog
          </a>
          <a
            href={homeUrl.replace(/\/$/, "") + "/bucket-list"}
            className={cn(
              "rounded-md px-2 py-2 hover:bg-[rgb(var(--border)/0.5)] hover:text-[rgb(var(--fg))]",
              isBucketListActive && "text-[rgb(var(--fg))]",
            )}
          >
            Bucket List
          </a>
          <a
            href={homeUrl.replace(/\/$/, "") + "/market"}
            className={cn(
              "rounded-md px-2 py-2 hover:bg-[rgb(var(--border)/0.5)] hover:text-[rgb(var(--fg))]",
              isMarketActive && "text-[rgb(var(--fg))]",
            )}
          >
            Market
          </a>
          {isAdmin && (
            <a
              href="https://admin.core47.xyz/"
              className={cn(
                "rounded-md px-2 py-2 hover:opacity-80",
                isOnAdminSubdomain ? "text-[rgb(var(--accent))]" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))]",
              )}
            >
              Admin
            </a>
          )}
        </nav>
      )}
    </header>
  );
}