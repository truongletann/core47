"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/ui/LogoMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/ui/UserMenu";

const ROOT_DOMAIN = "core47.xyz";

export function Navbar() {
  const [homeUrl, setHomeUrl] = useState("/");

  useEffect(() => {
    const { hostname, protocol, port } = window.location;
    const isAlreadyOnRoot =
      hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}` || hostname === "localhost";

    if (!isAlreadyOnRoot) {
      const portSuffix = port ? `:${port}` : "";
      setHomeUrl(`${protocol}//${ROOT_DOMAIN}${portSuffix}/`);
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg)/0.8)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href={homeUrl}>
          <LogoMark />
        </a>

        <div className="flex items-center gap-6">
          <nav className="font-data flex items-center gap-6 text-sm text-[rgb(var(--muted))]">
            <a href={homeUrl.replace(/\/$/, "") + "/blog"} className="hover:text-[rgb(var(--fg))] transition-colors">
              Blog
            </a>
            <a href={homeUrl.replace(/\/$/, "") + "/toolkits"} className="hover:text-[rgb(var(--fg))] transition-colors">
              List 100
            </a>
          </nav>
          <UserMenu homeUrl={homeUrl} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
