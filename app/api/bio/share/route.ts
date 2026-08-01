import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { getBioShareLink } from "@/lib/bio/service";

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }
  if (!user.username) {
    return NextResponse.json({ success: false, error: "USERNAME_REQUIRED" }, { status: 400 });
  }

  const shortUrl = await getBioShareLink(user.id, user.username);
  return NextResponse.json({ success: true, data: { shortUrl } });
}
