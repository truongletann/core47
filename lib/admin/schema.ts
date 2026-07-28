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

export type CategoryInput = z.infer<typeof CategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type ToolInput = z.infer<typeof ToolSchema>;
