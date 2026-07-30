import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import { estimateReadingTime } from "@/lib/blog/readingTime";

export function BlogListItem({ post }: { post: BlogPost }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const readingTime = estimateReadingTime(post.content);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <p className="font-data text-xs text-[rgb(var(--muted))]">
        {date}
        {date && " · "}
        {readingTime} min read
      </p>
      <h2 className="font-display mt-1 text-lg text-[rgb(var(--accent))] group-hover:underline">
        {post.title}
      </h2>
    </Link>
  );
}
