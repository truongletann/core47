import { z } from "zod";

export const CategorySchema = z.object({
  id: z
    .string()
    .min(1)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
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
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1).max(80),
  description: z.string().min(1).max(240),
  subdomain: z
    .string()
    .regex(/^[a-z0-9-]+\.core47\.xyz$/, "Must match the xxx.core47.xyz format"),
  icon: z.string().min(1).max(40),
  categoryId: z.string().min(1).max(40),
  status: z.enum(["active", "beta", "soon"]),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
});

// Accepts "" | null | undefined and normalizes all of them to null — the
// client may legitimately send an explicit null (e.g. after clearing a
// field), which a plain z.string().optional() rejects since optional()
// only allows undefined, not null.
const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);
const nullableString = (max: number) => z.string().trim().max(max).nullable().optional().transform(emptyToNull);
const nullableNonNegativeInt = () =>
  z.preprocess((v) => {
    if (v === "" || v === undefined || v === null) return null;
    const n = Number(v);
    return Number.isNaN(n) ? v : n;
  }, z.number().int().nonnegative().nullable());

export const List100ItemSchema = z.object({
  rank: z.coerce.number().int().positive().max(100),
  title: z.string().trim().min(1).max(280),
  note: nullableString(300),
  link: nullableString(500).refine(
    (v) => v === null || /^https?:\/\//.test(v),
    "Link must start with http(s)://",
  ),
  isDone: z.coerce.boolean().default(false),
  progressCurrent: nullableNonNegativeInt(),
  progressTarget: nullableNonNegativeInt(),
  isPublic: z.coerce.boolean().default(true),
  suggestedBy: nullableString(60),
}).refine(
  (v) => v.progressCurrent === null || v.progressTarget === null || v.progressCurrent <= v.progressTarget,
  { message: "Current progress can't exceed the target", path: ["progressCurrent"] },
);

export const BlogPostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().trim().min(1).max(160),
  excerpt: z.string().trim().max(300),
  content: z.string().min(1).max(50000),
  coverImageKey: nullableString(200),
  tags: nullableString(300),
  status: z.enum(["draft", "published"]),
});

export type CategoryInput = z.infer<typeof CategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type ToolInput = z.infer<typeof ToolSchema>;
export type List100ItemInput = z.infer<typeof List100ItemSchema>;
export type BlogPostInput = z.infer<typeof BlogPostSchema>;
