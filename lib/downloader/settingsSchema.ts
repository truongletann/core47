import { z } from "zod";

export const DownloaderSettingsSchema = z.object({
  apiBaseUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.replace(/\/+$/, "") : "")),
  apiKey: z.string().trim().max(500).optional().or(z.literal("")),
  clearApiKey: z.boolean().optional().default(false),
});
export type DownloaderSettingsInput = z.input<typeof DownloaderSettingsSchema>;
