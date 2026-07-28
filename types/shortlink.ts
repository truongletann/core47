export interface ShortLink {
  id: string;
  code: string;
  targetUrl: string;
  clicks: number;
  createdAt: string;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
}