"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// foliate-js's <foliate-view> is a plain custom element (not a React
// component) — imperatively created/managed via refs rather than JSX, so no
// custom JSX typings are needed.
interface FoliateView extends HTMLElement {
  open(book: Blob): Promise<void>;
  close(): void;
  next(): Promise<void>;
  prev(): Promise<void>;
  renderer: { setStyles?: (css: string) => void; next(): void };
}

const READER_CSS = `
  p, li, blockquote, dd { line-height: 1.6; }
`;

export function EpubReader({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<FoliateView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await import("foliate-js/view.js");
        if (cancelled || !containerRef.current) return;

        const view = document.createElement("foliate-view") as FoliateView;
        containerRef.current.appendChild(view);
        viewRef.current = view;

        const res = await fetch(fileUrl);
        const blob = await res.blob();
        if (cancelled) return;

        // foliate-js's format sniffing (isCBZ/isFB2/isFBZ) reads `.name` —
        // a plain Blob from fetch().blob() doesn't have one and crashes it.
        const file = new File([blob], "book.epub", { type: blob.type || "application/epub+zip" });

        await view.open(file);
        view.renderer.setStyles?.(READER_CSS);
        view.renderer.next();
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError("Không đọc được file EPUB này.");
          setLoading(false);
        }
      }
    }
    load();

    return () => {
      cancelled = true;
      viewRef.current?.close();
      viewRef.current?.remove();
      viewRef.current = null;
    };
  }, [fileUrl]);

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className="relative min-h-0 flex-1 [&_foliate-view]:block [&_foliate-view]:h-full [&_foliate-view]:w-full">
        {loading && !error && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-[rgb(var(--muted))]">
            Đang tải...
          </p>
        )}
        {error && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-red-600">{error}</p>
        )}
      </div>
      {!loading && !error && (
        <div className="flex shrink-0 items-center justify-center gap-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--card))] py-2.5">
          <button
            type="button"
            onClick={() => viewRef.current?.prev()}
            className="rounded-md p-1.5 text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)]"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-data text-xs text-[rgb(var(--muted))]">EPUB</span>
          <button
            type="button"
            onClick={() => viewRef.current?.next()}
            className="rounded-md p-1.5 text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
