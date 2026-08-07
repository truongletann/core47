import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { listPlanEntries, createPlanEntry } from "@/lib/meal/service";
import { PlanEntrySchema } from "@/lib/meal/schema";

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

  const entries = await listPlanEntries(user.id, from, to);
  return NextResponse.json({ success: true, data: { entries } });
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = PlanEntrySchema.safeParse(body);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return NextResponse.json({ success: false, error: "INVALID_INPUT", issues }, { status: 400 });
  }

  try {
    const entry = await createPlanEntry(user.id, parseResult.data);
    return NextResponse.json({ success: true, data: { entry } }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "RECIPE_NOT_FOUND") {
      return NextResponse.json({ success: false, error: "RECIPE_NOT_FOUND" }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: "SERVER_ERROR", message }, { status: 500 });
  }
}
