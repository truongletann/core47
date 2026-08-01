"use client";

// `ssr: false` is only allowed inside a Client Component — page.tsx must
// stay a Server Component (it exports the noindex `metadata`), so this
// thin client wrapper is the boundary that keeps BooksLibraryClient (and
// its transitive pdfjs-dist/foliate-js dynamic imports) out of the server
// Worker bundle. See CONVENTIONS.md's pdf.core47.xyz gotcha.
import dynamic from "next/dynamic";

const BooksLibraryClient = dynamic(
  () => import("./BooksLibraryClient").then((m) => m.BooksLibraryClient),
  { ssr: false },
);

export function BooksLibraryLoader() {
  return <BooksLibraryClient />;
}
