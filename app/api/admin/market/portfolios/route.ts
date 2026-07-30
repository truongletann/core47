import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listAllAssetsAdmin, listAllTransactionsAdmin } from "@/lib/market/portfolioService";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const [assets, transactions] = await Promise.all([listAllAssetsAdmin(), listAllTransactionsAdmin()]);
  return NextResponse.json({ success: true, data: { assets, transactions } });
}
