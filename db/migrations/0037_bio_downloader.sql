-- Migration: 0037_bio_downloader
-- Target: Cloudflare D1 (SQLite)
-- Adds tables for the Bio (link-in-bio) tool and the universal media
-- Downloader tool, and registers both subdomains in the tool listing.

CREATE TABLE IF NOT EXISTS bio_pages (
  user_id       TEXT PRIMARY KEY,
  title         TEXT NOT NULL DEFAULT '',
  bio           TEXT NOT NULL DEFAULT '',
  avatar_key    TEXT,
  theme         TEXT NOT NULL DEFAULT 'sunset',
  button_style  TEXT NOT NULL DEFAULT 'solid' CHECK (button_style IN ('solid','outline','soft')),
  is_published  INTEGER NOT NULL DEFAULT 1,
  short_code    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bio_links (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  kind        TEXT NOT NULL DEFAULT 'link' CHECK (kind IN ('link','social')),
  platform    TEXT,
  title       TEXT,
  url         TEXT NOT NULL,
  icon        TEXT,
  is_enabled  INTEGER NOT NULL DEFAULT 1,
  clicks      INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bio_links_user ON bio_links(user_id);

CREATE TABLE IF NOT EXISTS downloader_settings (
  id            TEXT PRIMARY KEY,
  api_base_url  TEXT,
  api_key       TEXT,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO downloader_settings (id, api_base_url, api_key, updated_at)
VALUES ('default', NULL, NULL, datetime('now'))
ON CONFLICT (id) DO NOTHING;

-- Both subdomains already had a placeholder "coming soon" row on the remote
-- DB (seeded ahead of time, id/slug don't match what a fresh INSERT would
-- use) — ON CONFLICT(subdomain) flips those to active in place instead of
-- colliding with the UNIQUE(subdomain) constraint; a fresh environment
-- without the placeholder just inserts a new row.
INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order, created_at, updated_at)
VALUES (
  'tool-bio',
  'bio',
  'Bio Page',
  'Tạo trang link-in-bio cá nhân — gộp mọi liên kết mạng xã hội vào một trang, chia sẻ qua link to2.site ngắn gọn.',
  'bio.core47.xyz',
  'UserRound',
  'utility',
  'active',
  13,
  datetime('now'),
  datetime('now')
)
ON CONFLICT (subdomain) DO UPDATE SET
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  status = 'active',
  updated_at = datetime('now');

INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order, created_at, updated_at)
VALUES (
  'tool-yt',
  'yt',
  'Downloader',
  'Tải video/âm thanh từ YouTube, ảnh và video từ Instagram, video từ Facebook — chọn chất lượng, tải trực tiếp.',
  'yt.core47.xyz',
  'Download',
  'media',
  'active',
  14,
  datetime('now'),
  datetime('now')
)
ON CONFLICT (subdomain) DO UPDATE SET
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  status = 'active',
  updated_at = datetime('now');
