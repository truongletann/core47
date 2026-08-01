import { eq, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { libraryBooks } from "@/db/schema";
import { getLibraryBucket } from "@/lib/storage/r2";
import type { CreateBookMetaInput } from "./schema";

export async function listBooks() {
  const db = await getDb();
  return db.select().from(libraryBooks).orderBy(desc(libraryBooks.createdAt));
}

export async function getBook(id: string) {
  const db = await getDb();
  return db.select().from(libraryBooks).where(eq(libraryBooks.id, id)).get();
}

export async function createBook(
  meta: CreateBookMetaInput,
  file: { fileType: "pdf" | "epub"; size: number; buffer: ArrayBuffer; contentType: string },
  uploaderIp: string | null,
) {
  const db = await getDb();
  const bucket = await getLibraryBucket();

  const id = crypto.randomUUID();
  const fileKey = `books/${id}.${file.fileType}`;

  await bucket.put(fileKey, file.buffer, { httpMetadata: { contentType: file.contentType } });

  const record = {
    id,
    title: meta.title,
    author: meta.author ?? null,
    description: meta.description ?? null,
    fileType: file.fileType,
    fileKey,
    fileSize: file.size,
    uploaderIp,
    createdAt: new Date().toISOString(),
  };
  await db.insert(libraryBooks).values(record);
  return record;
}

export async function deleteBook(id: string) {
  const db = await getDb();
  const book = await getBook(id);
  if (!book) throw new Error("NOT_FOUND");

  const bucket = await getLibraryBucket();
  await bucket.delete(book.fileKey);
  await db.delete(libraryBooks).where(eq(libraryBooks.id, id));
}
