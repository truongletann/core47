-- Migration: 0051_meal_planner
-- Target: Cloudflare D1 (SQLite)
-- Meal planner MVP: admin-authored recipes (macros entered as totals per
-- serving, not derived from a per-ingredient nutrition DB — keeps data
-- entry low for one admin), per-user calorie/macro targets, a per-day meal
-- plan, and shopping lists computed on the fly from plan entries (no
-- separate shopping_list table).

CREATE TABLE IF NOT EXISTS meal_recipes (
  id                     TEXT PRIMARY KEY,
  name                   TEXT NOT NULL,
  description            TEXT,
  instructions           TEXT NOT NULL,
  servings               INTEGER NOT NULL DEFAULT 1,
  calories_per_serving   REAL NOT NULL DEFAULT 0,
  protein_g              REAL NOT NULL DEFAULT 0,
  fat_g                  REAL NOT NULL DEFAULT 0,
  carb_g                 REAL NOT NULL DEFAULT 0,
  goal_tags              TEXT,
  created_at             TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at             TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS meal_recipe_ingredients (
  id           TEXT PRIMARY KEY,
  recipe_id    TEXT NOT NULL,
  name         TEXT NOT NULL,
  quantity     REAL NOT NULL,
  unit         TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS meal_targets (
  user_id           TEXT PRIMARY KEY,
  goal              TEXT NOT NULL DEFAULT 'maintain' CHECK (goal IN ('lose_weight','maintain','gain_weight','gain_muscle')),
  target_calories   REAL NOT NULL,
  target_protein_g  REAL NOT NULL DEFAULT 0,
  target_fat_g      REAL NOT NULL DEFAULT 0,
  target_carb_g     REAL NOT NULL DEFAULT 0,
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS meal_plan_entries (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  date        TEXT NOT NULL,
  meal_slot   TEXT NOT NULL CHECK (meal_slot IN ('breakfast','lunch','dinner','snack')),
  recipe_id   TEXT NOT NULL,
  servings    REAL NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_meal_recipe_ingredients_recipe_id ON meal_recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_entries_user_date ON meal_plan_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_plan_entries_recipe_id ON meal_plan_entries(recipe_id);

-- Register the Meal subdomain in the site's tool listing.
INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order, created_at, updated_at)
VALUES (
  'tool-meal',
  'meal',
  'Meal Planner',
  'Lên thực đơn theo tuần/tháng, tính calo & macro theo mục tiêu, tự tạo danh sách đi chợ.',
  'meal.core47.xyz',
  'Utensils',
  'productivity',
  'active',
  14,
  datetime('now'),
  datetime('now')
)
ON CONFLICT (subdomain) DO NOTHING;
