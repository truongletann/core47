-- Migration: 0011_list100_simplify
-- Simplify List 100 as much as requested: drop category/tags/imageUrl/targetDate
-- and the 3-tier status, leaving just done/not-done. The table had no data yet
-- (a UI bug was blocking item creation), so drop & recreate instead of ALTERing
-- multiple columns.

DROP TABLE IF EXISTS list100_items;

CREATE TABLE list100_items (
  id             TEXT PRIMARY KEY,           -- uuid
  rank           INTEGER NOT NULL,           -- position in the list (1-100)
  title          TEXT NOT NULL,              -- the thing to do
  note           TEXT,                       -- short note shown in parentheses
  link           TEXT,                       -- reference link (optional)
  is_done        INTEGER NOT NULL DEFAULT 0,
  completed_at   TEXT,                       -- auto-set when is_done = 1
  is_public      INTEGER NOT NULL DEFAULT 1, -- hidden from the public page if = 0
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_list100_rank      ON list100_items(rank);
CREATE INDEX IF NOT EXISTS idx_list100_is_public ON list100_items(is_public);
