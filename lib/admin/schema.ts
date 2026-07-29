import { z } from "zod";

export const CategorySchema = z.object({
  id: z
    .string()
    .min(1)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Chỉ chữ thường, số và dấu gạch ngang"),
  name: z.string().min(1).max(80),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(80),
  sortOrder: z.coerce.number().int().nonnegative(),
});

export const ToolSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Chỉ chữ thường, số và dấu gạch ngang"),
  name: z.string().min(1).max(80),
  description: z.string().min(1).max(240),
  subdomain: z
    .string()
    .regex(/^[a-z0-9-]+\.core47\.xyz$/, "Phải đúng dạng xxx.core47.xyz"),
  icon: z.string().min(1).max(40),
  categoryId: z.string().min(1).max(40),
  status: z.enum(["active", "beta", "soon"]),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
});

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);

export const List100ItemSchema = z.object({
  rank: z.coerce.number().int().positive().max(100),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(240),
  category: z.string().max(60).optional().transform(emptyToNull),
  tags: z.string().max(300).optional().transform(emptyToNull),
  imageUrl: z.string().max(500).optional().transform(emptyToNull),
  link: z
    .string()
    .max(500)
    .optional()
    .transform(emptyToNull)
    .refine((v) => v === null || /^https?:\/\//.test(v), "Link phải bắt đầu bằng http(s)://"),
  status: z.enum(["not_started", "in_progress", "done"]),
  targetDate: z.string().max(40).optional().transform(emptyToNull),
  completedAt: z.string().max(40).optional().transform(emptyToNull),
  note: z.string().max(4000).optional().transform(emptyToNull),
  isPublic: z.coerce.boolean().default(true),
});

export type CategoryInput = z.infer<typeof CategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type ToolInput = z.infer<typeof ToolSchema>;
export type List100ItemInput = z.infer<typeof List100ItemSchema>;
