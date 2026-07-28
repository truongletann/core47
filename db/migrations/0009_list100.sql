-- Migration: 0009_list100
CREATE TABLE IF NOT EXISTS list100_items (
  id                TEXT PRIMARY KEY,           -- uuid
  rank              INTEGER NOT NULL,
  name              TEXT NOT NULL,
  description       TEXT NOT NULL,
  long_description  TEXT,
  url               TEXT NOT NULL,
  image_url         TEXT,
  category           TEXT,
  tags              TEXT,                       -- comma-separated
  score             REAL,
  status            TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published','draft')),
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_list100_rank     ON list100_items(rank);
CREATE INDEX IF NOT EXISTS idx_list100_status   ON list100_items(status);
CREATE INDEX IF NOT EXISTS idx_list100_category ON list100_items(category);
