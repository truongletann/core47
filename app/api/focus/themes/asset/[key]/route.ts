import { NextRequest, NextResponse } from "next/server";
import { getFocusSoundsBucket } from "@/lib/storage/r2";

// Serves admin-uploaded theme images from R2 — small files, no Range
// support needed (unlike the old raw-video approach this replaces).
export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  if (!/^[a-zA-Z0-9_.-]+$/.test(key)) {
    return NextResponse.json({ error: "INVALID_KEY" }, { status: 400 });
  }

  const bucket = await getFocusSoundsBucket();
  const object = await bucket.get(`themes/${key}`);
  if (!object) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return new NextResponse(object.body as unknown as BodyInit, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "image/jpeg",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}
