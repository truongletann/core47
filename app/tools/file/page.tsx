"use client";

// pdf-lib/mammoth/docx are heavy and browser-only — ssr:false keeps them
// out of the server Worker bundle entirely (they'd otherwise blow past
// Cloudflare's 3MiB gzip Worker size limit, see CONVENTIONS.md).
import dynamic from "next/dynamic";

const FileConverterClient = dynamic(() => import("@/components/file/FileConverterClient"), {
  ssr: false,
});

export default function FileConverterPage() {
  return <FileConverterClient />;
}
