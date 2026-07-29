export type List100Status = "not_started" | "in_progress" | "done";

export interface List100Item {
  id: string;
  rank: number;
  title: string;
  description: string;
  category: string | null;
  tags: string[];
  imageUrl: string | null;
  link: string | null;
  status: List100Status;
  targetDate: string | null;
  completedAt: string | null;
  note: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
