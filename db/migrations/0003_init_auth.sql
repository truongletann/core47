-- Migration: 0003_init_auth
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  is_admin      INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  expires_at  TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Thêm cột theo dõi cho short_links: ai tạo, từ đâu, bằng gì
ALTER TABLE short_links ADD COLUMN user_id TEXT;
ALTER TABLE short_links ADD COLUMN ip_address TEXT;
ALTER TABLE short_links ADD COLUMN user_agent TEXT;

CREATE INDEX IF NOT EXISTS idx_short_links_user ON short_links(user_id);