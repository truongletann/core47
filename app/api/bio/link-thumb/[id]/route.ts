import { NextRequest, NextResponse } from "next/server";
import { getAvatarsBucket } from "@/lib/storage/r2";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!/^[a-zA-Z0-9-]+$/.test(id)) {
    return NextResponse.json({ error: "INVALID_ID" }, { status: 400 });
  }

  const bucket = await getAvatarsBucket();
  const object = await bucket.get(`bio-link-thumb/${id}`);
  if (!object) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return new NextResponse(object.body as unknown as BodyInit, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
