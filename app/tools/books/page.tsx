import type { Metadata } from "next";
import { BooksLibraryClient } from "@/components/books/BooksLibraryClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BooksPage() {
  return <BooksLibraryClient />;
}
