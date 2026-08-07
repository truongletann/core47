import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { getTarget, upsertTarget } from "@/lib/meal/service";
import { TargetSchema } from "@/lib/meal/schema";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const target = await getTarget(user.id);
  return NextResponse.json({ success: true, data: { target } });
}

export async function PUT(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = TargetSchema.safeParse(body);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return NextResponse.json({ success: false, error: "INVALID_INPUT", issues }, { status: 400 });
  }

  const target = await upsertTarget(user.id, parseResult.data);
  return NextResponse.json({ success: true, data: { target } });
}
