import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listList100Admin, createList100Item } from "@/lib/admin/service";
import { List100ItemSchema } from "@/lib/admin/schema";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const items = await listList100Admin();
  return NextResponse.json({ success: true, data: { items } });
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

  const parseResult = List100ItemSchema.safeParse(body);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return NextResponse.json({ success: false, error: "INVALID_INPUT", issues }, { status: 400 });
  }

  try {
    const item = await createList100Item(parseResult.data);
    return NextResponse.json({ success: true, data: { item } }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: "SERVER_ERROR", message }, { status: 500 });
  }
}
