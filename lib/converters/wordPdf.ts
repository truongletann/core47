import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import mammoth from "mammoth";
import { Document as DocxDocument, Packer, Paragraph, TextRun } from "docx";
import { extractPdfText } from "./pdfRender";

// Best-effort text-only conversion (no layout/formatting round-trips) —
// good enough to get the words out of a .docx into a shareable PDF.
export async function docxToPdf(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const { value: text } = await mammoth.extractRawText({ arrayBuffer });

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const margin = 50;
  const pageWidth = 595.28; // A4 at 72dpi
  const pageHeight = 841.89;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = fontSize * 1.4;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const wrapLine = (paragraph: string): string[] => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, fontSize) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const paragraphs = text.split(/\r?\n/);
  for (const paragraph of paragraphs) {
    const lines = paragraph.trim() ? wrapLine(paragraph) : [""];
    for (const line of lines) {
      if (y < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
      y -= lineHeight;
    }
  }

  return pdfDoc.save();
}

// Best-effort text extraction from PDF into a .docx (one paragraph per
// source line, a page break between PDF pages). Layout/images are not
// preserved — pdf.js only gives us positioned text runs, not structure.
export async function pdfToDocx(file: File): Promise<Blob> {
  const pagesText = await extractPdfText(file);
  const children: Paragraph[] = [];

  pagesText.forEach((pageText, pageIndex) => {
    const lines = pageText.split("\n");
    lines.forEach((line, lineIndex) => {
      const isFirstLineOfPage = pageIndex > 0 && lineIndex === 0;
      children.push(
        new Paragraph({
          children: [new TextRun(line)],
          pageBreakBefore: isFirstLineOfPage,
        }),
      );
    });
    if (lines.length === 0 && pageIndex > 0) {
      children.push(new Paragraph({ children: [], pageBreakBefore: true }));
    }
  });

  const doc = new DocxDocument({ sections: [{ children }] });
  return Packer.toBlob(doc);
}
