-- Migration: 0029_focus_themes
-- Replaces focus_scenes + focus_scene_backgrounds with a single unified
-- theme catalog. No raw R2-hosted video anymore (see focus_themes comment
-- in db/schema.ts) — canvas animations + images + YouTube embeds only.

DROP TABLE IF EXISTS focus_scene_backgrounds;
DROP TABLE IF EXISTS focus_scenes;

CREATE TABLE IF NOT EXISTS focus_themes (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  category          TEXT NOT NULL,
  kind              TEXT NOT NULL CHECK (kind IN ('canvas','image','youtube')),
  source            TEXT NOT NULL CHECK (source IN ('canvas','r2','external','youtube')),
  url_or_key        TEXT NOT NULL,
  thumbnail_url     TEXT,
  start_seconds     INTEGER,
  end_seconds       INTEGER,
  is_enabled        INTEGER NOT NULL DEFAULT 1,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed the original 9 built-in canvas animations as the default "Lofi" category.
INSERT INTO focus_themes (id, name, category, kind, source, url_or_key, sort_order, created_at) VALUES
  ('theme-rainy-window',  'Cửa sổ mưa',     'Lofi', 'canvas', 'canvas', 'rainy-window',  0, datetime('now')),
  ('theme-thunderstorm',  'Giông bão',      'Lofi', 'canvas', 'canvas', 'thunderstorm',  1, datetime('now')),
  ('theme-forest',        'Rừng đom đóm',   'Lofi', 'canvas', 'canvas', 'forest',        2, datetime('now')),
  ('theme-campfire',      'Lửa trại',       'Lofi', 'canvas', 'canvas', 'campfire',      3, datetime('now')),
  ('theme-ocean',         'Sóng biển',      'Lofi', 'canvas', 'canvas', 'ocean',         4, datetime('now')),
  ('theme-snowfall',      'Tuyết rơi',      'Lofi', 'canvas', 'canvas', 'snowfall',      5, datetime('now')),
  ('theme-coffee-shop',   'Quán cà phê',    'Lofi', 'canvas', 'canvas', 'coffee-shop',   6, datetime('now')),
  ('theme-starry-night',  'Bầu trời sao',   'Lofi', 'canvas', 'canvas', 'starry-night',  7, datetime('now')),
  ('theme-library',       'Thư viện',       'Lofi', 'canvas', 'canvas', 'library',       8, datetime('now'))
ON CONFLICT (id) DO NOTHING;
