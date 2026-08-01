import { PDFDocument } from "pdf-lib";
import { convertImage } from "./images";

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const src = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  return merged.save();
}

// Parses "1-3, 5, 8-9" into a sorted, de-duplicated list of page numbers
// (1-indexed), clamped to [1, maxPage].
export function parsePageRanges(input: string, maxPage: number): number[] {
  const result = new Set<number>();
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;
    const lo = Math.max(1, Math.min(start, end));
    const hi = Math.min(maxPage, Math.max(start, end));
    for (let i = lo; i <= hi; i++) result.add(i);
  }
  return [...result].sort((a, b) => a - b);
}

export async function extractPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const out = await PDFDocument.create();
  const indices = pageNumbers.map((n) => n - 1).filter((i) => i >= 0 && i < src.getPageCount());
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

export async function splitEachPage(file: File): Promise<{ name: string; bytes: Uint8Array }[]> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const count = src.getPageCount();
  const results: { name: string; bytes: Uint8Array }[] = [];
  for (let i = 0; i < count; i++) {
    const out = await PDFDocument.create();
    const [page] = await out.copyPages(src, [i]);
    out.addPage(page);
    results.push({ name: `trang-${i + 1}.pdf`, bytes: await out.save() });
  }
  return results;
}

export async function getPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    let bytes = new Uint8Array(await file.arrayBuffer());
    let mime = file.type;
    if (mime !== "image/jpeg" && mime !== "image/png") {
      const blob = await convertImage(file, "image/png");
      bytes = new Uint8Array(await blob.arrayBuffer());
      mime = "image/png";
    }
    const img = mime === "image/jpeg" ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes);
    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  return pdfDoc.save();
}
