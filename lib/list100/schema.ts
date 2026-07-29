import { z } from "zod";

// Query contract cho GET /toolkits (public) — hiện tại chưa cần filter,
// giữ chỗ cho search nếu sau này cần.
export const List100ListQuerySchema = z.object({
  search: z.string().max(80).optional(),
});

export type List100ListQuery = z.infer<typeof List100ListQuerySchema>;

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);

// Contract cho POST /api/list100/suggestions (public, không cần đăng nhập)
export const CreateSuggestionSchema = z.object({
  name: z.string().max(60).optional().transform(emptyToNull),
  content: z.string().trim().min(3, "Nội dung quá ngắn").max(500),
});

export type CreateSuggestionInput = z.infer<typeof CreateSuggestionSchema>;
