import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { blogPosts } from "@/db/schema";
import type { BlogPost } from "@/types/blog";
import { fallbackExcerpt } from "./excerpt";

function toBlogPost(r: typeof blogPosts.$inferSelect): BlogPost {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt || fallbackExcerpt(r.content),
    content: r.content,
    coverImageUrl: r.coverImageKey ? `/api/blog/cover/${r.coverImageKey}` : null,
    tags: r.tags ? r.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    status: r.status as BlogPost["status"],
    publishedAt: r.publishedAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));

  return rows.map(toBlogPost);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = await getDb();
  const row = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
    .get();

  return row ? toBlogPost(row) : null;
}

export async function getPublishedTags(): Promise<string[]> {
  const db = await getDb();
  const rows = await db
    .select({ tags: blogPosts.tags })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"));

  const set = new Set<string>();
  for (const r of rows) {
    if (!r.tags) continue;
    r.tags.split(",").map((t) => t.trim()).filter(Boolean).forEach((t) => set.add(t));
  }
  return Array.from(set).sort();
}
