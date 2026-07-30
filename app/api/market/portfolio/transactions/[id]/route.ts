import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { deleteTransaction } from "@/lib/market/portfolioService";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await params;
  await deleteTransaction(user.id, id);
  return NextResponse.json({ success: true });
}
