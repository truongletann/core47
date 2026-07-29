import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { renderMarkdown } from "@/lib/blog/markdown";

// Renders markdown exactly like the public page (frontmatter, ::: containers,
// emoji...) so the admin preview matches what will actually show on the blog.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const content = (body as { content?: unknown }).content;
  if (typeof content !== "string") {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  const html = renderMarkdown(content);
  return NextResponse.json({ success: true, data: { html } });
}
