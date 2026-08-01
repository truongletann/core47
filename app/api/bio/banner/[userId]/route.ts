import { NextRequest, NextResponse } from "next/server";
import { getAvatarsBucket } from "@/lib/storage/r2";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  if (!/^[a-zA-Z0-9-]+$/.test(userId)) {
    return NextResponse.json({ error: "INVALID_ID" }, { status: 400 });
  }

  const bucket = await getAvatarsBucket();
  const object = await bucket.get(`bio-banner/${userId}`);
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
