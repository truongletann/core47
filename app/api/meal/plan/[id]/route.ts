import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { deletePlanEntry } from "@/lib/meal/service";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await params;
  await deletePlanEntry(user.id, id);
  return NextResponse.json({ success: true });
}
