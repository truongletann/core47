import Link from "next/link";
import type { BlogPost } from "@/types/blog";

export function BlogListItem({ post }: { post: BlogPost }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      {date && <p className="font-data text-xs text-[rgb(var(--muted))]">{date}</p>}
      <h2 className="font-display mt-1 text-lg text-[rgb(var(--accent))] group-hover:underline">
        {post.title}
      </h2>
    </Link>
  );
}
