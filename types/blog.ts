export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  contentHtml: string;
  coverImageUrl: string | null;
  tags: string[];
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
