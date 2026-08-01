import { NextRequest, NextResponse } from "next/server";
import { resolveDownload, DownloaderNotConfiguredError } from "@/lib/downloader/resolveService";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const allowed = await checkRateLimit(`download-resolve:${clientIp(req)}`, 20, 60_000);
  if (!allowed) {
    return NextResponse.json({ success: false, error: "RATE_LIMITED" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  try {
    const result = await resolveDownload(body as Parameters<typeof resolveDownload>[0]);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    if (err instanceof DownloaderNotConfiguredError) {
      return NextResponse.json({ success: false, error: "DOWNLOADER_NOT_CONFIGURED" }, { status: 503 });
    }
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }
}
