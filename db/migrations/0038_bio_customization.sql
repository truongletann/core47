-- Migration: 0038_bio_customization
-- Target: Cloudflare D1 (SQLite)
-- Richer bio-page customization: per-link colors/subtitle/thumbnail,
-- section-header links, a cover banner, and a custom solid background.

ALTER TABLE bio_links ADD COLUMN color TEXT;
ALTER TABLE bio_links ADD COLUMN subtitle TEXT;
ALTER TABLE bio_links ADD COLUMN thumbnail_key TEXT;
ALTER TABLE bio_links ADD COLUMN is_header INTEGER NOT NULL DEFAULT 0;

ALTER TABLE bio_pages ADD COLUMN banner_key TEXT;
ALTER TABLE bio_pages ADD COLUMN background_color TEXT;
