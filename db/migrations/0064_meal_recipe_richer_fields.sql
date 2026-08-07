-- Migration: 0064_meal_recipe_richer_fields
-- Target: Cloudflare D1 (SQLite)
-- Adds columns needed to hold the fuller recipe structure (serving/plating
-- notes, tips, expert advice, suggested side-dish combo) from the richer
-- recipe dataset being imported next, plus per-ingredient note + the
-- original raw ingredient line (parsing free-text quantities is lossy, so
-- keeping the raw line lets an admin manually fix outliers later).

ALTER TABLE meal_recipes ADD COLUMN serving_notes TEXT;
ALTER TABLE meal_recipes ADD COLUMN tips TEXT;
ALTER TABLE meal_recipes ADD COLUMN expert_advice TEXT;
ALTER TABLE meal_recipes ADD COLUMN suggested_combo TEXT;

ALTER TABLE meal_recipe_ingredients ADD COLUMN note TEXT;
ALTER TABLE meal_recipe_ingredients ADD COLUMN raw_text TEXT;
