-- Migration: 0001_init_tools
-- Target: Cloudflare D1 (SQLite)

CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY,          -- slug-based id, e.g. 'media'
  name        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tools (
  id            TEXT PRIMARY KEY,            -- uuid
  slug          TEXT NOT NULL UNIQUE,        -- e.g. 'genqr'
  name          TEXT NOT NULL,
  description   TEXT NOT NULL,
  subdomain     TEXT NOT NULL UNIQUE,        -- e.g. 'genqr.core47.xyz'
  icon          TEXT NOT NULL,               -- lucide-react icon key
  category_id   TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','beta','soon')),
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_status   ON tools(status);