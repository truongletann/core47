"use client";

import { useMemo, useState } from "react";
import type { List100Item, List100Status } from "@/types/list100";
import { List100FilterBar } from "./List100FilterBar";
import { List100Card } from "./List100Card";

interface Props {
  items: List100Item[];
  categories: string[];
}

export function List100Grid({ items, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<List100Status | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = activeCategory ? item.category === activeCategory : true;
      const matchStatus = activeStatus ? item.status === activeStatus : true;
      const matchSearch = search
        ? `${item.title} ${item.description}`.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchCategory && matchStatus && matchSearch;
    });
  }, [items, activeCategory, activeStatus, search]);

  return (
    <section className="mx-auto max-w-4xl px-6 pb-16">
      <List100FilterBar
        categories={categories}
        activeCategory={activeCategory}
        activeStatus={activeStatus}
        search={search}
        onCategoryChange={setActiveCategory}
        onStatusChange={setActiveStatus}
        onSearchChange={setSearch}
      />

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[rgb(var(--muted))]">
          Không tìm thấy mục phù hợp.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => (
            <List100Card key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
