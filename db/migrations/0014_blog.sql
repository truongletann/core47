-- Migration: 0014_blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id                TEXT PRIMARY KEY,
  slug              TEXT NOT NULL UNIQUE,
  title             TEXT NOT NULL,
  excerpt           TEXT NOT NULL,
  content           TEXT NOT NULL,           -- markdown
  cover_image_key   TEXT,                    -- key trong R2 bucket AVATARS, prefix blog-covers/
  tags              TEXT,                    -- comma-separated
  status            TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at      TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
