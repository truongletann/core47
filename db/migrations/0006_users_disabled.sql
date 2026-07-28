-- Migration: 0006_users_disabled
ALTER TABLE users ADD COLUMN is_disabled INTEGER NOT NULL DEFAULT 0;
