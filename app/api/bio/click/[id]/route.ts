import { NextRequest, NextResponse } from "next/server";
import { incrementBioLinkClicks } from "@/lib/bio/service";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

// Public, unauthenticated beacon fired from the bio page when a visitor
// clicks a link — rate-limited per IP since it's a public write endpoint.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-zA-Z0-9-]+$/.test(id)) {
    return NextResponse.json({ success: false, error: "INVALID_ID" }, { status: 400 });
  }

  const allowed = await checkRateLimit(`bio-click:${clientIp(req)}`, 60, 60_000);
  if (!allowed) {
    return NextResponse.json({ success: false, error: "RATE_LIMITED" }, { status: 429 });
  }

  await incrementBioLinkClicks(id);
  return NextResponse.json({ success: true });
}
