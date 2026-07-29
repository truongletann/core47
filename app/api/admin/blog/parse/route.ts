import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { parseFrontmatter } from "@/lib/blog/markdown";

// Accepts the raw text of a .md file (may have YAML frontmatter at the top)
// and returns the content with frontmatter stripped, plus any title/tags
// fields read from the frontmatter, so the admin editor can prefill the
// form when importing an existing file.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const raw = (body as { raw?: unknown }).raw;
  if (typeof raw !== "string") {
    return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  const { data, content } = parseFrontmatter(raw);

  const title = typeof data.title === "string" ? data.title : null;
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t) => typeof t === "string").join(", ")
    : typeof data.tags === "string"
      ? data.tags
      : null;

  return NextResponse.json({
    success: true,
    data: { title, tags, content: content.trim() },
  });
}
