-- Migration: 0086_meal_recipe_time_categories_column
-- Target: Cloudflare D1 (SQLite)
-- Adds meal_categories to meal_recipes — which meal-time(s) a recipe
-- plausibly suits (breakfast/lunch/dinner/snack/dessert), comma-separated
-- like goal_tags. Backfilled by a keyword heuristic in the next migrations.

ALTER TABLE meal_recipes ADD COLUMN meal_categories TEXT;
