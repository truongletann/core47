-- Migration: 0052_meal_foods
-- Target: Cloudflare D1 (SQLite)
-- Per-100g nutrition reference for ingredients ("meal_foods"), linked from
-- meal_recipe_ingredients via food_id. Powers per-ingredient calo/macro
-- breakdown and "search recipes by ingredient" (thịt, thịt trứng, ...).
-- Seed values are commonly-cited per-100g nutrition estimates for raw/plain
-- forms of each ingredient — admin can add more or correct these later.

CREATE TABLE IF NOT EXISTS meal_foods (
  id                    TEXT PRIMARY KEY,
  name                  TEXT NOT NULL UNIQUE,
  calories_per_100g     REAL NOT NULL DEFAULT 0,
  protein_per_100g      REAL NOT NULL DEFAULT 0,
  fat_per_100g          REAL NOT NULL DEFAULT 0,
  carb_per_100g         REAL NOT NULL DEFAULT 0,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

ALTER TABLE meal_recipe_ingredients ADD COLUMN food_id TEXT;
CREATE INDEX IF NOT EXISTS idx_meal_recipe_ingredients_food_id ON meal_recipe_ingredients(food_id);

INSERT INTO meal_foods (id, name, calories_per_100g, protein_per_100g, fat_per_100g, carb_per_100g, created_at, updated_at) VALUES
  ('food-thit-heo',    'Thịt heo (nạc)',        188, 24.0, 10.0, 0.0,  datetime('now'), datetime('now')),
  ('food-thit-bo',     'Thịt bò (nạc)',         250, 26.0, 15.0, 0.0,  datetime('now'), datetime('now')),
  ('food-thit-ga',     'Thịt gà (ức, bỏ da)',   165, 31.0, 3.6,  0.0,  datetime('now'), datetime('now')),
  ('food-trung-ga',    'Trứng gà',              155, 13.0, 11.0, 1.1,  datetime('now'), datetime('now')),
  ('food-ca',          'Cá (trung bình)',       105, 18.0, 3.0,  0.0,  datetime('now'), datetime('now')),
  ('food-tom',         'Tôm',                   99,  24.0, 0.3,  0.2,  datetime('now'), datetime('now')),
  ('food-dau-phu',     'Đậu phụ',               76,  8.0,  4.8,  1.9,  datetime('now'), datetime('now')),
  ('food-gao-trang',   'Gạo trắng (nấu chín)',  130, 2.7,  0.3,  28.0, datetime('now'), datetime('now')),
  ('food-khoai-lang',  'Khoai lang',            86,  1.6,  0.1,  20.0, datetime('now'), datetime('now')),
  ('food-sua-tuoi',    'Sữa tươi',              61,  3.2,  3.3,  4.8,  datetime('now'), datetime('now')),
  ('food-rau-muong',   'Rau muống',             19,  2.6,  0.2,  3.1,  datetime('now'), datetime('now')),
  ('food-bong-cai',    'Bông cải xanh',         34,  2.8,  0.4,  6.6,  datetime('now'), datetime('now')),
  ('food-chuoi',       'Chuối',                 89,  1.1,  0.3,  23.0, datetime('now'), datetime('now'))
ON CONFLICT (name) DO NOTHING;
