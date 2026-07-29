import { NextRequest, NextResponse } from "next/server";
import { CreateSuggestionSchema } from "@/lib/list100/schema";
import { createSuggestions } from "@/lib/list100/service";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  // Honeypot: field ẩn khỏi mắt người dùng thật, bot điền form thường tự động
  // fill hết mọi input. Có giá trị => coi như spam, giả vờ thành công để
  // không lộ cơ chế chặn.
  const record = body as Record<string, unknown>;
  if (typeof record.website === "string" && record.website.length > 0) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const parseResult = CreateSuggestionSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  await createSuggestions(parseResult.data);
  return NextResponse.json({ success: true }, { status: 201 });
}
