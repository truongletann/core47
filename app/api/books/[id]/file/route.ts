import { NextRequest, NextResponse } from "next/server";
import { getBook } from "@/lib/books/service";
import { getLibraryBucket } from "@/lib/storage/r2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) {
    return NextResponse.json({ success: false, error: "NOT_FOUND" }, { status: 404 });
  }

  const bucket = await getLibraryBucket();
  const object = await bucket.get(book.fileKey);
  if (!object) {
    return NextResponse.json({ success: false, error: "NOT_FOUND" }, { status: 404 });
  }

  return new NextResponse(object.body as unknown as BodyInit, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Robots-Tag": "noindex",
    },
  });
}
