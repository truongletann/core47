-- Migration: 0025_focus_backgrounds

CREATE TABLE IF NOT EXISTS focus_scene_backgrounds (
  id            TEXT PRIMARY KEY,
  scene_key     TEXT NOT NULL UNIQUE,
  media_type    TEXT NOT NULL CHECK (media_type IN ('image','video')),
  source        TEXT NOT NULL CHECK (source IN ('r2','external')),
  url_or_key    TEXT NOT NULL,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
