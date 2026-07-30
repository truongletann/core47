import { z } from "zod";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);
const nullableString = (max: number) =>
  z.string().trim().max(max).nullable().optional().transform(emptyToNull);

export const RssSourceSchema = z.object({
  name: z.string().trim().min(1).max(80),
  url: z.string().trim().url().max(500),
  category: nullableString(40),
  enabled: z.coerce.boolean().default(true),
});

export type RssSourceInput = z.infer<typeof RssSourceSchema>;
