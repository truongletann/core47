"use client";

// pdfjs-dist / foliate-js are heavy and browser-only — ssr:false keeps them
// out of the server Worker bundle (see CONVENTIONS.md's pdf.core47.xyz
// gotcha: a "use client" component alone does NOT do this, Next still
// server-renders it for the initial HTML unless dynamic() disables ssr).
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PdfReader = dynamic(() => import("./PdfReader").then((m) => m.PdfReader), { ssr: false });
const EpubReader = dynamic(() => import("./EpubReader").then((m) => m.EpubReader), { ssr: false });

export function BookReaderClient({
  id,
  title,
  author,
  fileType,
}: {
  id: string;
  title: string;
  author: string | null;
  fileType: "pdf" | "epub";
}) {
  const fileUrl = `/api/books/${id}/file`;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 border-b border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2.5">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          {author && <p className="truncate text-xs text-[rgb(var(--muted))]">{author}</p>}
        </div>
      </div>
      <div className="min-h-0 flex-1">
        {fileType === "pdf" ? <PdfReader fileUrl={fileUrl} /> : <EpubReader fileUrl={fileUrl} />}
      </div>
    </div>
  );
}
