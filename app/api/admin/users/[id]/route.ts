import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/guard";
import { setUserDisabled } from "@/lib/admin/service";

const BodySchema = z.object({ isDisabled: z.boolean() });

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const { id } = await params;

  if (id === admin.id) {
    return NextResponse.json({ success: false, error: "CANNOT_DISABLE_SELF" }, { status: 400 });
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

  await setUserDisabled(id, parseResult.data.isDisabled);
  return NextResponse.json({ success: true });
}
