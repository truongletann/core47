-- Migration: 0109_mobile_auth
-- Target: Cloudflare D1 (SQLite)
-- Core47 Mobile, milestone 1 (Auth): lets a session row record which
-- device/platform created it, so the mobile bearer-token login
-- (POST /api/mobile/auth/login) can reuse the existing `sessions` table
-- instead of a second auth system. NULL for every existing (web) row.
ALTER TABLE sessions ADD COLUMN platform TEXT;
ALTER TABLE sessions ADD COLUMN device_name TEXT;
