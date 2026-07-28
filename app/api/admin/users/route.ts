import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listUsersAdmin } from "@/lib/admin/service";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const list = await listUsersAdmin();
  return NextResponse.json({ success: true, data: { users: list } });
}
