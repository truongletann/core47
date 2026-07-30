-- Migration: 0020_market_fxtin
-- Calendar switches from ForexFactory's XML feed to fxtin.com's JSON API
-- (which has actual values); new columns capture its richer shape.
ALTER TABLE calendar_events ADD COLUMN star INTEGER NOT NULL DEFAULT 0;
ALTER TABLE calendar_events ADD COLUMN influence INTEGER;
ALTER TABLE calendar_events ADD COLUMN flag_url TEXT;
ALTER TABLE calendar_events ADD COLUMN event_kind TEXT NOT NULL DEFAULT 'economic' CHECK (event_kind IN ('economic','speech'));

-- fxtin's real-time flash news ("Latest Stories"), separate from the
-- RSS-aggregated News tab.
CREATE TABLE IF NOT EXISTS fxtin_news (
  id               TEXT PRIMARY KEY,
  information_id   TEXT NOT NULL UNIQUE,
  content          TEXT NOT NULL,
  time             TEXT,
  important        INTEGER NOT NULL DEFAULT 0,
  published_at     TEXT NOT NULL,
  fetched_at       TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fxtin_news_published_at ON fxtin_news(published_at);

-- Repoint the calendar base URL at fxtin's per-day endpoint (date is
-- appended by application code, e.g. ?important=0&date=2026/7/30).
UPDATE calendar_settings
SET thisweek_feed_url = 'https://www.fxtin.com/page/finance/calendarEvents'
WHERE id = 'default';
