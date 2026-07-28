"use client";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-md rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3">
          <h3 className="font-display text-sm font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
