import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "@/lib/blog/service";
import { renderMarkdown } from "@/lib/blog/markdown";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Core47 Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content);
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      {post.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImageUrl}
          alt=""
          className="mb-8 aspect-video w-full rounded-xl object-cover"
        />
      )}

      <h1 className="font-display text-3xl font-semibold">{post.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {date && <span className="font-data text-xs text-[rgb(var(--muted))]">{date}</span>}
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="font-data rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-1.5 py-0.5 text-[11px] text-[rgb(var(--muted))]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="prose dark:prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
