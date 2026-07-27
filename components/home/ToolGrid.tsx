"use client";

import { useMemo, useState } from "react";
import type { Category, Tool } from "@/types/tool";
import { ToolFilterBar } from "./ToolFilterBar";
import { ToolCard } from "./ToolCard";

interface Props {
  tools: Tool[];
  categories: Category[];
}

export function ToolGrid({ tools, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      const matchCategory = activeCategory ? tool.categoryId === activeCategory : true;
      const matchSearch = search
        ? `${tool.name} ${tool.description}`.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchCategory && matchSearch;
    });
  }, [tools, activeCategory, search]);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <ToolFilterBar
        categories={categories}
        activeCategory={activeCategory}
        search={search}
        onCategoryChange={setActiveCategory}
        onSearchChange={setSearch}
      />

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[rgb(var(--muted))]">
          Không tìm thấy công cụ phù hợp.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}