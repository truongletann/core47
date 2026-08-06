import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { updateBlogPost, deleteBlogPost } from "@/lib/admin/service";
import { BlogPostSchema } from "@/lib/admin/schema";
import { renderMarkdown } from "@/lib/blog/markdown";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parseResult = BlogPostSchema.safeParse(body);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return NextResponse.json({ success: false, error: "INVALID_INPUT", issues }, { status: 400 });
  }

  try {
    const html = renderMarkdown(parseResult.data.content);
    await updateBlogPost(id, parseResult.data, html);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "SLUG_TAKEN") {
      return NextResponse.json({ success: false, error: "SLUG_TAKEN" }, { status: 409 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: "SERVER_ERROR", message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });

  const { id } = await params;
  await deleteBlogPost(id);
  return NextResponse.json({ success: true });
}
