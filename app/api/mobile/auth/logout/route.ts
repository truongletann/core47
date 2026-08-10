import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/service";
import { getBearerSessionId } from "@/lib/auth/mobileGuard";

export async function POST(req: NextRequest) {
  const sessionId = getBearerSessionId(req);
  if (sessionId) {
    await deleteSession(sessionId);
  }
  return NextResponse.json({ success: true });
}
