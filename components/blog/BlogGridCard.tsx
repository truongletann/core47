import Link from "next/link";
import type { BlogPost } from "@/types/blog";

export function BlogGridCard({ post }: { post: BlogPost }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="aspect-video w-full overflow-hidden bg-[rgb(var(--border)/0.4)]">
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-3xl font-semibold text-[rgb(var(--border))]">
              47
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="font-display text-lg font-semibold group-hover:text-[rgb(var(--accent))]">
          {post.title}
        </h2>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-[rgb(var(--muted))]">
          {post.excerpt}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {date && <span className="font-data text-xs text-[rgb(var(--muted))]">{date}</span>}
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-data rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-1.5 py-0.5 text-[11px] text-[rgb(var(--muted))]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
