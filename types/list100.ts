export interface List100Item {
  id: string;
  rank: number;
  title: string;
  note: string | null;
  link: string | null;
  isDone: boolean;
  completedAt: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
