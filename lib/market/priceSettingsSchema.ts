import { z } from "zod";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);
const nullableString = (max: number) =>
  z.string().trim().max(max).nullable().optional().transform(emptyToNull);

export const PriceSettingsSchema = z.object({
  oandaApiKey: nullableString(200),
  oandaAccountId: nullableString(50),
  oandaEnvironment: z.enum(["practice", "live"]).default("practice"),
});

export type PriceSettingsInput = z.infer<typeof PriceSettingsSchema>;
