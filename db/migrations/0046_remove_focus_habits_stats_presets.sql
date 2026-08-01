-- Migration: 0046_remove_focus_habits_stats_presets
-- Target: Cloudflare D1 (SQLite)
-- Per user decision: remove Focus Habits and Focus Stats (both had full
-- working pages/API but were never linked from the main Focus timer UI —
-- unreachable without typing the URL directly) and Focus Presets (backend
-- only, no UI was ever built). Focus is fully usable without all three.

DROP TABLE IF EXISTS focus_habit_logs;
DROP TABLE IF EXISTS focus_habits;
DROP TABLE IF EXISTS focus_presets;
