import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { addBioLink, reorderBioLinks } from "@/lib/bio/service";
import { ReorderBioLinksSchema } from "@/lib/bio/schema";

export async function POST(req: NextRequest) {
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
    const link = await addBioLink(user.id, body as Parameters<typeof addBioLink>[1]);
    return NextResponse.json({ success: true, data: { link } });
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
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

  const parsed = ReorderBioLinksSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  await reorderBioLinks(user.id, parsed.data.orderedIds);
  return NextResponse.json({ success: true });
}
