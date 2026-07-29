export function List100Progress({ total, done }: { total: number; done: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mx-auto mt-4 max-w-md">
      <div className="flex items-center justify-between text-xs text-[rgb(var(--muted))]">
        <span className="font-data">
          {done}/{total} đã hoàn thành
        </span>
        <span className="font-data">{pct}%</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--border))]">
        <div
          className="h-full rounded-full bg-[rgb(var(--accent))] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
