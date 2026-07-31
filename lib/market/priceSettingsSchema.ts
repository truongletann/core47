import { z } from "zod";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);
const nullableString = (max: number) =>
  z.string().trim().max(max).nullable().optional().transform(emptyToNull);

export const PriceSettingsSchema = z.object({
  // Blank/omitted = leave the stored key unchanged. Use clearOandaApiKey to remove it.
  oandaApiKey: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  clearOandaApiKey: z.boolean().optional(),
  oandaAccountId: nullableString(50),
  oandaEnvironment: z.enum(["practice", "live"]).default("practice"),
});

export type PriceSettingsInput = z.infer<typeof PriceSettingsSchema>;
