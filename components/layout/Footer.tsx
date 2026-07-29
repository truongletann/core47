import { cn } from "@/lib/utils/cn";

export function Footer({ isAdminArea = false }: { isAdminArea?: boolean }) {
  return (
    <footer className="border-t border-[rgb(var(--border))] py-6">
      <div
        className={cn(
          "mx-auto flex flex-col items-center gap-2 px-6 text-xs text-[rgb(var(--muted))] sm:flex-row sm:justify-between",
          isAdminArea ? "max-w-none" : "max-w-7xl",
        )}
      >
        <span className="font-data">© 2026 Core47. Micro-tool ecosystem cho developer.</span>
        <span className="font-data flex items-center gap-1.5">
          <span className="led-dot bg-[rgb(var(--accent))]" />
          dev by <span className="font-semibold text-[rgb(var(--fg))]">traviscore</span>
        </span>
      </div>
    </footer>
  );
}
