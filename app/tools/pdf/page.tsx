"use client";

// pdf-lib/pdfjs-dist/mammoth/docx are heavy and browser-only — ssr:false
// keeps them out of the server Worker bundle entirely (they'd otherwise
// blow past Cloudflare's 3MiB gzip Worker size limit, see CONVENTIONS.md).
import dynamic from "next/dynamic";

const PdfToolkitClient = dynamic(() => import("@/components/pdf/PdfToolkitClient"), {
  ssr: false,
});

export default function PdfToolkitPage() {
  return <PdfToolkitClient />;
}
