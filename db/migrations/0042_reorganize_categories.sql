-- Migration: 0042_reorganize_categories
-- Target: Cloudflare D1 (SQLite)
-- Replaces the old category set (media/text/utility) with one that matches
-- what's actually live after the bio/downloader teardown. "media" had 0
-- tools left, "text" had only shortlink, "utility" was an overloaded
-- catch-all for 6 unrelated tools. New categories also give the upcoming
-- expense tracker a natural home (productivity).

INSERT INTO categories (id, name, sort_order) VALUES
  ('dev-utilities', 'Dev & Utilities', 1),
  ('documents', 'Documents', 2),
  ('productivity', 'Productivity & Money', 3),
  ('links', 'Links & Sharing', 4)
ON CONFLICT (id) DO NOTHING;

UPDATE tools SET category_id = 'dev-utilities' WHERE slug IN ('tools', 'random', 'keyboard');
UPDATE tools SET category_id = 'documents'     WHERE slug IN ('pdf', 'file');
UPDATE tools SET category_id = 'productivity'  WHERE slug IN ('focus');
UPDATE tools SET category_id = 'links'         WHERE slug IN ('shortlink');

-- Catch-all: any tool still left on an old category (e.g. stray local-dev
-- seed rows not covered by the explicit slugs above) falls back to
-- dev-utilities instead of blocking the DELETE below on a FK violation.
UPDATE tools SET category_id = 'dev-utilities' WHERE category_id IN ('media', 'text', 'utility');

DELETE FROM categories WHERE id IN ('media', 'text', 'utility');
