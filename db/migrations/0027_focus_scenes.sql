-- Migration: 0027_focus_scenes

CREATE TABLE IF NOT EXISTS focus_scenes (
  id            TEXT PRIMARY KEY,
  key           TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  is_enabled    INTEGER NOT NULL DEFAULT 1,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed with the original hardcoded scenes so existing
-- focus_scene_backgrounds / focus_presets rows keep matching by key.
INSERT INTO focus_scenes (id, key, name, sort_order, created_at) VALUES
  ('scene-rainy-window',  'rainy-window',  'Cửa sổ mưa',     0, datetime('now')),
  ('scene-thunderstorm',  'thunderstorm',  'Giông bão',      1, datetime('now')),
  ('scene-forest',        'forest',        'Rừng đom đóm',   2, datetime('now')),
  ('scene-campfire',      'campfire',      'Lửa trại',       3, datetime('now')),
  ('scene-ocean',         'ocean',         'Sóng biển',      4, datetime('now')),
  ('scene-snowfall',      'snowfall',      'Tuyết rơi',      5, datetime('now')),
  ('scene-coffee-shop',   'coffee-shop',   'Quán cà phê',    6, datetime('now')),
  ('scene-starry-night',  'starry-night',  'Bầu trời sao',   7, datetime('now')),
  ('scene-library',       'library',       'Thư viện',       8, datetime('now'))
ON CONFLICT (key) DO NOTHING;
