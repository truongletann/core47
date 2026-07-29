import { z } from "zod";

export const List100StatusEnum = z.enum(["not_started", "in_progress", "done"]);

// Query contract cho GET /toolkits (public)
export const List100ListQuerySchema = z.object({
  category: z.string().max(60).optional(),
  status: List100StatusEnum.optional(),
  search: z.string().max(80).optional(),
});

export type List100ListQuery = z.infer<typeof List100ListQuerySchema>;
