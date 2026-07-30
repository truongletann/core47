import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { listSessions, logSession } from "@/lib/focus/service";
import { SessionSchema } from "@/lib/focus/schema";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const since = req.nextUrl.searchParams.get("since") ?? undefined;
  const sessions = await listSessions(user.id, since);
  return NextResponse.json({ success: true, data: { sessions } });
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = SessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const session = await logSession(user.id, parsed.data);
  return NextResponse.json({ success: true, data: { session } }, { status: 201 });
}
