import { z } from "zod";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);
const nullableUrl = () => z.string().trim().url().max(500).nullable().optional().transform(emptyToNull);

export const CalendarSettingsSchema = z.object({
  todayFeedUrl: nullableUrl(),
  thisWeekFeedUrl: z.string().trim().url().max(500),
});

export type CalendarSettingsInput = z.infer<typeof CalendarSettingsSchema>;
