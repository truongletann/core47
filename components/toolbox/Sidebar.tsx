"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp, Home, Menu, Star, X } from "lucide-react";
import { TOOLBOX_CATEGORIES, TOOLBOX_TOOLS } from "@/lib/toolbox/registry";
import { DynamicIcon as Icon } from "@/components/toolbox/DynamicIcon";

export function ToolboxSidebar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function load() {
      fetch("/api/toolbox/favorites", { credentials: "include" })
        .then((r) => r.json() as Promise<{ data?: { slugs?: string[] } }>)
        .then((json) => setFavoriteSlugs(json?.data?.slugs ?? []))
        .catch(() => {});
    }
    load();
    window.addEventListener("core47:favorites-updated", load);
    return () => window.removeEventListener("core47:favorites-updated", load);
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function toggleCollapsed(slug: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  const filtered = TOOLBOX_TOOLS.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()),
  );
  const favoriteTools = filtered.filter((t) => favoriteSlugs.includes(t.slug));

  return (
    <nav className="w-full shrink-0 md:w-64">
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="mb-3 flex w-full items-center justify-between rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm font-medium md:hidden"
      >
        <span className="flex items-center gap-2">
          <Menu size={16} />
          Danh mục công cụ
        </span>
        {mobileOpen ? <X size={16} /> : <ChevronDown size={16} />}
      </button>

      <div className={`${mobileOpen ? "block" : "hidden"} md:block`}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tools..."
        className="mb-4 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
      />

      <Link
        href="/"
        className={`mb-3 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
          pathname === "/"
            ? "bg-[rgb(var(--accent)/0.1)] font-medium text-[rgb(var(--accent))]"
            : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)]"
        }`}
      >
        <Home size={15} />
        All tools
      </Link>

      {favoriteTools.length > 0 && (
        <div className="mb-1">
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-[rgb(var(--fg))]">
            <Star size={15} />
            Favorites
          </div>
          <ul className="mt-0.5 flex flex-col gap-0.5 border-l border-[rgb(var(--border))] pl-3">
            {favoriteTools.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/${t.slug}`}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                    pathname === `/${t.slug}`
                      ? "bg-[rgb(var(--accent)/0.1)] font-medium text-[rgb(var(--accent))]"
                      : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)]"
                  }`}
                >
                  <Icon name={t.icon} />
                  {t.shortName ?? t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {TOOLBOX_CATEGORIES.map((cat) => {
        const items = filtered.filter((t) => t.categorySlug === cat.slug);
        if (items.length === 0) return null;
        const isCollapsed = collapsed.has(cat.slug);

        return (
          <div key={cat.slug} className="mb-1">
            <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-[rgb(var(--border)/0.5)]">
              <Link
                href={`/category/${cat.slug}`}
                className={`flex flex-1 items-center gap-2 text-sm ${
                  pathname === `/category/${cat.slug}`
                    ? "font-semibold text-[rgb(var(--accent))]"
                    : "text-[rgb(var(--fg))]"
                }`}
              >
                <Icon name={cat.icon} />
                {cat.name}
              </Link>
              <button
                onClick={() => toggleCollapsed(cat.slug)}
                aria-label="Toggle category"
                className="text-[rgb(var(--muted))]"
              >
                {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            </div>

            {!isCollapsed && (
              <ul className="mt-0.5 flex flex-col gap-0.5 border-l border-[rgb(var(--border))] pl-3">
                {items.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/${t.slug}`}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                        pathname === `/${t.slug}`
                          ? "bg-[rgb(var(--accent)/0.1)] font-medium text-[rgb(var(--accent))]"
                          : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)]"
                      }`}
                    >
                      <Icon name={t.icon} />
                      {t.shortName ?? t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
      </div>
    </nav>
  );
}
