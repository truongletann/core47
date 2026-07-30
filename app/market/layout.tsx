"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/market", label: "Overview" },
  { href: "/market/calendar", label: "Calendar" },
  { href: "/market/prices", label: "Prices" },
  { href: "/market/portfolio", label: "Portfolio" },
  { href: "/market/news", label: "News" },
];

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-5xl px-6 pt-10">
      <nav className="font-data flex gap-1 border-b border-[rgb(var(--border))] text-sm">
        {TABS.map((tab) => {
          const active = tab.href === "/market" ? pathname === "/market" : pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "border-b-2 px-3 py-2.5 transition-colors",
                active
                  ? "border-[rgb(var(--accent))] text-[rgb(var(--fg))]"
                  : "border-transparent text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
