import { NextRequest, NextResponse } from "next/server";
import { requireUserBearer } from "@/lib/auth/mobileGuard";

export async function GET(req: NextRequest) {
  const user = await requireUserBearer(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: { user } });
}
