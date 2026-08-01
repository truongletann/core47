import { z } from "zod";

export const BIO_THEMES = [
  "sunset",
  "ocean",
  "forest",
  "midnight",
  "candy",
  "mono",
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

const urlField = z
  .string()
  .min(1, "URL is required")
  .max(2048)
  .transform(normalizeUrl)
  .refine(
    (val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid URL" },
  );

export const UpdateBioPageSchema = z.object({
  title: z.string().max(80).optional().default(""),
  bio: z.string().max(280).optional().default(""),
  theme: z.enum(BIO_THEMES).optional().default("sunset"),
  buttonStyle: z.enum(["solid", "outline", "soft"]).optional().default("solid"),
  isPublished: z.boolean().optional().default(true),
});
export type UpdateBioPageInput = z.input<typeof UpdateBioPageSchema>;

export const CreateBioLinkSchema = z.object({
  kind: z.enum(["link", "social"]).default("link"),
  platform: z.enum(SOCIAL_PLATFORMS).optional(),
  title: z.string().max(80).optional(),
  url: urlField,
  icon: z.string().max(40).optional(),
});
export type CreateBioLinkInput = z.input<typeof CreateBioLinkSchema>;

export const UpdateBioLinkSchema = CreateBioLinkSchema.partial().extend({
  isEnabled: z.boolean().optional(),
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
