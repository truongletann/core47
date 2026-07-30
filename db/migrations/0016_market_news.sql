-- Migration: 0016_market_news
CREATE TABLE IF NOT EXISTS rss_sources (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  url          TEXT NOT NULL UNIQUE,
  category     TEXT,                         -- free text, e.g. "forex", "macro", "crypto"
  enabled      INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS news_articles (
  id             TEXT PRIMARY KEY,
  source_id      TEXT NOT NULL,
  title          TEXT NOT NULL,
  link           TEXT NOT NULL UNIQUE,        -- dedup key
  summary        TEXT,
  image_url      TEXT,
  published_at   TEXT NOT NULL,
  fetched_at     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_source_id ON news_articles(source_id);
