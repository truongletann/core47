import { NextRequest, NextResponse } from "next/server";
import { resolveShortLink } from "@/lib/shortlink/service";
import { ShortCodeParamSchema } from "@/lib/shortlink/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  const parseResult = ShortCodeParamSchema.safeParse(code);
  if (!parseResult.success) {
    return NextResponse.json({ success: false, error: "INVALID_CODE" }, { status: 400 });
  }

  const targetUrl = await resolveShortLink(parseResult.data);

  if (!targetUrl) {
    return NextResponse.json({ success: false, error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.redirect(targetUrl, 302);
}