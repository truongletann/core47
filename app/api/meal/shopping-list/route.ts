import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { getShoppingList } from "@/lib/meal/service";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  if (!DATE_RE.test(from) || !DATE_RE.test(to)) {
    return NextResponse.json({ success: false, error: "INVALID_RANGE" }, { status: 400 });
  }

  const items = await getShoppingList(user.id, from, to);
  return NextResponse.json({ success: true, data: { items } });
}
