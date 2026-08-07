-- Migration: 0056_meal_more_recipes_2
-- Target: Cloudflare D1 (SQLite)
-- Adds 40 more original recipes (self-authored, not sourced from any
-- external site) plus 11 more meal_foods entries, same linked-ingredient
-- pattern as prior seed migrations.

INSERT INTO meal_foods (id, name, category, calories_per_100g, protein_per_100g, fat_per_100g, carb_per_100g, created_at, updated_at) VALUES
  ('food-ca-rot', 'Cà rốt', 'rau_cu_qua', 41, 0.9, 0.2, 9.6, datetime('now'), datetime('now')),
  ('food-bap-cai', 'Bắp cải', 'rau_cu_qua', 25, 1.3, 0.1, 5.8, datetime('now'), datetime('now')),
  ('food-su-hao', 'Su hào', 'rau_cu_qua', 27, 1.7, 0.1, 6.2, datetime('now'), datetime('now')),
  ('food-dau-ha-lan', 'Đậu Hà Lan', 'rau_cu_qua', 81, 5.4, 0.4, 14.5, datetime('now'), datetime('now')),
  ('food-dua-hau', 'Dưa hấu', 'rau_cu_qua', 30, 0.6, 0.15, 7.6, datetime('now'), datetime('now')),
  ('food-xoai', 'Xoài', 'rau_cu_qua', 60, 0.8, 0.4, 15, datetime('now'), datetime('now')),
  ('food-cam', 'Cam', 'rau_cu_qua', 47, 0.9, 0.1, 11.8, datetime('now'), datetime('now')),
  ('food-hat-dieu', 'Hạt điều', 'khac', 553, 18, 44, 30, datetime('now'), datetime('now')),
  ('food-mat-ong', 'Mật ong', 'khac', 304, 0.3, 0, 82.4, datetime('now'), datetime('now')),
  ('food-mi-trung', 'Mì trứng (đã luộc)', 'tinh_bot', 138, 4.5, 2.1, 25, datetime('now'), datetime('now')),
  ('food-cai-thia', 'Cải thìa', 'rau_cu_qua', 13, 1.5, 0.2, 2.2, datetime('now'), datetime('now'))
ON CONFLICT (name) DO NOTHING;

INSERT INTO meal_recipes (id, name, description, instructions, servings, calories_per_serving, protein_g, fat_g, carb_g, goal_tags, created_at, updated_at) VALUES
  ('recipe2-ca-rot-luoc-trung', 'Trứng luộc cà rốt hấp', 'Bữa phụ đơn giản, giàu vitamin A.', '1. Luộc chín trứng, bóc vỏ.
2. Hấp cà rốt cắt khúc tới mềm.
3. Dùng cùng nhau khi còn ấm.', 1, 217, 14.4, 11.3, 15.5, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-ga-xao-su-hao', 'Ức gà xào su hào', 'Món xào nhanh gọn, ít béo.', '1. Thái ức gà miếng vừa ăn, ướp gia vị.
2. Xào gà chín tới, để riêng.
3. Xào su hào lửa lớn, cho gà vào đảo đều.', 2, 277, 40.5, 9.6, 6.2, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-bo-xao-dau-ha-lan', 'Thịt bò xào đậu Hà Lan', 'Món giàu đạm và sắt, hợp bữa tối.', '1. Ướp thịt bò với tỏi, tiêu.
2. Xào bò lửa lớn nhanh tay.
3. Cho đậu Hà Lan vào xào chung tới chín tới.', 2, 373, 36.6, 19.1, 10.9, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe2-salad-dua-hau-pho-mai', 'Salad dưa hấu phô mai', 'Món tráng miệng/ăn nhẹ mùa hè.', '1. Cắt dưa hấu thành khối vuông.
2. Cắt nhỏ phô mai.
3. Trộn đều, dùng lạnh.', 1, 196, 9, 10.3, 19.4, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-sinh-to-xoai', 'Sinh tố xoài sữa chua', 'Sinh tố mát lạnh, giàu vitamin C.', '1. Gọt xoài, cắt miếng.
2. Cho xoài, sữa chua, sữa tươi vào máy xay.
3. Xay nhuyễn, rót ra ly.', 1, 242, 8.3, 7.4, 39.5, 'maintain', datetime('now'), datetime('now')),
  ('recipe2-salad-cam-hanh-nhan', 'Salad cam hạnh nhân', 'Món khai vị thanh mát, giàu vitamin C.', '1. Bóc múi cam, bỏ hạt.
2. Rắc hạnh nhân rang lên trên.
3. Trộn nhẹ, dùng ngay.', 1, 210, 6, 10.2, 28, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-yen-mach-mat-ong-hat-dieu', 'Yến mạch mật ong hạt điều', 'Bữa sáng năng lượng cao, tốt cho người tập luyện.', '1. Nấu yến mạch với sữa tươi tới sánh.
2. Rưới mật ong lên trên.
3. Rắc hạt điều rang trước khi dùng.', 1, 488, 18.5, 18.9, 65.2, 'gain_weight,gain_muscle', datetime('now'), datetime('now')),
  ('recipe2-mi-trung-xao-bo', 'Mì trứng xào thịt bò', 'Món trưa/tối đủ chất, nhanh gọn.', '1. Trụng mì trứng qua nước sôi.
2. Xào thịt bò chín tới.
3. Cho mì vào xào chung, nêm nếm.', 2, 336, 24.3, 13.4, 27.3, 'maintain', datetime('now'), datetime('now')),
  ('recipe2-canh-cai-thia-thit-bam', 'Canh cải thìa thịt bằm', 'Canh thanh đạm, dễ nấu.', '1. Phi thơm hành, xào thịt bằm săn.
2. Đổ nước, đun sôi.
3. Cho cải thìa vào nấu chín, nêm nếm.', 2, 107, 13.5, 5.2, 2.2, 'maintain', datetime('now'), datetime('now')),
  ('recipe2-ga-nuong-mat-ong', 'Ức gà nướng mật ong', 'Món nướng vị ngọt nhẹ, giàu đạm.', '1. Ướp ức gà với mật ong, tiêu, tỏi.
2. Nướng chín vàng hai mặt.
3. Thái lát, dùng nóng.', 1, 376, 62, 7.2, 12.4, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe2-tom-xao-bap-cai', 'Tôm xào bắp cải', 'Món xào nhẹ bụng, giàu đạm ít béo.', '1. Sơ chế tôm, bóc vỏ.
2. Xào tôm chín tới, để riêng.
3. Xào bắp cải, cho tôm vào đảo đều.', 2, 146, 25.3, 2.9, 6, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-banh-mi-bo-dau-phong-chuoi', 'Bánh mì bơ đậu phộng chuối', 'Bữa sáng nhanh, năng lượng cao.', '1. Phết bơ đậu phộng lên bánh mì.
2. Xếp lát chuối lên trên.
3. Dùng ngay.', 1, 477, 15.8, 17.9, 68.2, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe2-ca-hap-gung-hanh', 'Cá hấp hành gừng', 'Món cá thanh đạm, giữ nguyên dinh dưỡng.', '1. Ướp cá với chút muối.
2. Hấp cá cùng hành tây thái lát tới chín.
3. Rưới nước mắm gừng lên khi dùng.', 2, 141, 22.8, 3.8, 2.3, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-dau-hu-xao-nam', 'Đậu phụ xào nấm', 'Món chay đơn giản, giàu đạm thực vật.', '1. Cắt đậu phụ miếng vừa ăn, chiên sơ.
2. Xào nấm chín tới.
3. Cho đậu phụ vào đảo nhẹ, nêm nếm.', 2, 115, 10.3, 7.5, 4.4, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-com-thit-vit-rau-cu', 'Cơm thịt vịt rau củ', 'Bữa chính đủ năng lượng.', '1. Áp chảo thịt vịt chín vàng.
2. Xào cà rốt, đậu que tới chín tới.
3. Dọn cùng cơm trắng.', 2, 503, 23, 28.9, 36.3, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe2-chao-yen-mach-bi-do', 'Cháo yến mạch bí đỏ', 'Bữa sáng nhẹ bụng, giàu chất xơ.', '1. Hấp chín bí đỏ, nghiền nhuyễn.
2. Nấu yến mạch với sữa tươi.
3. Trộn bí đỏ vào cháo, khuấy đều.', 1, 273, 12.6, 7.8, 40.2, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-salad-tom-bo', 'Salad tôm bơ', 'Món khai vị giàu đạm và chất béo tốt.', '1. Luộc/hấp tôm chín, bóc vỏ.
2. Cắt lát quả bơ, cà chua.
3. Trộn tôm cùng bơ, cà chua, rưới dầu ô liu.', 1, 362, 38.5, 20.5, 10.8, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe2-thit-heo-xao-ca-rot', 'Thịt heo xào cà rốt', 'Món xào quen thuộc, đủ chất.', '1. Thái thịt heo mỏng, ướp gia vị.
2. Xào thịt chín tới.
3. Cho cà rốt thái sợi vào xào chung.', 2, 219, 24.7, 10.2, 7.2, 'maintain', datetime('now'), datetime('now')),
  ('recipe2-canh-bap-cai-tom', 'Canh bắp cải nấu tôm', 'Canh ngọt thanh, dễ nấu.', '1. Phi thơm hành, cho tôm vào xào săn.
2. Đổ nước, đun sôi.
3. Cho bắp cải vào nấu chín, nêm nếm.', 2, 75, 13.3, 0.3, 5.9, 'maintain', datetime('now'), datetime('now')),
  ('recipe2-muc-hap-hanh-gung', 'Mực hấp hành gừng', 'Món hải sản thanh đạm, giữ vị ngọt tự nhiên.', '1. Sơ chế mực, cắt khoanh.
2. Xếp mực lên đĩa cùng hành lá.
3. Hấp chín, rưới nước mắm gừng.', 2, 125, 19.8, 1.8, 6.2, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-trung-chien-cai-thia', 'Trứng chiên cải thìa', 'Món trứng nhanh, thêm rau xanh.', '1. Thái nhỏ cải thìa.
2. Đánh tan trứng, trộn cải thìa vào.
3. Chiên chín hai mặt.', 1, 246, 21, 16.7, 3.9, 'maintain', datetime('now'), datetime('now')),
  ('recipe2-sup-ga-ngo', 'Súp gà ngô', 'Món súp ấm bụng, dễ tiêu hoá.', '1. Luộc ức gà, xé sợi.
2. Nấu nước dùng cùng ngô hạt.
3. Cho gà xé vào, đun sôi lại, nêm nếm.', 2, 196, 25.8, 3.8, 15.8, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-dau-lang-xao-rau-cu', 'Đậu lăng xào rau củ thập cẩm', 'Món chay giàu đạm thực vật.', '1. Xào cà rốt, su hào, đậu que tới chín tới.
2. Cho đậu lăng đã nấu vào xào chung.
3. Nêm nếm vừa ăn.', 2, 150, 10.3, 0.6, 27.9, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-com-bo-xao-hanh-tay', 'Cơm thịt bò xào hành tây', 'Bữa chính giàu đạm, đủ tinh bột.', '1. Xào thịt bò với hành tây lửa lớn.
2. Nêm nếm vừa ăn.
3. Dọn cùng cơm trắng.', 2, 463, 35.8, 19.1, 32.7, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe2-sinh-to-bo-mat-ong', 'Sinh tố bơ mật ong', 'Sinh tố béo ngậy, giàu năng lượng.', '1. Cho bơ, sữa tươi, mật ong vào máy xay.
2. Xay nhuyễn mịn.
3. Rót ra ly, dùng ngay.', 1, 423, 9.5, 29.1, 38.8, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe2-ga-ap-chao-nam', 'Ức gà áp chảo nấm', 'Món giàu đạm, ít tinh bột.', '1. Áp chảo ức gà chín vàng hai mặt.
2. Xào nấm với chút dầu ô liu.
3. Dọn gà cùng nấm xào.', 1, 396, 65.1, 12.5, 3.3, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-canh-ca-rot-khoai-lang', 'Canh cà rốt khoai lang thịt bằm', 'Canh ngọt tự nhiên, giàu vitamin.', '1. Xào sơ thịt bằm.
2. Cho cà rốt, khoai lang vào cùng nước.
3. Nấu tới rau củ mềm, nêm nếm.', 2, 158, 13.3, 5.1, 14.8, 'maintain', datetime('now'), datetime('now')),
  ('recipe2-salad-xoai-tom', 'Salad xoài tôm', 'Món khai vị chua ngọt, lạ miệng.', '1. Luộc tôm chín, bóc vỏ.
2. Xoài xanh bào sợi.
3. Trộn tôm với xoài, nêm chua ngọt.', 1, 209, 36.8, 0.9, 15.3, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-bun-thit-bo-xao', 'Bún thịt bò xào', 'Món trưa đủ chất, dễ chuẩn bị.', '1. Xào thịt bò với tỏi.
2. Trụng bún qua nước sôi.
3. Trộn bún với thịt bò xào, rau sống.', 2, 363, 28, 15.2, 25.9, 'maintain', datetime('now'), datetime('now')),
  ('recipe2-trung-hap-tom', 'Trứng hấp tôm', 'Món giàu đạm, mềm mịn, dễ ăn.', '1. Đánh tan trứng với chút nước.
2. Cho tôm băm vào trộn đều.
3. Hấp cách thủy tới chín mềm.', 1, 332, 43.5, 16.8, 1.9, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe2-ga-kho-gung', 'Gà kho gừng', 'Món kho đậm đà, ấm bụng.', '1. Ướp gà với gừng, nước mắm, đường.
2. Kho lửa nhỏ tới thấm.
3. Dọn cùng cơm trắng.', 2, 378, 49.2, 5.7, 28, 'maintain', datetime('now'), datetime('now')),
  ('recipe2-sinh-to-cam-ca-rot', 'Sinh tố cam cà rốt', 'Sinh tố giàu vitamin A và C.', '1. Ép hoặc xay cà rốt lấy nước.
2. Vắt nước cam.
3. Trộn đều hai loại nước, dùng lạnh.', 1, 135, 2.7, 0.4, 33.2, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-thit-heo-nuong-mat-ong', 'Thịt heo nướng mật ong', 'Món nướng vị ngọt nhẹ, thơm ngon.', '1. Ướp thịt heo với mật ong, tỏi, tiêu.
2. Nướng chín vàng.
3. Thái lát, dùng cùng rau sống.', 2, 265, 30, 12.5, 8.2, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe2-canh-su-hao-xuong', 'Canh su hào nấu thịt', 'Canh dân dã, dễ nấu.', '1. Xào sơ thịt bằm cho săn.
2. Cho su hào vào cùng nước.
3. Nấu tới su hào mềm, nêm nếm.', 2, 121, 13.7, 5.1, 6.2, 'maintain', datetime('now'), datetime('now')),
  ('recipe2-salad-bap-cai-tom', 'Salad bắp cải tôm', 'Món salad giòn mát, giàu đạm.', '1. Bào sợi bắp cải.
2. Luộc tôm chín, bóc vỏ.
3. Trộn bắp cải với tôm, rưới dầu ô liu.', 1, 230, 38, 5.6, 9, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-mi-trung-xao-rau-cu', 'Mì trứng xào rau củ chay', 'Món chay đủ tinh bột và rau.', '1. Trụng mì trứng.
2. Xào cà rốt, bắp cải, đậu que.
3. Cho mì vào xào chung, nêm nếm.', 2, 179, 6.1, 2.3, 34.5, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-ca-kho-to', 'Cá kho tộ', 'Món kho đậm đà, cơm nhà truyền thống.', '1. Ướp cá với nước mắm, đường, tiêu.
2. Kho lửa nhỏ tới thấm và sánh.
3. Dọn cùng cơm trắng.', 2, 288, 29.7, 4.8, 28, 'maintain', datetime('now'), datetime('now')),
  ('recipe2-sinh-to-chuoi-hat-dieu', 'Sinh tố chuối hạt điều', 'Sinh tố năng lượng cao cho người tập gym.', '1. Cho chuối, hạt điều, sữa tươi vào máy xay.
2. Xay nhuyễn mịn.
3. Rót ra ly, dùng ngay.', 1, 421, 13.5, 20.3, 53.1, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe2-dau-phu-hap-nam', 'Đậu phụ hấp nấm', 'Món chay thanh đạm, ít calo.', '1. Xếp đậu phụ ra đĩa.
2. Rắc nấm thái lát lên trên.
3. Hấp chín, rưới nước tương khi dùng.', 2, 87, 9.6, 5, 3.6, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe2-bo-luc-lac-khoai-lang', 'Bò lúc lắc khoai lang', 'Món bò xào kiểu Âu, giàu năng lượng.', '1. Ướp thịt bò cắt khối với tiêu, tỏi.
2. Áp chảo bò chín tới trên lửa lớn.
3. Dọn cùng khoai lang hấp.', 2, 399, 34.1, 18.9, 20, 'gain_muscle', datetime('now'), datetime('now'))
ON CONFLICT (id) DO NOTHING;

INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES
  ('ing2-ca-rot-luoc-trung-0', 'recipe2-ca-rot-luoc-trung', 'food-trung-ga', 'Trứng gà', 100, 'g', 0),
  ('ing2-ca-rot-luoc-trung-1', 'recipe2-ca-rot-luoc-trung', 'food-ca-rot', 'Cà rốt', 150, 'g', 1),
  ('ing2-ga-xao-su-hao-0', 'recipe2-ga-xao-su-hao', 'food-thit-ga', 'Ức gà', 250, 'g', 0),
  ('ing2-ga-xao-su-hao-1', 'recipe2-ga-xao-su-hao', 'food-su-hao', 'Su hào', 200, 'g', 1),
  ('ing2-ga-xao-su-hao-2', 'recipe2-ga-xao-su-hao', 'food-dau-oliu', 'Dầu ô liu', 10, 'g', 2),
  ('ing2-bo-xao-dau-ha-lan-0', 'recipe2-bo-xao-dau-ha-lan', 'food-thit-bo', 'Thịt bò', 250, 'g', 0),
  ('ing2-bo-xao-dau-ha-lan-1', 'recipe2-bo-xao-dau-ha-lan', 'food-dau-ha-lan', 'Đậu Hà Lan', 150, 'g', 1),
  ('ing2-salad-dua-hau-pho-mai-0', 'recipe2-salad-dua-hau-pho-mai', 'food-dua-hau', 'Dưa hấu', 250, 'g', 0),
  ('ing2-salad-dua-hau-pho-mai-1', 'recipe2-salad-dua-hau-pho-mai', 'food-pho-mai', 'Phô mai', 30, 'g', 1),
  ('ing2-sinh-to-xoai-0', 'recipe2-sinh-to-xoai', 'food-xoai', 'Xoài', 200, 'g', 0),
  ('ing2-sinh-to-xoai-1', 'recipe2-sinh-to-xoai', 'food-sua-chua', 'Sữa chua không đường', 100, 'g', 1),
  ('ing2-sinh-to-xoai-2', 'recipe2-sinh-to-xoai', 'food-sua-tuoi', 'Sữa tươi', 100, 'ml', 2),
  ('ing2-salad-cam-hanh-nhan-0', 'recipe2-salad-cam-hanh-nhan', 'food-cam', 'Cam', 200, 'g', 0),
  ('ing2-salad-cam-hanh-nhan-1', 'recipe2-salad-cam-hanh-nhan', 'food-hanh-nhan', 'Hạnh nhân', 20, 'g', 1),
  ('ing2-yen-mach-mat-ong-hat-dieu-0', 'recipe2-yen-mach-mat-ong-hat-dieu', 'food-yen-mach', 'Yến mạch', 50, 'g', 0),
  ('ing2-yen-mach-mat-ong-hat-dieu-1', 'recipe2-yen-mach-mat-ong-hat-dieu', 'food-sua-tuoi', 'Sữa tươi', 200, 'ml', 1),
  ('ing2-yen-mach-mat-ong-hat-dieu-2', 'recipe2-yen-mach-mat-ong-hat-dieu', 'food-mat-ong', 'Mật ong', 20, 'g', 2),
  ('ing2-yen-mach-mat-ong-hat-dieu-3', 'recipe2-yen-mach-mat-ong-hat-dieu', 'food-hat-dieu', 'Hạt điều', 20, 'g', 3),
  ('ing2-mi-trung-xao-bo-0', 'recipe2-mi-trung-xao-bo', 'food-mi-trung', 'Mì trứng (đã luộc)', 200, 'g', 0),
  ('ing2-mi-trung-xao-bo-1', 'recipe2-mi-trung-xao-bo', 'food-thit-bo', 'Thịt bò', 150, 'g', 1),
  ('ing2-mi-trung-xao-bo-2', 'recipe2-mi-trung-xao-bo', 'food-hanh-tay', 'Hành tây', 50, 'g', 2),
  ('ing2-canh-cai-thia-thit-bam-0', 'recipe2-canh-cai-thia-thit-bam', 'food-cai-thia', 'Cải thìa', 200, 'g', 0),
  ('ing2-canh-cai-thia-thit-bam-1', 'recipe2-canh-cai-thia-thit-bam', 'food-thit-heo', 'Thịt heo bằm', 100, 'g', 1),
  ('ing2-ga-nuong-mat-ong-0', 'recipe2-ga-nuong-mat-ong', 'food-thit-ga', 'Ức gà', 200, 'g', 0),
  ('ing2-ga-nuong-mat-ong-1', 'recipe2-ga-nuong-mat-ong', 'food-mat-ong', 'Mật ong', 15, 'g', 1),
  ('ing2-tom-xao-bap-cai-0', 'recipe2-tom-xao-bap-cai', 'food-tom', 'Tôm', 200, 'g', 0),
  ('ing2-tom-xao-bap-cai-1', 'recipe2-tom-xao-bap-cai', 'food-bap-cai', 'Bắp cải', 200, 'g', 1),
  ('ing2-tom-xao-bap-cai-2', 'recipe2-tom-xao-bap-cai', 'food-dau-oliu', 'Dầu ô liu', 5, 'g', 2),
  ('ing2-banh-mi-bo-dau-phong-chuoi-0', 'recipe2-banh-mi-bo-dau-phong-chuoi', 'food-banh-mi', 'Bánh mì', 80, 'g', 0),
  ('ing2-banh-mi-bo-dau-phong-chuoi-1', 'recipe2-banh-mi-bo-dau-phong-chuoi', 'food-bo-dau-phong', 'Bơ đậu phộng', 30, 'g', 1),
  ('ing2-banh-mi-bo-dau-phong-chuoi-2', 'recipe2-banh-mi-bo-dau-phong-chuoi', 'food-chuoi', 'Chuối', 100, 'g', 2),
  ('ing2-ca-hap-gung-hanh-0', 'recipe2-ca-hap-gung-hanh', 'food-ca', 'Cá', 250, 'g', 0),
  ('ing2-ca-hap-gung-hanh-1', 'recipe2-ca-hap-gung-hanh', 'food-hanh-tay', 'Hành tây', 50, 'g', 1),
  ('ing2-dau-hu-xao-nam-0', 'recipe2-dau-hu-xao-nam', 'food-dau-phu', 'Đậu phụ', 200, 'g', 0),
  ('ing2-dau-hu-xao-nam-1', 'recipe2-dau-hu-xao-nam', 'food-nam', 'Nấm', 150, 'g', 1),
  ('ing2-dau-hu-xao-nam-2', 'recipe2-dau-hu-xao-nam', 'food-dau-oliu', 'Dầu ô liu', 5, 'g', 2),
  ('ing2-com-thit-vit-rau-cu-0', 'recipe2-com-thit-vit-rau-cu', 'food-thit-vit', 'Thịt vịt', 200, 'g', 0),
  ('ing2-com-thit-vit-rau-cu-1', 'recipe2-com-thit-vit-rau-cu', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 1),
  ('ing2-com-thit-vit-rau-cu-2', 'recipe2-com-thit-vit-rau-cu', 'food-ca-rot', 'Cà rốt', 100, 'g', 2),
  ('ing2-com-thit-vit-rau-cu-3', 'recipe2-com-thit-vit-rau-cu', 'food-dau-que', 'Đậu que', 100, 'g', 3),
  ('ing2-chao-yen-mach-bi-do-0', 'recipe2-chao-yen-mach-bi-do', 'food-yen-mach', 'Yến mạch', 40, 'g', 0),
  ('ing2-chao-yen-mach-bi-do-1', 'recipe2-chao-yen-mach-bi-do', 'food-bi-do', 'Bí đỏ', 100, 'g', 1),
  ('ing2-chao-yen-mach-bi-do-2', 'recipe2-chao-yen-mach-bi-do', 'food-sua-tuoi', 'Sữa tươi', 150, 'ml', 2),
  ('ing2-salad-tom-bo-0', 'recipe2-salad-tom-bo', 'food-tom', 'Tôm', 150, 'g', 0),
  ('ing2-salad-tom-bo-1', 'recipe2-salad-tom-bo', 'food-qua-bo', 'Quả bơ', 100, 'g', 1),
  ('ing2-salad-tom-bo-2', 'recipe2-salad-tom-bo', 'food-ca-chua', 'Cà chua', 50, 'g', 2),
  ('ing2-salad-tom-bo-3', 'recipe2-salad-tom-bo', 'food-dau-oliu', 'Dầu ô liu', 5, 'g', 3),
  ('ing2-thit-heo-xao-ca-rot-0', 'recipe2-thit-heo-xao-ca-rot', 'food-thit-heo', 'Thịt heo', 200, 'g', 0),
  ('ing2-thit-heo-xao-ca-rot-1', 'recipe2-thit-heo-xao-ca-rot', 'food-ca-rot', 'Cà rốt', 150, 'g', 1),
  ('ing2-canh-bap-cai-tom-0', 'recipe2-canh-bap-cai-tom', 'food-bap-cai', 'Bắp cải', 200, 'g', 0),
  ('ing2-canh-bap-cai-tom-1', 'recipe2-canh-bap-cai-tom', 'food-tom', 'Tôm', 100, 'g', 1),
  ('ing2-muc-hap-hanh-gung-0', 'recipe2-muc-hap-hanh-gung', 'food-muc', 'Mực', 250, 'g', 0),
  ('ing2-muc-hap-hanh-gung-1', 'recipe2-muc-hap-hanh-gung', 'food-hanh-tay', 'Hành tây', 50, 'g', 1),
  ('ing2-trung-chien-cai-thia-0', 'recipe2-trung-chien-cai-thia', 'food-trung-ga', 'Trứng gà', 150, 'g', 0),
  ('ing2-trung-chien-cai-thia-1', 'recipe2-trung-chien-cai-thia', 'food-cai-thia', 'Cải thìa', 100, 'g', 1),
  ('ing2-sup-ga-ngo-0', 'recipe2-sup-ga-ngo', 'food-thit-ga', 'Ức gà', 150, 'g', 0),
  ('ing2-sup-ga-ngo-1', 'recipe2-sup-ga-ngo', 'food-ngo', 'Ngô', 150, 'g', 1),
  ('ing2-dau-lang-xao-rau-cu-0', 'recipe2-dau-lang-xao-rau-cu', 'food-dau-lang', 'Đậu lăng (đã nấu)', 200, 'g', 0),
  ('ing2-dau-lang-xao-rau-cu-1', 'recipe2-dau-lang-xao-rau-cu', 'food-ca-rot', 'Cà rốt', 100, 'g', 1),
  ('ing2-dau-lang-xao-rau-cu-2', 'recipe2-dau-lang-xao-rau-cu', 'food-su-hao', 'Su hào', 100, 'g', 2),
  ('ing2-com-bo-xao-hanh-tay-0', 'recipe2-com-bo-xao-hanh-tay', 'food-thit-bo', 'Thịt bò', 250, 'g', 0),
  ('ing2-com-bo-xao-hanh-tay-1', 'recipe2-com-bo-xao-hanh-tay', 'food-hanh-tay', 'Hành tây', 100, 'g', 1),
  ('ing2-com-bo-xao-hanh-tay-2', 'recipe2-com-bo-xao-hanh-tay', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 2),
  ('ing2-sinh-to-bo-mat-ong-0', 'recipe2-sinh-to-bo-mat-ong', 'food-qua-bo', 'Quả bơ', 150, 'g', 0),
  ('ing2-sinh-to-bo-mat-ong-1', 'recipe2-sinh-to-bo-mat-ong', 'food-sua-tuoi', 'Sữa tươi', 200, 'ml', 1),
  ('ing2-sinh-to-bo-mat-ong-2', 'recipe2-sinh-to-bo-mat-ong', 'food-mat-ong', 'Mật ong', 20, 'g', 2),
  ('ing2-ga-ap-chao-nam-0', 'recipe2-ga-ap-chao-nam', 'food-thit-ga', 'Ức gà', 200, 'g', 0),
  ('ing2-ga-ap-chao-nam-1', 'recipe2-ga-ap-chao-nam', 'food-nam', 'Nấm', 100, 'g', 1),
  ('ing2-ga-ap-chao-nam-2', 'recipe2-ga-ap-chao-nam', 'food-dau-oliu', 'Dầu ô liu', 5, 'g', 2),
  ('ing2-canh-ca-rot-khoai-lang-0', 'recipe2-canh-ca-rot-khoai-lang', 'food-thit-heo', 'Thịt heo bằm', 100, 'g', 0),
  ('ing2-canh-ca-rot-khoai-lang-1', 'recipe2-canh-ca-rot-khoai-lang', 'food-ca-rot', 'Cà rốt', 100, 'g', 1),
  ('ing2-canh-ca-rot-khoai-lang-2', 'recipe2-canh-ca-rot-khoai-lang', 'food-khoai-lang', 'Khoai lang', 100, 'g', 2),
  ('ing2-salad-xoai-tom-0', 'recipe2-salad-xoai-tom', 'food-tom', 'Tôm', 150, 'g', 0),
  ('ing2-salad-xoai-tom-1', 'recipe2-salad-xoai-tom', 'food-xoai', 'Xoài', 100, 'g', 1),
  ('ing2-bun-thit-bo-xao-0', 'recipe2-bun-thit-bo-xao', 'food-thit-bo', 'Thịt bò', 200, 'g', 0),
  ('ing2-bun-thit-bo-xao-1', 'recipe2-bun-thit-bo-xao', 'food-bun-pho', 'Bún', 200, 'g', 1),
  ('ing2-bun-thit-bo-xao-2', 'recipe2-bun-thit-bo-xao', 'food-dua-leo', 'Dưa leo', 50, 'g', 2),
  ('ing2-trung-hap-tom-0', 'recipe2-trung-hap-tom', 'food-trung-ga', 'Trứng gà', 150, 'g', 0),
  ('ing2-trung-hap-tom-1', 'recipe2-trung-hap-tom', 'food-tom', 'Tôm', 100, 'g', 1),
  ('ing2-ga-kho-gung-0', 'recipe2-ga-kho-gung', 'food-thit-ga', 'Thịt gà', 300, 'g', 0),
  ('ing2-ga-kho-gung-1', 'recipe2-ga-kho-gung', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 1),
  ('ing2-sinh-to-cam-ca-rot-0', 'recipe2-sinh-to-cam-ca-rot', 'food-cam', 'Cam', 200, 'g', 0),
  ('ing2-sinh-to-cam-ca-rot-1', 'recipe2-sinh-to-cam-ca-rot', 'food-ca-rot', 'Cà rốt', 100, 'g', 1),
  ('ing2-thit-heo-nuong-mat-ong-0', 'recipe2-thit-heo-nuong-mat-ong', 'food-thit-heo', 'Thịt heo', 250, 'g', 0),
  ('ing2-thit-heo-nuong-mat-ong-1', 'recipe2-thit-heo-nuong-mat-ong', 'food-mat-ong', 'Mật ong', 20, 'g', 1),
  ('ing2-canh-su-hao-xuong-0', 'recipe2-canh-su-hao-xuong', 'food-thit-heo', 'Thịt heo bằm', 100, 'g', 0),
  ('ing2-canh-su-hao-xuong-1', 'recipe2-canh-su-hao-xuong', 'food-su-hao', 'Su hào', 200, 'g', 1),
  ('ing2-salad-bap-cai-tom-0', 'recipe2-salad-bap-cai-tom', 'food-bap-cai', 'Bắp cải', 150, 'g', 0),
  ('ing2-salad-bap-cai-tom-1', 'recipe2-salad-bap-cai-tom', 'food-tom', 'Tôm', 150, 'g', 1),
  ('ing2-salad-bap-cai-tom-2', 'recipe2-salad-bap-cai-tom', 'food-dau-oliu', 'Dầu ô liu', 5, 'g', 2),
  ('ing2-mi-trung-xao-rau-cu-0', 'recipe2-mi-trung-xao-rau-cu', 'food-mi-trung', 'Mì trứng (đã luộc)', 200, 'g', 0),
  ('ing2-mi-trung-xao-rau-cu-1', 'recipe2-mi-trung-xao-rau-cu', 'food-ca-rot', 'Cà rốt', 100, 'g', 1),
  ('ing2-mi-trung-xao-rau-cu-2', 'recipe2-mi-trung-xao-rau-cu', 'food-bap-cai', 'Bắp cải', 100, 'g', 2),
  ('ing2-mi-trung-xao-rau-cu-3', 'recipe2-mi-trung-xao-rau-cu', 'food-dau-que', 'Đậu que', 50, 'g', 3),
  ('ing2-ca-kho-to-0', 'recipe2-ca-kho-to', 'food-ca', 'Cá', 300, 'g', 0),
  ('ing2-ca-kho-to-1', 'recipe2-ca-kho-to', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 1),
  ('ing2-sinh-to-chuoi-hat-dieu-0', 'recipe2-sinh-to-chuoi-hat-dieu', 'food-chuoi', 'Chuối', 150, 'g', 0),
  ('ing2-sinh-to-chuoi-hat-dieu-1', 'recipe2-sinh-to-chuoi-hat-dieu', 'food-hat-dieu', 'Hạt điều', 30, 'g', 1),
  ('ing2-sinh-to-chuoi-hat-dieu-2', 'recipe2-sinh-to-chuoi-hat-dieu', 'food-sua-tuoi', 'Sữa tươi', 200, 'ml', 2),
  ('ing2-dau-phu-hap-nam-0', 'recipe2-dau-phu-hap-nam', 'food-dau-phu', 'Đậu phụ', 200, 'g', 0),
  ('ing2-dau-phu-hap-nam-1', 'recipe2-dau-phu-hap-nam', 'food-nam', 'Nấm', 100, 'g', 1),
  ('ing2-bo-luc-lac-khoai-lang-0', 'recipe2-bo-luc-lac-khoai-lang', 'food-thit-bo', 'Thịt bò', 250, 'g', 0),
  ('ing2-bo-luc-lac-khoai-lang-1', 'recipe2-bo-luc-lac-khoai-lang', 'food-khoai-lang', 'Khoai lang', 200, 'g', 1)
ON CONFLICT (id) DO NOTHING;

