import { z } from "zod";

// Query contract for GET /toolkits (public) — no filters needed yet,
// left as a placeholder for search if it's ever needed.
export const List100ListQuerySchema = z.object({
  search: z.string().max(80).optional(),
});

export type List100ListQuery = z.infer<typeof List100ListQuerySchema>;

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);

// Contract for POST /api/list100/suggestions (public, no login required)
// Allows submitting multiple suggestions at once — each item creates its
// own record so they can be reviewed independently.
export const CreateSuggestionSchema = z.object({
  name: z.string().trim().max(60).optional().transform(emptyToNull),
  items: z
    .array(z.string().trim().min(3, "Content is too short").max(500))
    .min(1, "At least 1 suggestion is required")
    .max(20, "Max 20 suggestions per submission"),
});

export type CreateSuggestionInput = z.infer<typeof CreateSuggestionSchema>;
