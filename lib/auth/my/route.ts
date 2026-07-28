import { NextRequest, NextResponse } from "next/server";
import { getUserBySessionId } from "@/lib/auth/service";
import { getHistoryForUser } from "@/lib/shortlink/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { SHORT_DOMAIN } from "@/lib/shortlink/config";

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);

  if (!user) {
    return NextResponse.json({ success: true, data: { links: [], loggedIn: false } });
  }

  const links = await getHistoryForUser(user.id, user.isAdmin);

  return NextResponse.json({
    success: true,
    data: {
      loggedIn: true,
      isAdmin: user.isAdmin,
      shortDomain: SHORT_DOMAIN,
      links: links.map((l) => ({
        code: l.code,
        targetUrl: l.targetUrl,
        clicks: l.clicks,
        createdAt: l.createdAt,
        creatorEmail: l.creatorEmail,
      })),
    },
  });
}
