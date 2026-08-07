-- Migration: 0058_meal_vietnamese_recipes_2
-- Target: Cloudflare D1 (SQLite)
-- Adds 8 more raw-ingredient meal_foods entries and 21 more iconic
-- Vietnamese dishes across regions — self-authored, not sourced from
-- any external site.

INSERT INTO meal_foods (id, name, category, calories_per_100g, protein_per_100g, fat_per_100g, carb_per_100g, created_at, updated_at) VALUES
  ('food-nep', 'Gạo nếp (đã nấu)', 'tinh_bot', 172, 3.5, 0.6, 37.6, datetime('now'), datetime('now')),
  ('food-dau-phong-song', 'Đậu phộng (sống)', 'khac', 567, 25.8, 49.2, 16.1, datetime('now'), datetime('now')),
  ('food-me', 'Me chua', 'rau_cu_qua', 239, 2.8, 0.6, 62.5, datetime('now'), datetime('now')),
  ('food-la-lot', 'Lá lốt', 'rau_cu_qua', 39, 4.3, 0.4, 6.2, datetime('now'), datetime('now')),
  ('food-oc', 'Ốc (thịt)', 'hai_san', 90, 16.1, 1.4, 2, datetime('now'), datetime('now')),
  ('food-thit-de', 'Thịt dê', 'thit', 143, 20.6, 6.1, 0, datetime('now'), datetime('now')),
  ('food-vung', 'Vừng (mè)', 'khac', 573, 17.7, 49.7, 23.5, datetime('now'), datetime('now')),
  ('food-dua-nao', 'Dừa nạo', 'khac', 354, 3.3, 33.5, 15.2, datetime('now'), datetime('now'))
ON CONFLICT (name) DO NOTHING;

INSERT INTO meal_recipes (id, name, description, instructions, servings, calories_per_serving, protein_g, fat_g, carb_g, goal_tags, created_at, updated_at) VALUES
  ('recipe4-xoi-ga', 'Xôi gà xé', 'Món sáng no lâu, phổ biến khắp ba miền.', '1. Đồ chín gạo nếp thành xôi.
2. Luộc gà, xé sợi.
3. Múc xôi ra đĩa, xếp gà xé lên trên, rắc hành phi.', 1, 509, 38, 4.8, 75.2, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe4-banh-cuon-thit-nam', 'Bánh cuốn nhân thịt nấm', 'Món sáng miền Bắc, mềm mịn thơm nấm.', '1. Tráng bánh cuốn từ bột gạo.
2. Xào nhân thịt bằm với nấm mèo.
3. Cuốn nhân vào bánh, dọn kèm nước mắm.', 1, 394, 29.6, 10.6, 43.7, 'maintain', datetime('now'), datetime('now')),
  ('recipe4-bun-rieu-cua', 'Bún riêu cua', 'Món nước đậm vị cua đồng, chua thanh.', '1. Nấu nước dùng cùng cà chua.
2. Cho riêu cua đã giã vào, đun sôi nhẹ tới nổi từng mảng.
3. Trụng bún, chan nước dùng, xếp riêu cua lên trên.', 1, 382, 33, 2.9, 53.9, 'maintain', datetime('now'), datetime('now')),
  ('recipe4-cha-ca-la-vong', 'Chả cá lá lốt', 'Đặc sản Hà Nội, cá chiên thơm nghệ và thì là.', '1. Ướp cá với nghệ, mắm tôm.
2. Chiên cá vàng đều.
3. Ăn kèm bún và rau thơm, lá lốt.', 2, 245, 29, 4.7, 19.7, 'maintain', datetime('now'), datetime('now')),
  ('recipe4-oc-xao-sa-ot', 'Ốc xào sả ớt', 'Món nhậu quen thuộc, đậm vị sả ớt.', '1. Ngâm ốc cho nhả nhớt, luộc sơ.
2. Phi thơm sả ớt.
3. Xào ốc cùng sả ớt lửa lớn, nêm nếm đậm đà.', 2, 150, 24.4, 2.2, 6.8, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe4-nem-nuong', 'Nem nướng', 'Món nướng thơm lừng, ăn kèm bánh tráng cuốn.', '1. Trộn thịt bằm với gia vị, vo viên dài.
2. Nướng chín vàng trên than.
3. Cuốn cùng bánh tráng, bún, rau sống.', 2, 309, 25, 10.1, 29.1, 'maintain', datetime('now'), datetime('now')),
  ('recipe4-banh-khot', 'Bánh khọt tôm', 'Bánh chiên giòn nhỏ xinh, đặc sản Vũng Tàu.', '1. Pha bột gạo với nước cốt dừa.
2. Đổ bột vào khuôn, cho tôm lên trên.
3. Chiên giòn đáy bánh, dọn cùng rau sống.', 2, 229, 20.6, 6.5, 22, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe4-lau-thai-hai-san', 'Lẩu Thái hải sản', 'Món lẩu chua cay, hợp tụ họp gia đình.', '1. Nấu nước lẩu chua cay cùng sả, cà chua.
2. Thả tôm, mực, nghêu vào nấu chín.
3. Ăn kèm rau và bún.', 3, 200, 36.8, 1.9, 8.2, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe4-thit-de-nuong-la-lot', 'Thịt dê nướng lá lốt', 'Món nướng đặc sản, thơm mùi lá lốt.', '1. Ướp thịt dê với gia vị.
2. Cuốn thịt trong lá lốt.
3. Nướng chín thơm trên than hoa.', 2, 189, 26.8, 7.7, 1.6, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe4-che-troi-nuoc', 'Chè trôi nước', 'Món tráng miệng truyền thống, nhân đậu xanh.', '1. Nặn bột nếp thành viên, nhồi nhân đậu xanh.
2. Luộc chín viên chè.
3. Chan nước đường gừng và nước cốt dừa.', 2, 269, 6.7, 6.7, 46.8, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe4-banh-trang-tron', 'Bánh tráng trộn', 'Món vặt quen thuộc học trò, chua cay giòn.', '1. Cắt sợi bánh tráng.
2. Trộn cùng khô bò, tôm khô, đậu phộng, rau răm.
3. Nêm nước mắm chua ngọt, trộn đều.', 1, 336, 15.2, 8.1, 52.2, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe4-goi-ga-la-chanh', 'Gỏi gà lá chanh', 'Món khai vị giòn giòn, thơm lá chanh.', '1. Luộc gà, xé sợi.
2. Trộn cùng bắp cải bào, lá chanh thái sợi.
3. Nêm chua ngọt, trộn đều.', 2, 184, 32, 3.7, 4.4, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe4-canh-mang-suon', 'Canh măng sườn', 'Canh ngày Tết truyền thống, đậm đà.', '1. Hầm sườn heo tới mềm.
2. Cho măng đã luộc sơ vào ninh cùng.
3. Nêm nếm vừa ăn.', 2, 390, 21.9, 32, 4.4, 'maintain', datetime('now'), datetime('now')),
  ('recipe4-banh-beo', 'Bánh bèo tôm cháy', 'Đặc sản Huế, bánh nhỏ mềm mịn.', '1. Hấp bột gạo trong chén nhỏ tới chín.
2. Rắc tôm cháy giã nhuyễn lên trên.
3. Rưới nước mắm chua ngọt khi dùng.', 2, 136, 10.3, 0.7, 21, 'maintain', datetime('now'), datetime('now')),
  ('recipe4-mi-xao-hai-san', 'Mì xào hải sản', 'Món trưa/tối đủ chất, nhiều hải sản.', '1. Trụng mì trứng, để ráo.
2. Xào tôm, mực chín tới.
3. Cho mì vào xào chung, nêm nếm.', 2, 234, 24.3, 3, 26.7, 'maintain', datetime('now'), datetime('now')),
  ('recipe4-ca-basa-kho-to', 'Cá basa kho tộ', 'Món kho quen thuộc, thịt cá mềm béo.', '1. Ướp cá basa với nước mắm, đường.
2. Kho lửa nhỏ tới sánh và thấm.
3. Dọn cùng cơm trắng.', 2, 264, 25.2, 4.8, 28, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe4-che-bap', 'Chè bắp', 'Món chè ngọt thanh từ bắp non.', '1. Nấu bắp hạt tới mềm.
2. Cho nước cốt dừa và chút đường vào khuấy đều.
3. Dùng nóng hoặc lạnh.', 2, 218, 4.4, 11.1, 30.6, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe4-salad-vung-dau-phu', 'Salad đậu phụ mè rang', 'Món chay thanh đạm, thơm mè.', '1. Cắt đậu phụ miếng vuông, chiên sơ.
2. Trộn cùng dưa leo, cà chua.
3. Rắc mè rang lên trên, rưới dầu ô liu.', 1, 228, 14.3, 17.3, 8.1, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe4-tom-rang-me', 'Tôm rang me', 'Món chua ngọt đưa cơm, vị me đặc trưng.', '1. Chiên sơ tôm cho săn vỏ.
2. Pha nước sốt me chua ngọt.
3. Đảo tôm cùng sốt me tới sánh, áo đều.', 2, 160, 30.4, 0.5, 9.6, 'maintain', datetime('now'), datetime('now')),
  ('recipe4-ga-hap-la-chanh', 'Gà hấp lá chanh', 'Món hấp giữ vị ngọt tự nhiên của gà.', '1. Xát muối lên gà, ướp sơ.
2. Hấp cách thủy cùng lá chanh tới chín.
3. Chặt miếng, dùng cùng muối tiêu chanh.', 2, 248, 46.5, 5.4, 0, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe4-banh-trang-nuong', 'Bánh tráng nướng', 'Món vặt Đà Lạt, giòn rụm.', '1. Đặt bánh tráng lên bếp than.
2. Phết trứng, rắc hành lá và chả lụa.
3. Nướng tới bánh giòn vàng đều.', 1, 283, 11.5, 11, 34.7, 'maintain', datetime('now'), datetime('now'))
ON CONFLICT (id) DO NOTHING;

INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES
  ('ing4-xoi-ga-0', 'recipe4-xoi-ga', 'food-nep', 'Gạo nếp (đã nấu)', 200, 'g', 0),
  ('ing4-xoi-ga-1', 'recipe4-xoi-ga', 'food-thit-ga', 'Thịt gà', 100, 'g', 1),
  ('ing4-banh-cuon-thit-nam-0', 'recipe4-banh-cuon-thit-nam', 'food-gao-trang', 'Bột gạo (quy đổi)', 150, 'g', 0),
  ('ing4-banh-cuon-thit-nam-1', 'recipe4-banh-cuon-thit-nam', 'food-thit-heo', 'Thịt heo bằm', 100, 'g', 1),
  ('ing4-banh-cuon-thit-nam-2', 'recipe4-banh-cuon-thit-nam', 'food-nam', 'Nấm', 50, 'g', 2),
  ('ing4-bun-rieu-cua-0', 'recipe4-bun-rieu-cua', 'food-bun-pho', 'Bún', 200, 'g', 0),
  ('ing4-bun-rieu-cua-1', 'recipe4-bun-rieu-cua', 'food-cua', 'Thịt cua', 150, 'g', 1),
  ('ing4-bun-rieu-cua-2', 'recipe4-bun-rieu-cua', 'food-ca-chua', 'Cà chua', 100, 'g', 2),
  ('ing4-cha-ca-la-vong-0', 'recipe4-cha-ca-la-vong', 'food-ca', 'Cá', 300, 'g', 0),
  ('ing4-cha-ca-la-vong-1', 'recipe4-cha-ca-la-vong', 'food-la-lot', 'Lá lốt', 30, 'g', 1),
  ('ing4-cha-ca-la-vong-2', 'recipe4-cha-ca-la-vong', 'food-bun-pho', 'Bún', 150, 'g', 2),
  ('ing4-oc-xao-sa-ot-0', 'recipe4-oc-xao-sa-ot', 'food-oc', 'Ốc', 300, 'g', 0),
  ('ing4-oc-xao-sa-ot-1', 'recipe4-oc-xao-sa-ot', 'food-sa', 'Sả', 30, 'g', 1),
  ('ing4-nem-nuong-0', 'recipe4-nem-nuong', 'food-thit-heo', 'Thịt heo bằm', 200, 'g', 0),
  ('ing4-nem-nuong-1', 'recipe4-nem-nuong', 'food-banh-trang', 'Bánh tráng', 40, 'g', 1),
  ('ing4-nem-nuong-2', 'recipe4-nem-nuong', 'food-bun-pho', 'Bún', 100, 'g', 2),
  ('ing4-banh-khot-0', 'recipe4-banh-khot', 'food-gao-trang', 'Bột gạo (quy đổi)', 150, 'g', 0),
  ('ing4-banh-khot-1', 'recipe4-banh-khot', 'food-tom', 'Tôm', 150, 'g', 1),
  ('ing4-banh-khot-2', 'recipe4-banh-khot', 'food-nuoc-cot-dua', 'Nước cốt dừa', 50, 'g', 2),
  ('ing4-lau-thai-hai-san-0', 'recipe4-lau-thai-hai-san', 'food-tom', 'Tôm', 200, 'g', 0),
  ('ing4-lau-thai-hai-san-1', 'recipe4-lau-thai-hai-san', 'food-muc', 'Mực', 200, 'g', 1),
  ('ing4-lau-thai-hai-san-2', 'recipe4-lau-thai-hai-san', 'food-ngheu', 'Nghêu', 200, 'g', 2),
  ('ing4-lau-thai-hai-san-3', 'recipe4-lau-thai-hai-san', 'food-ca-chua', 'Cà chua', 150, 'g', 3),
  ('ing4-lau-thai-hai-san-4', 'recipe4-lau-thai-hai-san', 'food-sa', 'Sả', 20, 'g', 4),
  ('ing4-thit-de-nuong-la-lot-0', 'recipe4-thit-de-nuong-la-lot', 'food-thit-de', 'Thịt dê', 250, 'g', 0),
  ('ing4-thit-de-nuong-la-lot-1', 'recipe4-thit-de-nuong-la-lot', 'food-la-lot', 'Lá lốt', 50, 'g', 1),
  ('ing4-che-troi-nuoc-0', 'recipe4-che-troi-nuoc', 'food-nep', 'Bột nếp (quy đổi)', 150, 'g', 0),
  ('ing4-che-troi-nuoc-1', 'recipe4-che-troi-nuoc', 'food-dau-xanh', 'Đậu xanh', 100, 'g', 1),
  ('ing4-che-troi-nuoc-2', 'recipe4-che-troi-nuoc', 'food-nuoc-cot-dua', 'Nước cốt dừa', 50, 'g', 2),
  ('ing4-che-troi-nuoc-3', 'recipe4-che-troi-nuoc', 'food-mat-ong', 'Đường/mật ong', 20, 'g', 3),
  ('ing4-banh-trang-tron-0', 'recipe4-banh-trang-tron', 'food-banh-trang', 'Bánh tráng', 60, 'g', 0),
  ('ing4-banh-trang-tron-1', 'recipe4-banh-trang-tron', 'food-tom-kho', 'Tôm khô', 20, 'g', 1),
  ('ing4-banh-trang-tron-2', 'recipe4-banh-trang-tron', 'food-dau-phong-song', 'Đậu phộng', 15, 'g', 2),
  ('ing4-goi-ga-la-chanh-0', 'recipe4-goi-ga-la-chanh', 'food-thit-ga', 'Ức gà', 200, 'g', 0),
  ('ing4-goi-ga-la-chanh-1', 'recipe4-goi-ga-la-chanh', 'food-bap-cai', 'Bắp cải', 150, 'g', 1),
  ('ing4-canh-mang-suon-0', 'recipe4-canh-mang-suon', 'food-suon-heo', 'Sườn heo', 250, 'g', 0),
  ('ing4-canh-mang-suon-1', 'recipe4-canh-mang-suon', 'food-bap-cai', 'Măng (quy đổi tạm)', 150, 'g', 1),
  ('ing4-banh-beo-0', 'recipe4-banh-beo', 'food-gao-trang', 'Bột gạo (quy đổi)', 150, 'g', 0),
  ('ing4-banh-beo-1', 'recipe4-banh-beo', 'food-tom-kho', 'Tôm khô', 30, 'g', 1),
  ('ing4-mi-xao-hai-san-0', 'recipe4-mi-xao-hai-san', 'food-mi-trung', 'Mì trứng (đã luộc)', 200, 'g', 0),
  ('ing4-mi-xao-hai-san-1', 'recipe4-mi-xao-hai-san', 'food-tom', 'Tôm', 100, 'g', 1),
  ('ing4-mi-xao-hai-san-2', 'recipe4-mi-xao-hai-san', 'food-muc', 'Mực', 100, 'g', 2),
  ('ing4-ca-basa-kho-to-0', 'recipe4-ca-basa-kho-to', 'food-ca-basa', 'Cá basa', 300, 'g', 0),
  ('ing4-ca-basa-kho-to-1', 'recipe4-ca-basa-kho-to', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 1),
  ('ing4-che-bap-0', 'recipe4-che-bap', 'food-ngo', 'Ngô (bắp)', 200, 'g', 0),
  ('ing4-che-bap-1', 'recipe4-che-bap', 'food-nuoc-cot-dua', 'Nước cốt dừa', 80, 'g', 1),
  ('ing4-che-bap-2', 'recipe4-che-bap', 'food-mat-ong', 'Đường/mật ong', 20, 'g', 2),
  ('ing4-salad-vung-dau-phu-0', 'recipe4-salad-vung-dau-phu', 'food-dau-phu', 'Đậu phụ', 150, 'g', 0),
  ('ing4-salad-vung-dau-phu-1', 'recipe4-salad-vung-dau-phu', 'food-dua-leo', 'Dưa leo', 80, 'g', 1),
  ('ing4-salad-vung-dau-phu-2', 'recipe4-salad-vung-dau-phu', 'food-vung', 'Vừng (mè)', 10, 'g', 2),
  ('ing4-salad-vung-dau-phu-3', 'recipe4-salad-vung-dau-phu', 'food-dau-oliu', 'Dầu ô liu', 5, 'g', 3),
  ('ing4-tom-rang-me-0', 'recipe4-tom-rang-me', 'food-tom', 'Tôm', 250, 'g', 0),
  ('ing4-tom-rang-me-1', 'recipe4-tom-rang-me', 'food-me', 'Me chua', 30, 'g', 1),
  ('ing4-ga-hap-la-chanh-0', 'recipe4-ga-hap-la-chanh', 'food-thit-ga', 'Thịt gà', 300, 'g', 0),
  ('ing4-banh-trang-nuong-0', 'recipe4-banh-trang-nuong', 'food-banh-trang', 'Bánh tráng', 40, 'g', 0),
  ('ing4-banh-trang-nuong-1', 'recipe4-banh-trang-nuong', 'food-trung-ga', 'Trứng gà', 50, 'g', 1),
  ('ing4-banh-trang-nuong-2', 'recipe4-banh-trang-nuong', 'food-cha-lua', 'Chả lụa', 30, 'g', 2)
ON CONFLICT (id) DO NOTHING;

