// Client-only. Both pdfjs-dist and foliate-js/view.js are loaded via
// dynamic import() *inside* these functions (never a top-level import) so
// they only ever end up in an on-demand browser chunk — a static import
// here would pull them into the server Worker bundle too (see
// CONVENTIONS.md's pdf.core47.xyz gotcha).

export interface ExtractedMeta {
  title: string | null;
  author: string | null;
  genre: string | null;
  coverBlob: Blob | null;
}

const EMPTY: ExtractedMeta = { title: null, author: null, genre: null, coverBlob: null };

export function detectFileType(file: File): "pdf" | "epub" | null {
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "application/epub+zip") return "epub";
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".epub")) return "epub";
  return null;
}

function formatLanguageMap(x: unknown): string | null {
  if (!x) return null;
  if (typeof x === "string") return x;
  if (typeof x === "object") {
    const keys = Object.keys(x as Record<string, string>);
    if (keys.length) return (x as Record<string, string>)[keys[0]];
  }
  return null;
}

function formatOneContributor(c: unknown): string | null {
  if (typeof c === "string") return c;
  if (c && typeof c === "object") return formatLanguageMap((c as { name?: unknown }).name);
  return null;
}

function formatContributor(c: unknown): string | null {
  if (Array.isArray(c)) return c.map(formatOneContributor).filter(Boolean).join(", ") || null;
  return formatOneContributor(c);
}

export async function extractEpubMeta(file: File): Promise<ExtractedMeta> {
  try {
    const { makeBook } = await import("foliate-js/view.js");
    const book = await makeBook(file);
    const metadata = book.metadata as Record<string, unknown> | undefined;

    const title = formatLanguageMap(metadata?.title);
    const author = metadata?.author ? formatContributor(metadata.author) : null;

    const subject = metadata?.subject;
    const genre = Array.isArray(subject)
      ? subject.map((s) => (typeof s === "string" ? s : formatOneContributor(s))).filter(Boolean).join(", ") ||
        null
      : formatOneContributor(subject);

    const coverBlob: Blob | null = (await book.getCover?.()) ?? null;
    return { title, author, genre, coverBlob };
  } catch {
    return EMPTY;
  }
}

export async function extractPdfMeta(file: File): Promise<ExtractedMeta> {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();

    const data = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let title: string | null = null;
    let author: string | null = null;
    try {
      const meta = await pdf.getMetadata();
      const info = meta.info as Record<string, unknown>;
      if (typeof info?.Title === "string" && info.Title.trim()) title = info.Title.trim();
      if (typeof info?.Author === "string" && info.Author.trim()) author = info.Author.trim();
    } catch {
      // no Info dict — leave title/author null, not fatal
    }

    let coverBlob: Blob | null = null;
    try {
      const page = await pdf.getPage(1);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(400 / base.width, 2);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        await page.render({ canvas, canvasContext: ctx, viewport, intent: "print" }).promise;
        coverBlob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85),
        );
      }
    } catch {
      // rendering failed — cover is optional, not fatal
    }

    await pdf.cleanup();
    return { title, author, genre: null, coverBlob };
  } catch {
    return EMPTY;
  }
}
