"use client";

const TREE_EMOJIS = ["🌱", "🌿", "🌳", "🌲", "🌴"];

function treeFor(index: number) {
  // vary the "growth stage" a little so the garden doesn't look uniform
  return TREE_EMOJIS[(index * 7) % TREE_EMOJIS.length];
}

export function Garden({ totalSessions }: { totalSessions: number }) {
  const count = Math.min(totalSessions, 200);

  if (count === 0) {
    return <p className="text-sm text-[rgb(var(--muted))]">Hoàn thành phiên Pomodoro đầu tiên để bắt đầu khu vườn của bạn.</p>;
  }

  return (
    <div>
      <p className="mb-3 text-sm text-[rgb(var(--muted))]">
        {totalSessions} phiên tập trung đã hoàn thành — mỗi cây là một phiên.
      </p>
      <div className="flex flex-wrap gap-1 rounded-xl border border-[rgb(var(--border))] bg-gradient-to-b from-sky-50 to-emerald-50 p-4 text-2xl dark:from-slate-900 dark:to-emerald-950">
        {Array.from({ length: count }, (_, i) => (
          <span key={i}>{treeFor(i)}</span>
        ))}
      </div>
      {totalSessions > 200 && (
        <p className="mt-2 text-xs text-[rgb(var(--muted))]">+{totalSessions - 200} cây nữa ngoài khung hiển thị.</p>
      )}
    </div>
  );
}
