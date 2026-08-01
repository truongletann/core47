import type { Metadata } from "next";
import { BooksLibraryLoader } from "@/components/books/BooksLibraryLoader";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BooksPage() {
  return <BooksLibraryLoader />;
}
