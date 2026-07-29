import { getPublishedPosts, getPublishedTags } from "@/lib/blog/service";
import { BlogGrid } from "@/components/blog/BlogGrid";

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getPublishedPosts(), getPublishedTags()]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">Blog</h1>
      <p className="mt-2 text-sm text-[rgb(var(--muted))]">
        Notes on building Core47 and whatever else I'm into.
      </p>

      <div className="mt-8">
        <BlogGrid posts={posts} tags={tags} />
      </div>
    </main>
  );
}
