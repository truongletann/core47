import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { listTasks, createTask } from "@/lib/focus/service";
import { TaskSchema } from "@/lib/focus/schema";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });

  const tasks = await listTasks(user.id);
  return NextResponse.json({ success: true, data: { tasks } });
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

  const parsed = TaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const task = await createTask(user.id, parsed.data);
  return NextResponse.json({ success: true, data: { task } }, { status: 201 });
}
