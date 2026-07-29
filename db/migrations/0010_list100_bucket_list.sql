-- Migration: 0010_list100_bucket_list
-- List 100 pivots to a personal bucket list ("100 things to do before I die"),
-- not a tool/website leaderboard. The old table (0009) had no data yet, so
-- drop and recreate instead of ALTERing multiple columns.

DROP TABLE IF EXISTS list100_items;

CREATE TABLE list100_items (
  id             TEXT PRIMARY KEY,           -- uuid
  rank           INTEGER NOT NULL,           -- position in the list (1-100)
  title          TEXT NOT NULL,              -- the thing to do
  description    TEXT NOT NULL,              -- short description / why it matters
  category       TEXT,                       -- e.g. Travel, Career, Health, Adventure...
  tags           TEXT,                       -- comma-separated
  image_url      TEXT,                       -- illustration / completion photo
  link           TEXT,                       -- reference link (optional)
  status         TEXT NOT NULL DEFAULT 'not_started'
                 CHECK (status IN ('not_started','in_progress','done')),
  target_date    TEXT,                       -- planned timeframe
  completed_at   TEXT,                       -- date actually completed
  note           TEXT,                       -- reflection/story once completed
  is_public      INTEGER NOT NULL DEFAULT 1, -- hidden from the public page if = 0
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_list100_rank      ON list100_items(rank);
CREATE INDEX IF NOT EXISTS idx_list100_status    ON list100_items(status);
CREATE INDEX IF NOT EXISTS idx_list100_category  ON list100_items(category);
CREATE INDEX IF NOT EXISTS idx_list100_is_public ON list100_items(is_public);
