"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: string; // lucide-react icon name
}

export interface AdminNavSection {
  section: string;
  items: AdminNavItem[];
}

function NavIcon({ name }: { name: string }) {
  const LucideIcon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
  return <LucideIcon size={15} strokeWidth={2} />;
}

export function AdminNav({
  sections,
  suggestionCount,
}: {
  sections: AdminNavSection[];
  suggestionCount: number;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="w-full shrink-0 md:w-56">
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="mb-3 flex w-full items-center justify-between rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm font-medium md:hidden"
      >
        <span className="flex items-center gap-2">
          <Menu size={16} />
          Admin CMS
        </span>
        {mobileOpen ? <X size={16} /> : <Icons.ChevronDown size={16} />}
      </button>

      <div className={`${mobileOpen ? "block" : "hidden"} md:block`}>
        <div className="flex flex-col gap-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 md:sticky md:top-20">
          {sections.map((sec) => (
            <div key={sec.section}>
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
                {sec.section}
              </p>
              <ul className="flex flex-col gap-0.5">
                {sec.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                          active
                            ? "bg-[rgb(var(--accent)/0.12)] font-medium text-[rgb(var(--accent))]"
                            : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)] hover:text-[rgb(var(--fg))]",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <NavIcon name={item.icon} />
                          {item.label}
                        </span>
                        {item.href === "/bucket-list" && suggestionCount > 0 && (
                          <span className="font-data rounded-full bg-[rgb(var(--accent))] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            {suggestionCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
