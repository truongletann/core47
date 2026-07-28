import { z } from "zod";

// Query contract cho GET /toolkits (public)
export const List100ListQuerySchema = z.object({
  category: z.string().max(40).optional(),
  search: z.string().max(80).optional(),
});

export type List100ListQuery = z.infer<typeof List100ListQuerySchema>;
