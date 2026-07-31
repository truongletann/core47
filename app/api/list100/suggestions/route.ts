import { NextRequest, NextResponse } from "next/server";
import { CreateSuggestionSchema } from "@/lib/list100/schema";
import { createSuggestions } from "@/lib/list100/service";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const allowed = await checkRateLimit(`suggestions:${clientIp(req)}`, 20, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ success: false, error: "TOO_MANY_ATTEMPTS" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  // Honeypot: field hidden from real users; bots that auto-fill every input
  // will fill it in too. A non-empty value is treated as spam — pretend it
  // succeeded so we don't reveal the mechanism.
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
