import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { updateAsset, deleteAsset } from "@/lib/market/portfolioService";
import { PortfolioAssetSchema } from "@/lib/market/portfolioSchema";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = PortfolioAssetSchema.safeParse(body);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return NextResponse.json({ success: false, error: "INVALID_INPUT", issues }, { status: 400 });
  }

  try {
    await updateAsset(user.id, id, parseResult.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "ASSET_NOT_FOUND") {
      return NextResponse.json({ success: false, error: "ASSET_NOT_FOUND" }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: "SERVER_ERROR", message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await params;
  try {
    await deleteAsset(user.id, id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "ASSET_NOT_FOUND") {
      return NextResponse.json({ success: false, error: "ASSET_NOT_FOUND" }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: "SERVER_ERROR", message }, { status: 500 });
  }
}
