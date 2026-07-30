import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { getPriceSettings, updatePriceSettings } from "@/lib/market/priceSettingsService";
import { PriceSettingsSchema } from "@/lib/market/priceSettingsSchema";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const settings = await getPriceSettings();
  return NextResponse.json({ success: true, data: { settings } });
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = PriceSettingsSchema.safeParse(body);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return NextResponse.json({ success: false, error: "INVALID_INPUT", issues }, { status: 400 });
  }

  try {
    await updatePriceSettings(parseResult.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: "SERVER_ERROR", message }, { status: 500 });
  }
}
