export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border))] py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6 text-xs text-[rgb(var(--muted))] sm:flex-row sm:justify-between">
        <span className="font-data">© 2026 Core47. Micro-tool ecosystem cho developer.</span>
        <span className="font-data flex items-center gap-1.5">
          <span className="led-dot bg-[rgb(var(--accent))]" />
          dev by <span className="font-semibold text-[rgb(var(--fg))]">traviscore</span>
        </span>
      </div>
    </footer>
  );
}