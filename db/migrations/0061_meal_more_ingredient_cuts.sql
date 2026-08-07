-- Migration: 0061_meal_more_ingredient_cuts
-- Target: Cloudflare D1 (SQLite)
-- Expands meal_foods with specific cuts (đùi, cánh, thăn, nạm, gân...) and
-- organ meats instead of only generic "Thịt gà/Thịt bò", plus more
-- seafood and vegetable variety — commonly-cited per-100g raw nutrition
-- estimates, same as prior food seed migrations.

INSERT INTO meal_foods (id, name, category, calories_per_100g, protein_per_100g, fat_per_100g, carb_per_100g, created_at, updated_at) VALUES
  -- Gà (chicken cuts/organs)
  ('food-dui-ga', 'Đùi gà (có da)', 'thit', 209, 18.0, 15.0, 0.0, datetime('now'), datetime('now')),
  ('food-canh-ga', 'Cánh gà', 'thit', 203, 18.4, 13.8, 0.0, datetime('now'), datetime('now')),
  ('food-chan-ga', 'Chân gà', 'thit', 215, 19.4, 14.6, 0.0, datetime('now'), datetime('now')),
  ('food-gan-ga', 'Gan gà', 'khac', 119, 16.9, 4.8, 0.9, datetime('now'), datetime('now')),
  ('food-me-ga', 'Mề gà', 'khac', 94, 17.7, 2.1, 0.0, datetime('now'), datetime('now')),

  -- Heo (pork cuts/organs)
  ('food-thit-nac-vai', 'Thịt nạc vai heo', 'thit', 143, 21.0, 6.0, 0.0, datetime('now'), datetime('now')),
  ('food-thit-than-heo', 'Thịt thăn heo', 'thit', 143, 22.0, 5.0, 0.0, datetime('now'), datetime('now')),
  ('food-chan-gio-heo', 'Chân giò heo', 'thit', 235, 18.0, 18.0, 0.0, datetime('now'), datetime('now')),
  ('food-suon-non', 'Sườn non', 'thit', 275, 17.0, 23.0, 0.0, datetime('now'), datetime('now')),
  ('food-tai-heo', 'Tai heo', 'thit', 199, 16.0, 15.0, 0.0, datetime('now'), datetime('now')),
  ('food-gan-heo', 'Gan heo', 'khac', 134, 21.0, 3.6, 2.5, datetime('now'), datetime('now')),
  ('food-long-heo', 'Lòng heo', 'khac', 129, 16.0, 6.8, 0.0, datetime('now'), datetime('now')),

  -- Bò (beef cuts/organs)
  ('food-than-bo', 'Thăn bò', 'thit', 218, 21.0, 14.0, 0.0, datetime('now'), datetime('now')),
  ('food-nam-bo', 'Nạm bò', 'thit', 289, 18.0, 24.0, 0.0, datetime('now'), datetime('now')),
  ('food-gan-bo-tendon', 'Gân bò', 'thit', 155, 27.0, 5.0, 0.0, datetime('now'), datetime('now')),
  ('food-bap-bo', 'Bắp bò', 'thit', 172, 22.0, 9.0, 0.0, datetime('now'), datetime('now')),
  ('food-duoi-bo', 'Đuôi bò', 'thit', 240, 20.0, 17.0, 0.0, datetime('now'), datetime('now')),
  ('food-gan-bo', 'Gan bò', 'khac', 135, 20.0, 3.6, 3.9, datetime('now'), datetime('now')),

  -- Vịt (duck cuts)
  ('food-uc-vit', 'Ức vịt (bỏ da)', 'thit', 140, 19.9, 6.7, 0.0, datetime('now'), datetime('now')),
  ('food-dui-vit', 'Đùi vịt', 'thit', 232, 17.0, 18.0, 0.0, datetime('now'), datetime('now')),

  -- Hải sản thêm
  ('food-ca-dieu-hong', 'Cá diêu hồng', 'hai_san', 96, 20.0, 1.7, 0.0, datetime('now'), datetime('now')),
  ('food-ca-tram', 'Cá trắm', 'hai_san', 115, 17.0, 4.8, 0.0, datetime('now'), datetime('now')),
  ('food-bach-tuoc', 'Bạch tuộc', 'hai_san', 82, 14.9, 1.0, 2.2, datetime('now'), datetime('now')),
  ('food-so-diep', 'Sò điệp', 'hai_san', 88, 16.8, 0.8, 3.2, datetime('now'), datetime('now')),
  ('food-hau', 'Hàu', 'hai_san', 68, 7.0, 2.5, 3.9, datetime('now'), datetime('now')),
  ('food-ghe', 'Ghẹ', 'hai_san', 90, 18.0, 1.0, 0.0, datetime('now'), datetime('now')),

  -- Rau củ thêm
  ('food-cai-xanh', 'Rau cải xanh', 'rau_cu_qua', 22, 2.0, 0.3, 3.8, datetime('now'), datetime('now')),
  ('food-rau-den', 'Rau dền', 'rau_cu_qua', 23, 2.5, 0.3, 4.0, datetime('now'), datetime('now')),
  ('food-mong-toi', 'Mồng tơi', 'rau_cu_qua', 19, 1.8, 0.3, 3.4, datetime('now'), datetime('now')),
  ('food-bi-xanh', 'Bí xanh', 'rau_cu_qua', 13, 0.6, 0.2, 3.0, datetime('now'), datetime('now')),
  ('food-ca-tim', 'Cà tím', 'rau_cu_qua', 25, 1.0, 0.2, 6.0, datetime('now'), datetime('now')),
  ('food-dau-bap', 'Đậu bắp', 'rau_cu_qua', 33, 1.9, 0.2, 7.5, datetime('now'), datetime('now')),
  ('food-nam-rom', 'Nấm rơm', 'rau_cu_qua', 27, 3.0, 0.5, 4.0, datetime('now'), datetime('now')),
  ('food-nam-kim-cham', 'Nấm kim châm', 'rau_cu_qua', 37, 2.7, 0.3, 7.8, datetime('now'), datetime('now')),
  ('food-nam-dong-co', 'Nấm đông cô', 'rau_cu_qua', 34, 2.2, 0.5, 6.8, datetime('now'), datetime('now')),
  ('food-mang-tuoi', 'Măng tươi', 'rau_cu_qua', 27, 2.6, 0.3, 5.2, datetime('now'), datetime('now')),
  ('food-ot-chuong', 'Ớt chuông', 'rau_cu_qua', 31, 1.0, 0.3, 6.0, datetime('now'), datetime('now')),
  ('food-can-tay', 'Cần tây', 'rau_cu_qua', 16, 0.7, 0.2, 3.0, datetime('now'), datetime('now'))
ON CONFLICT (name) DO NOTHING;
