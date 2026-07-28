-- Migration: 0002_init_shortlinks
CREATE TABLE IF NOT EXISTS short_links (
  id          TEXT PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE,
  target_url  TEXT NOT NULL,
  clicks      INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_short_links_code ON short_links(code);