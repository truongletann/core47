import { BlogEditor } from "@/components/admin/BlogEditor";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-semibold">New post</h1>
      <BlogEditor mode="create" />
    </div>
  );
}
