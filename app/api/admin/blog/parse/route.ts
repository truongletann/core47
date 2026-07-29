import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { parseFrontmatter } from "@/lib/blog/markdown";

// Nhận nguyên văn 1 file .md (có thể có frontmatter YAML ở đầu), trả về
// content đã bỏ frontmatter + các field title/tags đọc được từ frontmatter
// (nếu có) để admin editor tự điền sẵn form khi import file có sẵn.
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
