import { z } from "zod";
import { FieldMappingSchema } from "./calendarFieldMapping";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);
const nullableUrl = () => z.string().trim().url().max(500).nullable().optional().transform(emptyToNull);

// Accepted as a raw JSON string from the admin form textarea — "" or
// null/undefined means "use the built-in default mapping". When present it
// must be valid JSON matching FieldMappingSchema.
const nullableFieldMappingJson = () =>
  z
    .string()
    .trim()
    .max(2000)
    .nullable()
    .optional()
    .transform(emptyToNull)
    .refine(
      (v) => {
        if (v === null) return true;
        try {
          return FieldMappingSchema.safeParse(JSON.parse(v)).success;
        } catch {
          return false;
        }
      },
      { message: "Invalid JSON or missing required fields" },
    );

export const CalendarSettingsSchema = z.object({
  todayFeedUrl: nullableUrl(),
  thisWeekFeedUrl: z.string().trim().url().max(500),
  fieldMapping: nullableFieldMappingJson(),
});

export type CalendarSettingsInput = z.infer<typeof CalendarSettingsSchema>;
