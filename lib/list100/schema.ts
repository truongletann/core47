import { z } from "zod";

// Query contract cho GET /toolkits (public) — hiện tại chưa cần filter,
// giữ chỗ cho search nếu sau này cần.
export const List100ListQuerySchema = z.object({
  search: z.string().max(80).optional(),
});

export type List100ListQuery = z.infer<typeof List100ListQuerySchema>;

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);

// Contract cho POST /api/list100/suggestions (public, không cần đăng nhập)
// Cho phép gửi nhiều gợi ý cùng lúc — mỗi phần tử tạo 1 bản ghi riêng để duyệt độc lập.
export const CreateSuggestionSchema = z.object({
  name: z.string().trim().max(60).optional().transform(emptyToNull),
  items: z
    .array(z.string().trim().min(3, "Nội dung quá ngắn").max(500))
    .min(1, "Cần ít nhất 1 gợi ý")
    .max(20, "Tối đa 20 gợi ý mỗi lần gửi"),
});

export type CreateSuggestionInput = z.infer<typeof CreateSuggestionSchema>;
