import { NextRequest, NextResponse } from "next/server";
import { getBlogBucket } from "@/lib/storage/r2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  // Only accept UUID-like keys to avoid path traversal
  if (!/^[a-zA-Z0-9-]+$/.test(key)) {
    return NextResponse.json({ error: "INVALID_KEY" }, { status: 400 });
  }

  const bucket = await getBlogBucket();
  const object = await bucket.get(`blog-covers/${key}`);

  if (!object) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return new NextResponse(object.body as unknown as BodyInit, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
