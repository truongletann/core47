export type List100Status = "published" | "draft";

export interface List100Item {
  id: string;
  rank: number;
  name: string;
  description: string;
  longDescription: string | null;
  url: string;
  imageUrl: string | null;
  category: string | null;
  tags: string[];
  score: number | null;
  status: List100Status;
  createdAt: string;
  updatedAt: string;
}
