-- Migration: 0041_remove_bio_yt_dead_tools
-- Target: Cloudflare D1 (SQLite)
-- Tears down the Bio (link-in-bio) and Downloader (yt) tools per user
-- decision — bio only had test data (no uploaded images), downloader's
-- resolver was never configured (api_base_url stayed NULL, so it never
-- worked in prod). Also removes the picture/video/sound placeholder rows,
-- which never had any route/code behind them (404 in prod) — image/video/
-- audio editing isn't feasible on Cloudflare Workers' free plan.

DROP TABLE IF EXISTS bio_links;
DROP TABLE IF EXISTS bio_pages;
DROP TABLE IF EXISTS downloader_settings;

DELETE FROM tools WHERE subdomain IN (
  'bio.core47.xyz',
  'yt.core47.xyz',
  'picture.core47.xyz',
  'video.core47.xyz',
  'sound.core47.xyz'
);
