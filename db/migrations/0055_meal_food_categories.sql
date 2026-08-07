-- Migration: 0055_meal_food_categories
-- Target: Cloudflare D1 (SQLite)
-- Adds a category to meal_foods (thit/hai_san/rau_cu_qua/tinh_bot/khac) so
-- the recipe library's ingredient filter can group foods the same way a
-- typical recipe site does. Backfills every existing row.

ALTER TABLE meal_foods ADD COLUMN category TEXT NOT NULL DEFAULT 'khac';

UPDATE meal_foods SET category = 'thit' WHERE id IN
  ('food-thit-heo', 'food-thit-bo', 'food-thit-ga', 'food-thit-vit');

UPDATE meal_foods SET category = 'hai_san' WHERE id IN
  ('food-ca', 'food-tom', 'food-muc');

UPDATE meal_foods SET category = 'rau_cu_qua' WHERE id IN
  ('food-rau-muong', 'food-bong-cai', 'food-ca-chua', 'food-dua-leo', 'food-nam',
   'food-bi-do', 'food-cai-bo-xoi', 'food-ngo', 'food-dau-que', 'food-hanh-tay',
   'food-khoai-lang', 'food-chuoi', 'food-qua-bo');

UPDATE meal_foods SET category = 'tinh_bot' WHERE id IN
  ('food-gao-trang', 'food-banh-mi', 'food-bun-pho', 'food-yen-mach');

UPDATE meal_foods SET category = 'khac' WHERE id IN
  ('food-trung-ga', 'food-dau-phu', 'food-sua-tuoi', 'food-dau-oliu', 'food-hanh-nhan',
   'food-sua-chua', 'food-bo-dau-phong', 'food-pho-mai', 'food-dau-lang');
