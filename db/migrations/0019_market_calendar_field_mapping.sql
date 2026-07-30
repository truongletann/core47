-- Migration: 0019_market_calendar_field_mapping
-- NULL means "use the built-in default mapping" (see lib/market/calendarFieldMapping.ts).
ALTER TABLE calendar_settings ADD COLUMN field_mapping TEXT;
