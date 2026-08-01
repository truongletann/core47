import { z } from "zod";

export const BIO_THEMES = [
  "sunset",
  "ocean",
  "forest",
  "midnight",
  "candy",
  "mono",
  "custom",
] as const;

export const SOCIAL_PLATFORMS = [
  "website",
  "instagram",
  "tiktok",
  "facebook",
  "youtube",
  "twitter",
  "github",
  "telegram",
  "zalo",
  "email",
] as const;

function normalizeUrl(val: string): string {
  const trimmed = val.trim();
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidUrl(val: string): boolean {
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
}

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #ff6600");

export const UpdateBioPageSchema = z.object({
  title: z.string().max(80).optional().default(""),
  bio: z.string().max(280).optional().default(""),
  theme: z.enum(BIO_THEMES).optional().default("sunset"),
  buttonStyle: z.enum(["solid", "outline", "soft"]).optional().default("solid"),
  isPublished: z.boolean().optional().default(true),
  backgroundColor: hexColor.optional().nullable(),
});
export type UpdateBioPageInput = z.input<typeof UpdateBioPageSchema>;

const BioLinkBaseSchema = z.object({
  kind: z.enum(["link", "social"]).default("link"),
  platform: z.enum(SOCIAL_PLATFORMS).optional(),
  title: z.string().max(80).optional(),
  url: z.string().max(2048).optional(),
  icon: z.string().max(40).optional(),
  color: hexColor.optional(),
  subtitle: z.string().max(100).optional(),
  isHeader: z.boolean().optional().default(false),
});

export const CreateBioLinkSchema = BioLinkBaseSchema.superRefine((val, ctx) => {
  if (val.isHeader) return; // headers don't need a real URL
  if (!val.url) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "URL is required", path: ["url"] });
    return;
  }
  if (!isValidUrl(normalizeUrl(val.url))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid URL", path: ["url"] });
  }
}).transform((val) => ({
  ...val,
  url: val.isHeader ? "#" : normalizeUrl(val.url!),
}));
export type CreateBioLinkInput = z.input<typeof CreateBioLinkSchema>;

export const UpdateBioLinkSchema = BioLinkBaseSchema.partial()
  .extend({ isEnabled: z.boolean().optional() })
  .transform((val) => {
    if (val.url === undefined) return val;
    return { ...val, url: val.isHeader ? "#" : normalizeUrl(val.url) };
  });
export type UpdateBioLinkInput = z.input<typeof UpdateBioLinkSchema>;

export const ReorderBioLinksSchema = z.object({
  orderedIds: z.array(z.string()).max(200),
});

export const UsernameParamSchema = z
  .string()
  .min(1)
  .max(32)
  .regex(/^[a-zA-Z0-9_-]+$/);
