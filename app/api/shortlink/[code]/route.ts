import { NextRequest, NextResponse } from "next/server";
import { deleteShortLink } from "@/lib/shortlink/service";
import { requireUser } from "@/lib/auth/guard";
import { corsHeaders } from "@/lib/cors";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const origin = req.headers.get("origin");
  const { code } = await params;

  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "UNAUTHENTICATED" },
      { status: 401, headers: corsHeaders(origin) },
    );
  }

  try {
    await deleteShortLink(code, { userId: user.id, isAdmin: user.isAdmin });
    return NextResponse.json({ success: true }, { headers: corsHeaders(origin) });
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND" },
        { status: 404, headers: corsHeaders(origin) },
      );
    }
    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { success: false, error: "FORBIDDEN" },
        { status: 403, headers: corsHeaders(origin) },
      );
    }
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR" },
      { status: 500, headers: corsHeaders(origin) },
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}