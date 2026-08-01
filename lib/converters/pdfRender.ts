// Client-only — never import this from a server component/route, pdfjs-dist
// needs `window`/`document` and ships its own worker script.
import * as pdfjsLib from "pdfjs-dist";

let workerConfigured = false;
function ensureWorker() {
  if (workerConfigured) return;
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  workerConfigured = true;
}

export async function renderPdfPagesToImages(
  file: File,
  opts: { scale?: number; mime?: "image/jpeg" | "image/png"; quality?: number } = {},
): Promise<Blob[]> {
  ensureWorker();
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const blobs: Blob[] = [];
  try {
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: opts.scale ?? 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      // intent: "print" skips pdf.js's requestAnimationFrame-based scheduling
      // (used for on-screen progressive rendering) in favor of microtasks —
      // without this, conversion silently hangs forever if the tab is
      // backgrounded/hidden while a render is in flight (rAF is paused then).
      await page.render({ canvas, canvasContext: ctx, viewport, intent: "print" }).promise;
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Render failed"))),
          opts.mime ?? "image/jpeg",
          opts.quality ?? 0.92,
        ),
      );
      blobs.push(blob);
    }
  } finally {
    await pdf.cleanup();
  }
  return blobs;
}

// Extracts text per page, using pdf.js's `hasEOL` hint to reconstruct
// line breaks (pdf.js does not expose text as one string with newlines).
export async function extractPdfText(file: File): Promise<string[]> {
  ensureWorker();
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages: string[] = [];
  try {
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const lines: string[] = [];
      let current = "";
      for (const item of content.items) {
        if (!("str" in item)) continue;
        current += item.str;
        if (item.hasEOL) {
          lines.push(current);
          current = "";
        }
      }
      if (current) lines.push(current);
      pages.push(lines.join("\n"));
    }
  } finally {
    await pdf.cleanup();
  }
  return pages;
}
