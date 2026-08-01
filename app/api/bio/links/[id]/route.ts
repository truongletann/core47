import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { updateBioLink, deleteBioLink } from "@/lib/bio/service";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  try {
    const link = await updateBioLink(user.id, id, body as Parameters<typeof updateBioLink>[2]);
    return NextResponse.json({ success: true, data: { link } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "ERROR";
    const status = message === "NOT_FOUND" ? 404 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }
  const { id } = await params;

  try {
    await deleteBioLink(user.id, id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "ERROR";
    const status = message === "NOT_FOUND" ? 404 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
