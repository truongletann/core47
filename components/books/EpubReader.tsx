"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// foliate-js's <foliate-view> is a plain custom element (not a React
// component) — imperatively created/managed via refs rather than JSX, so no
// custom JSX typings are needed.
interface FoliateView extends HTMLElement {
  open(book: unknown): Promise<void>;
  close(): void;
  next(): Promise<void>;
  prev(): Promise<void>;
  renderer: { setStyles?: (css: string) => void; next(): void };
}

const READER_CSS = `
  p, li, blockquote, dd { line-height: 1.6; }
`;

// foliate-js's bundled zip.js (used to read the EPUB's ZIP container) and
// its paginator have both been observed to hang or crash on some
// real-world EPUBs — including a null-`iframe.contentDocument` race in its
// own minified paginator.js (`afterLoad` reading `doc.head` when `doc` is
// null). There's only one published version of the library, so there's no
// newer release to pick up a fix from, and a from-scratch replacement
// loader (tried: feeding it a book parsed via jszip instead of its own
// zip.js) made things *less* reliable, not more — reverted. Retrying with
// a fresh <foliate-view> a couple of times recovers some of these
// transient failures; if every attempt fails, surface a clear error
// instead of a silently blank reader.
const OPEN_TIMEOUT_MS = 12000;
const MAX_ATTEMPTS = 2;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("TIMEOUT")), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

export function EpubReader({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<FoliateView | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function openOnce(file: File): Promise<FoliateView> {
      if (!containerRef.current) throw new Error("NO_CONTAINER");
      const view = document.createElement("foliate-view") as FoliateView;
      containerRef.current.appendChild(view);
      try {
        await withTimeout(view.open(file), OPEN_TIMEOUT_MS);
        await withTimeout(Promise.resolve(view.renderer.next()), OPEN_TIMEOUT_MS);
        return view;
      } catch (e) {
        view.close?.();
        view.remove();
        throw e;
      }
    }

    async function load() {
      try {
        await import("foliate-js/view.js");
        if (cancelled || !containerRef.current) return;

        const res = await fetch(fileUrl);
        const buffer = await res.arrayBuffer();
        if (cancelled) return;
        // foliate-js's format sniffing (isCBZ/isFB2/isFBZ) reads `.name` —
        // a plain Blob doesn't have one and crashes it.
        const file = new File([buffer], "book.epub", {
          type: res.headers.get("content-type") || "application/epub+zip",
        });

        let lastErr: unknown;
        for (let i = 1; i <= MAX_ATTEMPTS; i++) {
          if (cancelled) return;
          setAttempt(i);
          try {
            const view = await openOnce(file);
            if (cancelled) {
              view.close?.();
              view.remove();
              return;
            }
            viewRef.current = view;
            view.renderer.setStyles?.(READER_CSS);
            setLoading(false);
            return;
          } catch (e) {
            lastErr = e;
          }
        }
        throw lastErr ?? new Error("UNKNOWN");
      } catch {
        if (!cancelled) {
          setError("Không đọc được file EPUB này — có thể file bị lỗi hoặc quá phức tạp để đọc trên trình duyệt.");
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
            Đang tải{attempt > 1 ? ` (lần thử ${attempt}/${MAX_ATTEMPTS})` : "..."}
          </p>
        )}
        {error && (
          <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm text-red-600">
            {error}
          </p>
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
