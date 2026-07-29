import { z } from "zod";

function normalizeUrl(val: string): string {
  const trimmed = val.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const CreateShortLinkSchema = z.object({
  url: z
    .string()
    .min(1, "Please enter a URL")
    .max(2048, "URL is too long")
    .transform(normalizeUrl)
    .refine(
      (val) => {
        try {
          // eslint-disable-next-line no-new
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid URL, check the spelling" },
    )
    .refine(
      (val) => {
        try {
          return !/(^|\.)core47\.xyz$/i.test(new URL(val).hostname);
        } catch {
          return false;
        }
      },
      { message: "Can't shorten a link that points back to core47.xyz" },
    ),
  customCode: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(20, "Code must be at most 20 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Only letters, numbers, and hyphens allowed")
    .optional(),
});

export type CreateShortLinkInput = z.input<typeof CreateShortLinkSchema>;

export const ShortCodeParamSchema = z
  .string()
  .min(1)
  .max(20)
  .regex(/^[a-zA-Z0-9-]+$/);