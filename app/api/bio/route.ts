import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { getMyBio, updateBioPage } from "@/lib/bio/service";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const { page, links } = await getMyBio(user.id);
  return NextResponse.json({
    success: true,
    data: { page, links, username: user.username, name: user.name },
  });
}

export async function PUT(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  try {
    const page = await updateBioPage(user.id, body as Parameters<typeof updateBioPage>[1]);
    return NextResponse.json({ success: true, data: { page } });
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }
}
