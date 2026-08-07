-- Migration: 0062_meal_aromatics
-- Target: Cloudflare D1 (SQLite)
-- Adds common aromatic/seasoning staples (hành tím, hành lá, tỏi, đường,
-- chanh, ớt, gừng) that recipe instructions reference but weren't
-- previously in meal_foods at all — fixes recipes whose "Cách làm" step
-- mentioned an ingredient absent from its own "Nguyên liệu" list.

INSERT INTO meal_foods (id, name, category, calories_per_100g, protein_per_100g, fat_per_100g, carb_per_100g, created_at, updated_at) VALUES
  ('food-hanh-tim', 'Hành tím', 'rau_cu_qua', 72, 2.5, 0.1, 16.8, datetime('now'), datetime('now')),
  ('food-hanh-la', 'Hành lá', 'rau_cu_qua', 32, 1.8, 0.2, 7.3, datetime('now'), datetime('now')),
  ('food-toi', 'Tỏi', 'rau_cu_qua', 149, 6.4, 0.5, 33.0, datetime('now'), datetime('now')),
  ('food-duong', 'Đường', 'khac', 387, 0.0, 0.0, 100.0, datetime('now'), datetime('now')),
  ('food-chanh', 'Chanh', 'rau_cu_qua', 30, 0.7, 0.2, 10.5, datetime('now'), datetime('now')),
  ('food-ot', 'Ớt', 'rau_cu_qua', 40, 1.9, 0.4, 8.8, datetime('now'), datetime('now')),
  ('food-gung', 'Gừng', 'rau_cu_qua', 80, 1.8, 0.8, 17.8, datetime('now'), datetime('now'))
ON CONFLICT (name) DO NOTHING;
