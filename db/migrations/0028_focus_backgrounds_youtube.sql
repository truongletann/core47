-- Migration: 0028_focus_backgrounds_youtube
-- Adds a "youtube" source (with optional start/end loop window in seconds)
-- to focus_scene_backgrounds. SQLite can't alter a CHECK constraint in
-- place, so the table is rebuilt and existing rows are copied over.

CREATE TABLE focus_scene_backgrounds_new (
  id              TEXT PRIMARY KEY,
  scene_key       TEXT NOT NULL UNIQUE,
  media_type      TEXT NOT NULL CHECK (media_type IN ('image','video')),
  source          TEXT NOT NULL CHECK (source IN ('r2','external','youtube')),
  url_or_key      TEXT NOT NULL,
  start_seconds   INTEGER,
  end_seconds     INTEGER,
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO focus_scene_backgrounds_new (id, scene_key, media_type, source, url_or_key, updated_at)
SELECT id, scene_key, media_type, source, url_or_key, updated_at FROM focus_scene_backgrounds;

DROP TABLE focus_scene_backgrounds;
ALTER TABLE focus_scene_backgrounds_new RENAME TO focus_scene_backgrounds;
