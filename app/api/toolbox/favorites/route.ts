import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserBySessionId } from "@/lib/auth/service";
import { getFavoriteSlugs, addFavorite } from "@/lib/toolbox/favorites";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";

const BodySchema = z.object({ slug: z.string().min(1).max(64) });

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);
  if (!user) {
    return NextResponse.json({ success: true, data: { slugs: [] } });
  }
  const slugs = await getFavoriteSlugs(user.id);
  return NextResponse.json({ success: true, data: { slugs } });
}

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = BodySchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  await addFavorite(user.id, parseResult.data.slug);
  return NextResponse.json({ success: true });
}
