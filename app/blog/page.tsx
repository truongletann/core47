import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { getPublishedPosts, getPublishedTags } from "@/lib/blog/service";
import { BlogGrid } from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getPublishedPosts(), getPublishedTags()]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Blog</h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Notes on building Core47 and whatever else I'm into.
          </p>
        </div>
        <a
          href="/rss.xml"
          className="mt-1 flex shrink-0 items-center gap-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))]"
        >
          <Rss size={14} />
          RSS
        </a>
      </div>

      <div className="mt-8">
        <BlogGrid posts={posts} tags={tags} />
      </div>
    </main>
  );
}
