-- Migration: 0044_shorten_category_names
-- Target: Cloudflare D1 (SQLite)
-- Shortens category display names — the full names ("Dev & Utilities",
-- "Productivity & Money", "Links & Sharing") were too wide for the filter
-- pill row.

UPDATE categories SET name = 'Dev Tools'    WHERE id = 'dev-utilities';
UPDATE categories SET name = 'Productivity' WHERE id = 'productivity';
UPDATE categories SET name = 'Links'        WHERE id = 'links';
