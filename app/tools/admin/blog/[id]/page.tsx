import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { getBlogPostAdminById } from "@/lib/admin/service";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPostAdminById(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-semibold">Edit post</h1>
      <BlogEditor
        mode="edit"
        postId={post.id}
        initial={{
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImageKey: post.coverImageKey,
          tags: post.tags ?? "",
          status: post.status as "draft" | "published",
        }}
      />
    </div>
  );
}
