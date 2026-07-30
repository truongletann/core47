import { NextRequest, NextResponse } from "next/server";
import { getFocusSoundsBucket } from "@/lib/storage/r2";

export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  // Only R2-backed tracks are streamed through here — bundled tracks live
  // directly under /public/sounds and external tracks point at a CDN URL.
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
    return NextResponse.json({ error: "INVALID_KEY" }, { status: 400 });
  }

  const bucket = await getFocusSoundsBucket();
  const object = await bucket.get(`sounds/${key}`);
  if (!object) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return new NextResponse(object.body as unknown as BodyInit, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "audio/mpeg",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}
