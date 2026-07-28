-- Migration: 0007_last_login
ALTER TABLE users ADD COLUMN last_login_at TEXT;
