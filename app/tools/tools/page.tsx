import Link from "next/link";
import * as Icons from "lucide-react";
import { TOOLBOX_TOOLS } from "@/lib/toolbox/registry";

function Icon({ name }: { name: string }) {
  const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[
    name
  ];
  if (!LucideIcon) return null;
  return <LucideIcon size={20} />;
}

export default function ToolboxHomePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">All tools</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        A growing collection of handy client-side dev tools.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLBOX_TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="relative rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 hover:border-[rgb(var(--accent))]"
          >
            {!tool.implemented && (
              <span className="font-data absolute right-3 top-3 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                Soon
              </span>
            )}
            <div className="flex items-center gap-2 text-[rgb(var(--accent))]">
              <Icon name={tool.icon} />
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
