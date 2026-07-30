-- Migration: 0017_market_calendar
CREATE TABLE IF NOT EXISTS calendar_events (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  country       TEXT NOT NULL,               -- currency code, e.g. USD, EUR, JPY
  event_date    TEXT NOT NULL,               -- ISO date, e.g. 2026-07-27
  event_time    TEXT,                        -- raw string from feed, e.g. "8:00am", "All Day", "Tentative"
  impact        TEXT NOT NULL DEFAULT 'low' CHECK (impact IN ('holiday','low','medium','high')),
  forecast      TEXT,
  previous      TEXT,
  actual        TEXT,
  source_url    TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,  -- preserves the feed's original ordering
  fetched_at    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(event_date);
