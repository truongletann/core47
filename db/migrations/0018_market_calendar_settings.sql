-- Migration: 0018_market_calendar_settings
CREATE TABLE IF NOT EXISTS calendar_settings (
  id                 TEXT PRIMARY KEY,
  today_feed_url     TEXT,
  thisweek_feed_url  TEXT NOT NULL,
  updated_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO calendar_settings (id, today_feed_url, thisweek_feed_url, updated_at)
VALUES (
  'default',
  'https://nfs.faireconomy.media/ff_calendar_today.xml',
  'https://nfs.faireconomy.media/ff_calendar_thisweek.xml',
  datetime('now')
)
ON CONFLICT (id) DO NOTHING;
