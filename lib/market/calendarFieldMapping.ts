import { z } from "zod";

// Maps our logical calendar fields to dot-paths into the parsed feed
// document. itemPath locates the array of events from the document root
// (e.g. "weeklyevents.event" for the current ForexFactory XML shape); the
// rest are paths *within* a single event item. Stored as JSON in
// calendar_settings.field_mapping so a renamed/moved tag can be fixed from
// the admin CMS instead of a code deploy.
export const FieldMappingSchema = z.object({
  itemPath: z.string().trim().min(1),
  title: z.string().trim().min(1),
  country: z.string().trim().min(1),
  date: z.string().trim().min(1),
  time: z.string().trim().min(1),
  impact: z.string().trim().min(1),
  forecast: z.string().trim().min(1),
  previous: z.string().trim().min(1),
  actual: z.string().trim().min(1),
  url: z.string().trim().min(1),
});

export type CalendarFieldMapping = z.infer<typeof FieldMappingSchema>;

// Matches the current nfs.faireconomy.media XML shape:
// <weeklyevents><event><title>...</title>...</event></weeklyevents>
export const DEFAULT_FIELD_MAPPING: CalendarFieldMapping = {
  itemPath: "weeklyevents.event",
  title: "title",
  country: "country",
  date: "date",
  time: "time",
  impact: "impact",
  forecast: "forecast",
  previous: "previous",
  actual: "actual",
  url: "url",
};

// Resolves a dot-path ("a.b.c") into a nested parsed-XML object. Only plain
// dot-nesting is supported — enough for the shapes fast-xml-parser produces.
export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// Parses a stored field_mapping JSON string, falling back to the default on
// missing/invalid input (malformed JSON should never break the fetch job).
export function resolveFieldMapping(raw: string | null): CalendarFieldMapping {
  if (!raw) return DEFAULT_FIELD_MAPPING;
  try {
    const parsed = JSON.parse(raw);
    const result = FieldMappingSchema.safeParse(parsed);
    return result.success ? result.data : DEFAULT_FIELD_MAPPING;
  } catch {
    return DEFAULT_FIELD_MAPPING;
  }
}
