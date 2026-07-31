"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

type NavItem = { href: string; label: string };

export function AdminNav({ items, suggestionCount }: { items: NavItem[]; suggestionCount: number }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="w-full shrink-0 md:w-40">
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="mb-3 flex w-full items-center justify-between rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm font-medium md:hidden"
      >
        <span className="flex items-center gap-2">
          <Menu size={16} />
          Admin CMS
        </span>
        {mobileOpen ? <X size={16} /> : <ChevronDown size={16} />}
      </button>

      <div className={`${mobileOpen ? "block" : "hidden"} md:block`}>
        <p className="mb-2 hidden px-2 text-xs font-medium uppercase tracking-wide text-[rgb(var(--muted))] md:block">
          Admin CMS
        </p>
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)] hover:text-[rgb(var(--fg))]"
              >
                <span>{item.label}</span>
                {item.href === "/bucket-list" && suggestionCount > 0 && (
                  <span className="font-data rounded-full bg-[rgb(var(--accent))] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {suggestionCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
