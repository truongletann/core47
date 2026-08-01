"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { ChevronLeft, ChevronRight } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function PdfReader({ fileUrl }: { fileUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    pdfjsLib
      .getDocument({ url: fileUrl })
      .promise.then((pdf) => {
        if (cancelled) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Không đọc được file PDF này.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      pdfRef.current?.cleanup();
    };
  }, [fileUrl]);

  useEffect(() => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas) return;

    let cancelled = false;
    pdf.getPage(page).then(async (pdfPage) => {
      if (cancelled) return;
      const container = canvas.parentElement;
      const targetWidth = container ? container.clientWidth - 32 : 800;
      const baseViewport = pdfPage.getViewport({ scale: 1 });
      const scale = Math.min(targetWidth / baseViewport.width, 2);
      const viewport = pdfPage.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // intent: "print" avoids pdf.js's requestAnimationFrame-based
      // scheduling hanging forever if the tab is backgrounded mid-render.
      await pdfPage.render({ canvas, canvasContext: ctx, viewport, intent: "print" }).promise;
    });
    return () => {
      cancelled = true;
    };
  }, [page, numPages]);

  if (error) {
    return <p className="p-6 text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-start justify-center overflow-auto p-4">
        {loading ? (
          <p className="mt-10 text-sm text-[rgb(var(--muted))]">Đang tải...</p>
        ) : (
          <canvas ref={canvasRef} className="rounded-lg border border-[rgb(var(--border))] shadow-sm" />
        )}
      </div>
      {!loading && numPages > 0 && (
        <div className="flex shrink-0 items-center justify-center gap-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--card))] py-2.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-md p-1.5 text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)] disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-data text-xs text-[rgb(var(--muted))]">
            Trang {page} / {numPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(numPages, p + 1))}
            disabled={page >= numPages}
            className="rounded-md p-1.5 text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)] disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
