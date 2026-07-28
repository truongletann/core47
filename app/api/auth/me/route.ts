import { NextRequest, NextResponse } from "next/server";
import { getUserBySessionId } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { corsHeaders } from "@/lib/cors";

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);

  return NextResponse.json(
    { success: true, data: { user } },
    { headers: corsHeaders(origin) },
  );
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}
