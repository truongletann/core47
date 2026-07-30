-- Migration: 0024_focus

CREATE TABLE IF NOT EXISTS focus_tasks (
  id                    TEXT PRIMARY KEY,
  user_id               TEXT NOT NULL,
  title                 TEXT NOT NULL,
  estimated_pomodoros   INTEGER NOT NULL DEFAULT 1,
  completed_pomodoros   INTEGER NOT NULL DEFAULT 0,
  is_done               INTEGER NOT NULL DEFAULT 0,
  sort_order            INTEGER NOT NULL DEFAULT 0,
  created_at            TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_focus_tasks_user_id ON focus_tasks(user_id);

CREATE TABLE IF NOT EXISTS focus_sessions (
  id                  TEXT PRIMARY KEY,
  user_id             TEXT NOT NULL,
  task_id             TEXT,
  type                TEXT NOT NULL CHECK (type IN ('work','break')),
  duration_minutes    INTEGER NOT NULL,
  completed_at        TEXT NOT NULL,
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_completed_at ON focus_sessions(completed_at);

CREATE TABLE IF NOT EXISTS focus_habits (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL,
  name          TEXT NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_focus_habits_user_id ON focus_habits(user_id);

CREATE TABLE IF NOT EXISTS focus_habit_logs (
  id            TEXT PRIMARY KEY,
  habit_id      TEXT NOT NULL,
  log_date      TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (habit_id, log_date)
);
CREATE INDEX IF NOT EXISTS idx_focus_habit_logs_habit_id ON focus_habit_logs(habit_id);

CREATE TABLE IF NOT EXISTS focus_presets (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  name            TEXT NOT NULL,
  sound_ids       TEXT NOT NULL,
  scene_key       TEXT NOT NULL,
  work_minutes    INTEGER NOT NULL DEFAULT 25,
  break_minutes   INTEGER NOT NULL DEFAULT 5,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_focus_presets_user_id ON focus_presets(user_id);

CREATE TABLE IF NOT EXISTS focus_settings (
  id                            TEXT PRIMARY KEY,
  work_minutes                  INTEGER NOT NULL DEFAULT 25,
  break_minutes                 INTEGER NOT NULL DEFAULT 5,
  long_break_minutes            INTEGER NOT NULL DEFAULT 15,
  sessions_before_long_break    INTEGER NOT NULL DEFAULT 4,
  updated_at                    TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO focus_settings (id, work_minutes, break_minutes, long_break_minutes, sessions_before_long_break, updated_at)
VALUES ('default', 25, 5, 15, 4, datetime('now'))
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS focus_sound_tracks (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  source        TEXT NOT NULL CHECK (source IN ('bundled','r2','external')),
  url_or_key    TEXT NOT NULL,
  is_enabled    INTEGER NOT NULL DEFAULT 1,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Default bundled ambient tracks (synthesized loops shipped in public/sounds/)
INSERT INTO focus_sound_tracks (id, name, category, source, url_or_key, sort_order, created_at) VALUES
  ('snd-rain-light',   'Mưa nhẹ',           'rain',    'bundled', '/sounds/rain-light.wav',    0, datetime('now')),
  ('snd-rain-heavy',   'Mưa to',            'rain',    'bundled', '/sounds/rain-heavy.wav',    1, datetime('now')),
  ('snd-rain-window',  'Mưa trên cửa kính', 'rain',    'bundled', '/sounds/rain-window.wav',   2, datetime('now')),
  ('snd-thunder',      'Sấm sét',           'thunder', 'bundled', '/sounds/thunder.wav',       3, datetime('now')),
  ('snd-rain-thunder', 'Mưa giông',         'thunder', 'bundled', '/sounds/rain-thunder.wav',  4, datetime('now')),
  ('snd-forest',       'Rừng cây',          'nature',  'bundled', '/sounds/forest.wav',        5, datetime('now')),
  ('snd-campfire',     'Lửa trại',          'nature',  'bundled', '/sounds/campfire.wav',      6, datetime('now')),
  ('snd-ocean',        'Sóng biển',         'nature',  'bundled', '/sounds/ocean.wav',         7, datetime('now')),
  ('snd-coffee-shop',  'Quán cà phê',       'ambience','bundled', '/sounds/coffee-shop.wav',   8, datetime('now')),
  ('snd-snow-wind',    'Gió tuyết',         'nature',  'bundled', '/sounds/snow-wind.wav',     9, datetime('now'))
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS focus_playlists (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  spotify_embed_url   TEXT NOT NULL,
  category            TEXT,
  is_enabled          INTEGER NOT NULL DEFAULT 1,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Curated public Spotify playlists (Study/Chill/Lofi) — admin can add more
-- via the admin panel without a redeploy.
INSERT INTO focus_playlists (id, name, spotify_embed_url, category, sort_order, created_at) VALUES
  ('pl-lofi-girl',   'Lofi Girl - beats to study/relax', 'https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM', 'lofi',  0, datetime('now')),
  ('pl-deep-focus',  'Deep Focus',                        'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ', 'focus', 1, datetime('now')),
  ('pl-jazz-coffee', 'Jazz & Coffee',                      'https://open.spotify.com/embed/playlist/37i9dQZF1DX6ziVCJnEm59', 'jazz',  2, datetime('now')),
  ('pl-chillhop',    'Chillhop Essentials',                'https://open.spotify.com/embed/playlist/37i9dQZF1DX0SM0LYsmbMT', 'chill', 3, datetime('now'))
ON CONFLICT (id) DO NOTHING;

-- Register the Focus subdomain in the site's tool listing (same pattern as
-- genqr/beautysql/shortlink).
INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order, created_at, updated_at)
VALUES (
  'tool-focus',
  'focus',
  'Focus',
  'Pomodoro timer, task list, âm thanh & hoạt ảnh tập trung, theo dõi thói quen.',
  'focus.core47.xyz',
  'Timer',
  'utility',
  'active',
  10,
  datetime('now'),
  datetime('now')
)
ON CONFLICT (slug) DO NOTHING;
