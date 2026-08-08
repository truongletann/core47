-- Migration: 0103_meal_daily_menu_columns
-- Target: Cloudflare D1 (SQLite)
-- Adds storage for the source dataset's "bang_dinh_duong" field, which was
-- dropped entirely during the original import (flagged by user). It's not
-- per-dish nutrition — it's a sample full-day meal plan the dish appears
-- in (breakfast/lunch/dinner/snack slots, each with its own dish + energy),
-- present for 286/2506 recipes. Storing as reference-only columns, never
-- touched by the admin recipe editor (createRecipe/updateRecipe don't set
-- these) since it's import-sourced context, not something an admin curates.

ALTER TABLE meal_recipes ADD COLUMN daily_menu_note TEXT;
ALTER TABLE meal_recipes ADD COLUMN daily_menu_items TEXT; -- JSON array, see lib/meal/dailyMenu.ts
