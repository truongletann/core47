export function ConfigPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
        Configuration
      </p>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export function ConfigRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="text-[rgb(var(--muted))]">{icon}</div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-[rgb(var(--muted))]">{description}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}
