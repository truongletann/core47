export type ToolStatus = "active" | "beta" | "soon";

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  subdomain: string;
  icon: string;
  categoryId: string;
  status: ToolStatus;
  sortOrder: number;
}