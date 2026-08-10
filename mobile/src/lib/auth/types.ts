// Mirrors core47's types/auth.ts User shape. Duplicated rather than
// imported — mobile/ is a separate TypeScript project (own tsconfig, own
// node_modules) by design, see IMPLEMENTATION_PLAN.md §3.
export interface User {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
  isDisabled: boolean;
  createdAt: string;
}
