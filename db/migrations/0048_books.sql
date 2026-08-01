-- Migration: 0048_books
-- Target: Cloudflare D1 (SQLite)
-- Adds the Books (books.core47.xyz) personal ebook library — open upload,
-- admin-only delete for moderation.

CREATE TABLE IF NOT EXISTS library_books (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  author        TEXT,
  description   TEXT,
  file_type     TEXT NOT NULL CHECK (file_type IN ('pdf','epub')),
  file_key      TEXT NOT NULL,
  file_size     INTEGER NOT NULL,
  uploader_ip   TEXT,
  created_at    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_library_books_created ON library_books(created_at);

INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order, created_at, updated_at)
VALUES (
  'tool-books',
  'books',
  'Books',
  'Thư viện ebook — đọc PDF/EPUB ngay trên trình duyệt, ai cũng upload được.',
  'books.core47.xyz',
  'BookOpen',
  'documents',
  'active',
  14,
  datetime('now'),
  datetime('now')
)
ON CONFLICT (subdomain) DO NOTHING;
