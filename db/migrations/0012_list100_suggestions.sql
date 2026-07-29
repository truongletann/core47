-- Migration: 0012_list100_suggestions
CREATE TABLE IF NOT EXISTS list100_suggestions (
  id          TEXT PRIMARY KEY,
  name        TEXT,
  content     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_list100_suggestions_created ON list100_suggestions(created_at);
