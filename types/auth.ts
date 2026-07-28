export interface User {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
  createdAt: string;
}
