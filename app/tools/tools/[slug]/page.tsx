import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/toolbox/registry";
import { ToolShell } from "@/components/toolbox/ToolShell";

export default async function ToolPlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return (
    <ToolShell slug={tool.slug} title={tool.name} description={tool.description}>
      <div className="rounded-xl border border-dashed border-[rgb(var(--border))] p-10 text-center">
        <p className="text-sm text-[rgb(var(--muted))]">
          This tool isn&apos;t built yet — coming soon.
        </p>
      </div>
    </ToolShell>
  );
}
