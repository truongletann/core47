import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBook } from "@/lib/books/service";
import { BookReaderClient } from "@/components/books/BookReaderClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function BookReaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  return (
    <BookReaderClient
      id={book.id}
      title={book.title}
      author={book.author}
      fileType={book.fileType}
    />
  );
}
