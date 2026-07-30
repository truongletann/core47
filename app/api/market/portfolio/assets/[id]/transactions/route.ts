import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { listTransactions, createTransaction, getAsset } from "@/lib/market/portfolioService";
import { TransactionSchema } from "@/lib/market/portfolioSchema";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await params;
  const asset = await getAsset(user.id, id);
  if (!asset) return NextResponse.json({ success: false, error: "ASSET_NOT_FOUND" }, { status: 404 });

  const transactions = await listTransactions(user.id, id);
  return NextResponse.json({ success: true, data: { transactions } });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = TransactionSchema.safeParse(body);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return NextResponse.json({ success: false, error: "INVALID_INPUT", issues }, { status: 400 });
  }

  try {
    const transaction = await createTransaction(user.id, id, parseResult.data);
    return NextResponse.json({ success: true, data: { transaction } }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "ASSET_NOT_FOUND") {
      return NextResponse.json({ success: false, error: "ASSET_NOT_FOUND" }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: "SERVER_ERROR", message }, { status: 500 });
  }
}
