import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { corsHeaders } from "@/lib/cors";

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const user = await requireUser(req);

  return NextResponse.json(
    { success: true, data: { user } },
    { headers: corsHeaders(origin) },
  );
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}
