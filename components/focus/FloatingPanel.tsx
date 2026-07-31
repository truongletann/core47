"use client";

export interface PanelTab {
  key: string;
  label: string;
}

interface FloatingPanelProps {
  title?: string;
  tabs?: PanelTab[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  onClose: () => void;
  children: React.ReactNode;
  align?: "left" | "right";
}

// Anchored card, no dim scrim — matches the reference UI where opening a
// dock panel doesn't darken the ambience background. An invisible full-
// screen layer behind the card handles outside-click-to-close.
export function FloatingPanel({ title, tabs, activeTab, onTabChange, onClose, children, align = "left" }: FloatingPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div
        className={`fixed bottom-20 z-30 flex max-h-[70vh] w-[420px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141019]/95 text-white shadow-2xl backdrop-blur-xl ${
          align === "left" ? "left-5" : "right-5"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {tabs && tabs.length > 0 ? (
          <div className="flex items-center gap-4 border-b border-white/10 px-5 pb-3 pt-4 text-sm">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => onTabChange?.(t.key)}
                className={`transition-colors ${
                  activeTab === t.key ? "font-semibold text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : title ? (
          <div className="border-b border-white/10 px-5 pb-3 pt-4 text-sm font-semibold">{title}</div>
        ) : null}
        <div className="overflow-y-auto px-5 pb-5 pt-4">{children}</div>
      </div>
    </>
  );
}
