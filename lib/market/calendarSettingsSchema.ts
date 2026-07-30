import { z } from "zod";

export const CalendarSettingsSchema = z.object({
  thisWeekFeedUrl: z.string().trim().url().max(500),
});

export type CalendarSettingsInput = z.infer<typeof CalendarSettingsSchema>;
