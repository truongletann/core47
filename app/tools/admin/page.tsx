"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState({ users: 0, categories: 0, tools: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/users", { credentials: "include" }).then(
        (r) => r.json() as Promise<{ data?: { users?: unknown[] } }>,
      ),
      fetch("/api/admin/categories", { credentials: "include" }).then(
        (r) => r.json() as Promise<{ data?: { categories?: unknown[] } }>,
      ),
      fetch("/api/admin/tools", { credentials: "include" }).then(
        (r) => r.json() as Promise<{ data?: { tools?: unknown[] } }>,
      ),
    ])
      .then(([u, c, t]) => {
        setCounts({
          users: u?.data?.users?.length ?? 0,
          categories: c?.data?.categories?.length ?? 0,
          tools: t?.data?.tools?.length ?? 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Users", value: counts.users, href: "/users" },
    { label: "Categories", value: counts.categories, href: "/categories" },
    { label: "Tools", value: counts.tools, href: "/tools" },
  ];

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-semibold">Admin Overview</h1>
      <div className="grid grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 hover:border-[rgb(var(--accent))]"
          >
            <p className="text-sm text-[rgb(var(--muted))]">{c.label}</p>
            <p className="font-display mt-1 text-3xl font-semibold">
              {loading ? "..." : c.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}