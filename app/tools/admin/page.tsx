"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, FolderTree, Wrench, Newspaper, ListChecks, ArrowUpRight } from "lucide-react";

interface StatCard {
  label: string;
  value: number | null;
  href: string;
  icon: typeof Users;
}

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState({
    users: null as number | null,
    categories: null as number | null,
    tools: null as number | null,
    posts: null as number | null,
    bucketItems: null as number | null,
  });

  useEffect(() => {
    const endpoints: Array<[keyof typeof counts, string, string]> = [
      ["users", "/api/admin/users", "users"],
      ["categories", "/api/admin/categories", "categories"],
      ["tools", "/api/admin/tools", "tools"],
      ["posts", "/api/admin/blog", "posts"],
      ["bucketItems", "/api/admin/list100", "items"],
    ];

    endpoints.forEach(([key, url, dataKey]) => {
      fetch(url, { credentials: "include" })
        .then((r) => r.json() as Promise<{ data?: Record<string, unknown[]> }>)
        .then((json) => {
          const list = json?.data?.[dataKey];
          setCounts((prev) => ({ ...prev, [key]: Array.isArray(list) ? list.length : 0 }));
        })
        .catch(() => setCounts((prev) => ({ ...prev, [key]: 0 })));
    });
  }, []);

  const cards: StatCard[] = [
    { label: "Users", value: counts.users, href: "/users", icon: Users },
    { label: "Categories", value: counts.categories, href: "/categories", icon: FolderTree },
    { label: "Tools", value: counts.tools, href: "/tools", icon: Wrench },
    { label: "Blog posts", value: counts.posts, href: "/blog", icon: Newspaper },
    { label: "Bucket list items", value: counts.bucketItems, href: "/bucket-list", icon: ListChecks },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Overview</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Snapshot of what&apos;s in the system right now.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 transition-colors hover:border-[rgb(var(--accent))]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--accent)/0.1)] text-[rgb(var(--accent))]">
                <Icon size={20} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[rgb(var(--muted))]">{c.label}</p>
                <p className="font-display mt-0.5 text-3xl font-semibold tabular-nums">
                  {c.value === null ? (
                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-[rgb(var(--border))]" />
                  ) : (
                    c.value
                  )}
                </p>
              </div>
              <ArrowUpRight
                size={16}
                className="absolute right-4 top-4 text-[rgb(var(--muted))] opacity-0 transition-opacity group-hover:opacity-100"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
