import { z } from "zod";

// Query contract cho GET /toolkits (public) — hiện tại chưa cần filter,
// giữ chỗ cho search nếu sau này cần.
export const List100ListQuerySchema = z.object({
  search: z.string().max(80).optional(),
});

export type List100ListQuery = z.infer<typeof List100ListQuerySchema>;
