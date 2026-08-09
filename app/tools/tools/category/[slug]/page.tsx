import { notFound } from "next/navigation";
import Link from "next/link";
import { TOOLBOX_TOOLS, getCategoryBySlug } from "@/lib/toolbox/registry";
import { DynamicIcon as Icon } from "@/components/toolbox/DynamicIcon";

export default async function ToolboxCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const tools = TOOLBOX_TOOLS.filter((t) => t.categorySlug === slug);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{category.name}</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 hover:border-[rgb(var(--accent))]"
          >
            <div className="flex items-center gap-2 text-[rgb(var(--accent))]">
              <Icon name={tool.icon} size={20} />
              <h2 className="font-display text-sm font-semibold text-[rgb(var(--fg))]">
                {tool.name}
              </h2>
            </div>
            <p className="mt-1.5 text-xs text-[rgb(var(--muted))]">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
