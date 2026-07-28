-- Migration: 0008_tool_favorites
CREATE TABLE IF NOT EXISTS tool_favorites (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  tool_slug   TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tool_favorites_user_tool ON tool_favorites(user_id, tool_slug);
CREATE INDEX IF NOT EXISTS idx_tool_favorites_user ON tool_favorites(user_id);
