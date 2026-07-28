import { NextRequest, NextResponse } from "next/server";
import { getUserBySessionId } from "@/lib/auth/service";
import { removeFavorite } from "@/lib/toolbox/favorites";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const { slug } = await params;
  await removeFavorite(user.id, slug);
  return NextResponse.json({ success: true });
}
