import { z } from "zod";

export const ToolStatusEnum = z.enum(["active", "beta", "soon"]);

export const ToolSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  name: z.string().min(1).max(80),
  description: z.string().min(1).max(240),
  subdomain: z
    .string()
    .regex(/^[a-z0-9-]+\.core47\.xyz$/, "Invalid subdomain"),
  icon: z.string().min(1).max(40),
  categoryId: z.string().min(1).max(40),
  status: ToolStatusEnum,
  sortOrder: z.number().int().nonnegative(),
});

export const CategorySchema = z.object({
  id: z.string().min(1).max(40),
  name: z.string().min(1).max(80),
  sortOrder: z.number().int().nonnegative(),
});

// Query contract cho GET /api/tools
export const ToolListQuerySchema = z.object({
  category: z.string().max(40).optional(),
  search: z.string().max(80).optional(),
  status: ToolStatusEnum.optional(),
});

export type ToolListQuery = z.infer<typeof ToolListQuerySchema>;