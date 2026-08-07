"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Utensils, Apple } from "lucide-react";

const TABS = [
  { href: "/", label: "Kế hoạch tuần", icon: CalendarDays },
  { href: "/recipes", label: "Công thức", icon: Utensils },
  { href: "/foods", label: "Nguyên liệu", icon: Apple },
];

export function MealNav() {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 md:px-6">
      <nav className="flex gap-1 border-b border-[rgb(var(--border))]">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-[rgb(var(--accent))] text-[rgb(var(--accent))]"
                  : "border-transparent text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
