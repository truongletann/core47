import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listSymbolsAdmin, createSymbol } from "@/lib/market/priceSymbolsService";
import { PriceSymbolSchema } from "@/lib/market/priceSymbolsSchema";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const symbols = await listSymbolsAdmin();
  return NextResponse.json({ success: true, data: { symbols } });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = PriceSymbolSchema.safeParse(body);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return NextResponse.json({ success: false, error: "INVALID_INPUT", issues }, { status: 400 });
  }

  try {
    const symbol = await createSymbol(parseResult.data);
    return NextResponse.json({ success: true, data: { symbol } }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "SYMBOL_TAKEN") {
      return NextResponse.json({ success: false, error: "SYMBOL_TAKEN" }, { status: 409 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: "SERVER_ERROR", message }, { status: 500 });
  }
}
