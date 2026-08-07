-- Migration: 0059_meal_pantry_recipes
-- Target: Cloudflare D1 (SQLite)
-- Adds 12 pantry/condiment/canned/instant meal_foods entries (nước mắm,
-- nước tương, tương ớt, mì ăn liền, cá hộp, cá ngừ hộp, thịt hộp, xúc
-- xích, pate hộp, dưa chua, kim chi, giò thủ) and 29 everyday recipes
-- built around them — self-authored, not sourced from any external site.

INSERT INTO meal_foods (id, name, category, calories_per_100g, protein_per_100g, fat_per_100g, carb_per_100g, created_at, updated_at) VALUES
  ('food-nuoc-mam', 'Nước mắm', 'khac', 35, 5, 0, 3.6, datetime('now'), datetime('now')),
  ('food-nuoc-tuong', 'Nước tương', 'khac', 60, 8, 0, 6, datetime('now'), datetime('now')),
  ('food-tuong-ot', 'Tương ớt', 'khac', 93, 1.9, 0.4, 20, datetime('now'), datetime('now')),
  ('food-mi-an-lien', 'Mì ăn liền (vắt khô)', 'tinh_bot', 436, 9, 17, 63, datetime('now'), datetime('now')),
  ('food-ca-hop-sot-ca', 'Cá hộp sốt cà', 'hai_san', 140, 17, 6, 4, datetime('now'), datetime('now')),
  ('food-ca-ngu-hop', 'Cá ngừ hộp (ngâm nước)', 'hai_san', 116, 26, 1, 0, datetime('now'), datetime('now')),
  ('food-thit-hop', 'Thịt hộp', 'thit', 310, 13, 27, 3, datetime('now'), datetime('now')),
  ('food-xuc-xich', 'Xúc xích', 'thit', 301, 12, 27, 3, datetime('now'), datetime('now')),
  ('food-pate-hop', 'Pate hộp', 'khac', 319, 14, 28, 4, datetime('now'), datetime('now')),
  ('food-dua-chua', 'Dưa cải chua', 'rau_cu_qua', 15, 1.5, 0.2, 2.5, datetime('now'), datetime('now')),
  ('food-kim-chi', 'Kim chi', 'rau_cu_qua', 15, 1.1, 0.5, 2.4, datetime('now'), datetime('now')),
  ('food-gio-thu', 'Giò thủ', 'thit', 200, 15, 15, 0, datetime('now'), datetime('now'))
ON CONFLICT (name) DO NOTHING;

INSERT INTO meal_recipes (id, name, description, instructions, servings, calories_per_serving, protein_g, fat_g, carb_g, goal_tags, created_at, updated_at) VALUES
  ('recipe5-mi-tom-trung', 'Mì tôm trứng', 'Bữa nhanh quen thuộc, thêm trứng cho đủ đạm.', '1. Nấu sôi nước, cho mì vào.
2. Đập trứng vào khi mì gần chín.
3. Nêm gói gia vị, dùng nóng.', 1, 442, 15, 20.2, 51.1, 'maintain', datetime('now'), datetime('now')),
  ('recipe5-ca-hop-sot-ca-kho', 'Cá hộp sốt cà kho tiêu', 'Món nhanh gọn từ đồ hộp, hợp ngày bận rộn.', '1. Đổ cá hộp ra chảo.
2. Kho nhẹ cùng cà chua, tiêu.
3. Dọn cùng cơm trắng.', 1, 470, 30.9, 9.6, 62, 'maintain', datetime('now'), datetime('now')),
  ('recipe5-salad-ca-ngu-hop', 'Salad cá ngừ hộp', 'Món giàu đạm, ít calo, chuẩn bị nhanh.', '1. Để ráo cá ngừ hộp.
2. Trộn cùng dưa leo, cà chua.
3. Rưới dầu ô liu, nêm nhẹ.', 1, 239, 40, 6.7, 4.8, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe5-banh-mi-pate-xuc-xich', 'Bánh mì pate xúc xích', 'Bữa sáng nhanh, năng lượng cao.', '1. Phết pate lên bánh mì.
2. Xếp xúc xích áp chảo lên trên.
3. Thêm dưa leo, dùng ngay.', 1, 511, 19.2, 25.1, 51.7, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe5-com-chien-xuc-xich', 'Cơm chiên xúc xích trứng', 'Món tận dụng cơm nguội, nhanh gọn.', '1. Cắt hạt lựu xúc xích, áp chảo sơ.
2. Đánh tan trứng, tráng chín, thái nhỏ.
3. Chiên cơm với xúc xích và trứng, nêm nước tương.', 1, 524, 19.9, 22.3, 59, 'maintain', datetime('now'), datetime('now')),
  ('recipe5-thit-heo-kho-dua-chua', 'Thịt heo kho dưa cải chua', 'Món kho đưa cơm, chua nhẹ dễ ăn.', '1. Kho thịt heo với nước mắm, đường tới săn.
2. Cho dưa cải chua vào kho cùng.
3. Nêm nếm vừa ăn, dùng cùng cơm.', 2, 329, 27.8, 10.5, 29.9, 'maintain', datetime('now'), datetime('now')),
  ('recipe5-kim-chi-xao-thit-bo', 'Kim chi xào thịt bò', 'Món xào kiểu Hàn, cay nhẹ đưa cơm.', '1. Xào thịt bò chín tới.
2. Cho kim chi vào xào cùng.
3. Nêm nếm vừa ăn.', 2, 261, 26.8, 15.4, 1.8, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe5-gio-thu-dua-chua', 'Giò thủ ăn kèm dưa chua', 'Món nguội quen thuộc ngày Tết.', '1. Thái lát giò thủ.
2. Dọn cùng dưa chua ăn kèm.
3. Chấm nước mắm nếu thích.', 1, 315, 24, 22.7, 2.5, 'maintain', datetime('now'), datetime('now')),
  ('recipe5-trung-chien-nuoc-tuong', 'Trứng chiên nước tương', 'Món trứng đơn giản, đậm vị.', '1. Đánh tan trứng, nêm nước tương.
2. Chiên chín hai mặt.
3. Dùng cùng cơm trắng.', 1, 434, 24.4, 17, 44.3, 'maintain', datetime('now'), datetime('now')),
  ('recipe5-tom-sot-tuong-ot', 'Tôm sốt tương ớt', 'Món chua cay hấp dẫn, dễ làm.', '1. Chiên sơ tôm cho săn.
2. Pha sốt tương ớt, tỏi.
3. Đảo tôm cùng sốt tới áo đều.', 2, 138, 30.3, 0.4, 3.3, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe5-mi-an-lien-xao-bo', 'Mì ăn liền xào bò rau cải', 'Bữa nhanh nhưng vẫn có rau và đạm.', '1. Trụng mì cho mềm, để ráo.
2. Xào thịt bò với cải bó xôi.
3. Cho mì vào xào chung, nêm gói gia vị.', 1, 622, 36.1, 29, 54, 'maintain', datetime('now'), datetime('now')),
  ('recipe5-dau-hu-sot-nuoc-tuong', 'Đậu hũ sốt nước tương gừng', 'Món chay đơn giản, đậm đà.', '1. Chiên sơ đậu hũ.
2. Pha nước tương với gừng băm.
3. Rưới sốt lên đậu hũ, hấp nhẹ vài phút.', 2, 81, 8.6, 4.8, 2.3, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe5-xuc-xich-nuong-khoai-lang', 'Xúc xích nướng khoai lang', 'Món ăn nhẹ giàu năng lượng.', '1. Nướng xúc xích chín vàng.
2. Hấp hoặc nướng khoai lang.
3. Dọn cùng nhau.', 1, 473, 15.2, 27.2, 43, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe5-canh-ca-hop-rau-cai', 'Canh cá hộp nấu cải', 'Canh nhanh từ đồ hộp, tiết kiệm thời gian.', '1. Đun sôi nước, cho cá hộp vào.
2. Thả cải vào nấu chín.
3. Nêm nếm vừa ăn.', 2, 115, 13.9, 4.7, 4.7, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe5-salad-trung-pho-mai', 'Salad trứng phô mai', 'Món ăn nhẹ giàu đạm, chuẩn bị nhanh.', '1. Luộc trứng, cắt lát.
2. Trộn cùng phô mai bào, dưa leo.
3. Rưới dầu ô liu, nêm nhẹ.', 1, 365, 27.6, 26.5, 4.9, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe5-thit-bo-kho-tuong-den', 'Bò xào sốt tương đen', 'Món xào kiểu Hoa, đậm đà.', '1. Ướp thịt bò với chút nước tương.
2. Xào bò lửa lớn nhanh tay.
3. Cho hành tây vào xào chung, nêm thêm tương ớt nếu thích cay.', 2, 337, 33.7, 18.8, 5.1, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe5-ca-ngu-hop-tron-bun', 'Bún trộn cá ngừ hộp', 'Món trưa nhanh, đủ tinh bột và đạm.', '1. Trụng bún, để ráo.
2. Trộn cùng cá ngừ hộp, dưa leo, cà rốt.
3. Nêm nước mắm chua ngọt.', 1, 308, 29.5, 1.5, 44.1, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe5-ga-kho-nuoc-mam', 'Gà kho nước mắm gừng', 'Món kho truyền thống, đậm đà thơm gừng.', '1. Ướp gà với nước mắm, đường, gừng.
2. Kho lửa nhỏ tới thấm.
3. Dọn cùng cơm trắng.', 2, 381, 49.7, 5.7, 28.4, 'maintain', datetime('now'), datetime('now')),
  ('recipe5-salad-dau-hu-kim-chi', 'Salad đậu hũ kim chi', 'Món chay cay nhẹ, lạ miệng.', '1. Cắt đậu hũ thành khối nhỏ.
2. Trộn cùng kim chi.
3. Rưới chút dầu mè nếu có.', 1, 129, 13.1, 7.7, 5.3, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe5-thit-hop-xao-dua-chua', 'Thịt hộp xào dưa chua', 'Món xào nhanh từ đồ hộp có sẵn.', '1. Thái lát thịt hộp.
2. Xào thịt hộp với dưa chua.
3. Nêm nếm vừa ăn.', 1, 325, 14.5, 27.2, 5.5, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe5-mi-tron-xuc-xich-trung', 'Mì trộn xúc xích trứng', 'Bữa nhanh đủ chất hơn mì thường.', '1. Trụng mì ăn liền, để ráo.
2. Áp chảo xúc xích, trứng ốp la.
3. Trộn mì với gói gia vị, xếp xúc xích và trứng lên trên.', 1, 622, 22.2, 36.4, 52.9, 'maintain', datetime('now'), datetime('now')),
  ('recipe5-ca-hoi-sot-tuong-ot', 'Cá hồi sốt tương ớt mật ong', 'Món Âu-Việt kết hợp, vị chua cay ngọt.', '1. Áp chảo cá hồi chín tới.
2. Pha sốt tương ớt với mật ong.
3. Rưới sốt lên cá khi dùng.', 1, 460, 40.3, 26.1, 11.2, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe5-dau-que-xao-thit-hop', 'Đậu que xào thịt hộp', 'Món xào nhanh, thêm rau cho cân bằng.', '1. Xào đậu que tới chín tới.
2. Cho thịt hộp thái lát vào xào chung.
3. Nêm nếm vừa ăn.', 2, 186, 8.3, 13.7, 8.5, 'maintain', datetime('now'), datetime('now')),
  ('recipe5-salad-uc-ga-gio-thu', 'Salad ức gà giò thủ', 'Món ăn nhẹ giàu đạm, lạ miệng.', '1. Luộc ức gà, xé sợi.
2. Thái lát giò thủ.
3. Trộn cùng dưa leo, rưới dầu ô liu.', 1, 404, 54.6, 18, 2.9, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe5-canh-trung-ca-chua-mi', 'Canh trứng cà chua ăn cùng mì', 'Món nước nhẹ bụng, nhanh gọn.', '1. Phi cà chua với chút dầu.
2. Đổ nước, đun sôi, cho trứng đánh tan vào khuấy đều.
3. Trụng mì riêng, chan canh khi dùng.', 1, 522, 21.1, 24.8, 55.4, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe5-thit-bo-sot-tuong-den-com', 'Cơm thịt bò sốt tương đen', 'Bữa chính đậm vị kiểu Hoa.', '1. Ướp thịt bò với nước tương, tỏi.
2. Áp chảo bò chín tới.
3. Dọn cùng cơm trắng.', 1, 769, 58.6, 30.6, 56.9, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe5-dau-phong-rang-muoi', 'Đậu phộng rang muối', 'Món nhắm/ăn vặt quen thuộc.', '1. Rang đậu phộng sống trên lửa nhỏ tới vàng thơm.
2. Rắc muối khi còn nóng.
3. Để nguội, dùng dần.', 2, 284, 12.9, 24.6, 8.1, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe5-banh-mi-thit-hop', 'Bánh mì thịt hộp', 'Bữa sáng nhanh, tiện lợi.', '1. Xắt lát thịt hộp, áp chảo sơ.
2. Xẻ bánh mì, kẹp thịt hộp và dưa leo.
3. Thêm tương ớt nếu thích.', 1, 518, 19.6, 24.8, 52.5, 'maintain', datetime('now'), datetime('now')),
  ('recipe5-ga-xao-xa-ot-nuoc-mam', 'Gà xào sả ớt nước mắm', 'Món xào cay nồng, đưa cơm.', '1. Ướp gà với sả, ớt.
2. Xào gà chín vàng.
3. Nêm nước mắm, đảo đều tới thấm.', 2, 260, 47.1, 5.5, 2.8, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe5-canh-rong-bien-dau-hu', 'Canh rong biển đậu hũ', 'Canh thanh đạm kiểu Nhật-Hàn, ít calo.', '1. Ngâm nở rong biển khô (dùng tạm rau cải bó xôi thay thế về mặt dinh dưỡng).
2. Nấu nước dùng, cho đậu hũ vào.
3. Nêm nước tương, đun sôi nhẹ.', 2, 72, 7.9, 3.8, 3.5, 'lose_weight', datetime('now'), datetime('now'))
ON CONFLICT (id) DO NOTHING;

INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES
  ('ing5-mi-tom-trung-0', 'recipe5-mi-tom-trung', 'food-mi-an-lien', 'Mì ăn liền', 80, 'g', 0),
  ('ing5-mi-tom-trung-1', 'recipe5-mi-tom-trung', 'food-trung-ga', 'Trứng gà', 60, 'g', 1),
  ('ing5-ca-hop-sot-ca-kho-0', 'recipe5-ca-hop-sot-ca-kho', 'food-ca-hop-sot-ca', 'Cá hộp sốt cà', 150, 'g', 0),
  ('ing5-ca-hop-sot-ca-kho-1', 'recipe5-ca-hop-sot-ca-kho', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 1),
  ('ing5-salad-ca-ngu-hop-0', 'recipe5-salad-ca-ngu-hop', 'food-ca-ngu-hop', 'Cá ngừ hộp', 150, 'g', 0),
  ('ing5-salad-ca-ngu-hop-1', 'recipe5-salad-ca-ngu-hop', 'food-dua-leo', 'Dưa leo', 80, 'g', 1),
  ('ing5-salad-ca-ngu-hop-2', 'recipe5-salad-ca-ngu-hop', 'food-ca-chua', 'Cà chua', 50, 'g', 2),
  ('ing5-salad-ca-ngu-hop-3', 'recipe5-salad-ca-ngu-hop', 'food-dau-oliu', 'Dầu ô liu', 5, 'g', 3),
  ('ing5-banh-mi-pate-xuc-xich-0', 'recipe5-banh-mi-pate-xuc-xich', 'food-banh-mi', 'Bánh mì', 100, 'g', 0),
  ('ing5-banh-mi-pate-xuc-xich-1', 'recipe5-banh-mi-pate-xuc-xich', 'food-pate-hop', 'Pate hộp', 30, 'g', 1),
  ('ing5-banh-mi-pate-xuc-xich-2', 'recipe5-banh-mi-pate-xuc-xich', 'food-xuc-xich', 'Xúc xích', 50, 'g', 2),
  ('ing5-com-chien-xuc-xich-0', 'recipe5-com-chien-xuc-xich', 'food-gao-trang', 'Cơm nguội', 200, 'g', 0),
  ('ing5-com-chien-xuc-xich-1', 'recipe5-com-chien-xuc-xich', 'food-xuc-xich', 'Xúc xích', 60, 'g', 1),
  ('ing5-com-chien-xuc-xich-2', 'recipe5-com-chien-xuc-xich', 'food-trung-ga', 'Trứng gà', 50, 'g', 2),
  ('ing5-com-chien-xuc-xich-3', 'recipe5-com-chien-xuc-xich', 'food-nuoc-tuong', 'Nước tương', 10, 'g', 3),
  ('ing5-thit-heo-kho-dua-chua-0', 'recipe5-thit-heo-kho-dua-chua', 'food-thit-heo', 'Thịt heo', 200, 'g', 0),
  ('ing5-thit-heo-kho-dua-chua-1', 'recipe5-thit-heo-kho-dua-chua', 'food-dua-chua', 'Dưa cải chua', 150, 'g', 1),
  ('ing5-thit-heo-kho-dua-chua-2', 'recipe5-thit-heo-kho-dua-chua', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 2),
  ('ing5-kim-chi-xao-thit-bo-0', 'recipe5-kim-chi-xao-thit-bo', 'food-thit-bo', 'Thịt bò', 200, 'g', 0),
  ('ing5-kim-chi-xao-thit-bo-1', 'recipe5-kim-chi-xao-thit-bo', 'food-kim-chi', 'Kim chi', 150, 'g', 1),
  ('ing5-gio-thu-dua-chua-0', 'recipe5-gio-thu-dua-chua', 'food-gio-thu', 'Giò thủ', 150, 'g', 0),
  ('ing5-gio-thu-dua-chua-1', 'recipe5-gio-thu-dua-chua', 'food-dua-chua', 'Dưa cải chua', 100, 'g', 1),
  ('ing5-trung-chien-nuoc-tuong-0', 'recipe5-trung-chien-nuoc-tuong', 'food-trung-ga', 'Trứng gà', 150, 'g', 0),
  ('ing5-trung-chien-nuoc-tuong-1', 'recipe5-trung-chien-nuoc-tuong', 'food-nuoc-tuong', 'Nước tương', 10, 'g', 1),
  ('ing5-trung-chien-nuoc-tuong-2', 'recipe5-trung-chien-nuoc-tuong', 'food-gao-trang', 'Gạo trắng (đã nấu)', 150, 'g', 2),
  ('ing5-tom-sot-tuong-ot-0', 'recipe5-tom-sot-tuong-ot', 'food-tom', 'Tôm', 250, 'g', 0),
  ('ing5-tom-sot-tuong-ot-1', 'recipe5-tom-sot-tuong-ot', 'food-tuong-ot', 'Tương ớt', 30, 'g', 1),
  ('ing5-mi-an-lien-xao-bo-0', 'recipe5-mi-an-lien-xao-bo', 'food-mi-an-lien', 'Mì ăn liền', 80, 'g', 0),
  ('ing5-mi-an-lien-xao-bo-1', 'recipe5-mi-an-lien-xao-bo', 'food-thit-bo', 'Thịt bò', 100, 'g', 1),
  ('ing5-mi-an-lien-xao-bo-2', 'recipe5-mi-an-lien-xao-bo', 'food-cai-bo-xoi', 'Cải bó xôi', 100, 'g', 2),
  ('ing5-dau-hu-sot-nuoc-tuong-0', 'recipe5-dau-hu-sot-nuoc-tuong', 'food-dau-phu', 'Đậu phụ', 200, 'g', 0),
  ('ing5-dau-hu-sot-nuoc-tuong-1', 'recipe5-dau-hu-sot-nuoc-tuong', 'food-nuoc-tuong', 'Nước tương', 15, 'g', 1),
  ('ing5-xuc-xich-nuong-khoai-lang-0', 'recipe5-xuc-xich-nuong-khoai-lang', 'food-xuc-xich', 'Xúc xích', 100, 'g', 0),
  ('ing5-xuc-xich-nuong-khoai-lang-1', 'recipe5-xuc-xich-nuong-khoai-lang', 'food-khoai-lang', 'Khoai lang', 200, 'g', 1),
  ('ing5-canh-ca-hop-rau-cai-0', 'recipe5-canh-ca-hop-rau-cai', 'food-ca-hop-sot-ca', 'Cá hộp sốt cà', 150, 'g', 0),
  ('ing5-canh-ca-hop-rau-cai-1', 'recipe5-canh-ca-hop-rau-cai', 'food-cai-thia', 'Cải thìa', 150, 'g', 1),
  ('ing5-salad-trung-pho-mai-0', 'recipe5-salad-trung-pho-mai', 'food-trung-ga', 'Trứng gà', 150, 'g', 0),
  ('ing5-salad-trung-pho-mai-1', 'recipe5-salad-trung-pho-mai', 'food-pho-mai', 'Phô mai', 30, 'g', 1),
  ('ing5-salad-trung-pho-mai-2', 'recipe5-salad-trung-pho-mai', 'food-dua-leo', 'Dưa leo', 80, 'g', 2),
  ('ing5-thit-bo-kho-tuong-den-0', 'recipe5-thit-bo-kho-tuong-den', 'food-thit-bo', 'Thịt bò', 250, 'g', 0),
  ('ing5-thit-bo-kho-tuong-den-1', 'recipe5-thit-bo-kho-tuong-den', 'food-hanh-tay', 'Hành tây', 100, 'g', 1),
  ('ing5-thit-bo-kho-tuong-den-2', 'recipe5-thit-bo-kho-tuong-den', 'food-nuoc-tuong', 'Nước tương', 15, 'g', 2),
  ('ing5-ca-ngu-hop-tron-bun-0', 'recipe5-ca-ngu-hop-tron-bun', 'food-bun-pho', 'Bún', 150, 'g', 0),
  ('ing5-ca-ngu-hop-tron-bun-1', 'recipe5-ca-ngu-hop-tron-bun', 'food-ca-ngu-hop', 'Cá ngừ hộp', 100, 'g', 1),
  ('ing5-ca-ngu-hop-tron-bun-2', 'recipe5-ca-ngu-hop-tron-bun', 'food-dua-leo', 'Dưa leo', 50, 'g', 2),
  ('ing5-ca-ngu-hop-tron-bun-3', 'recipe5-ca-ngu-hop-tron-bun', 'food-ca-rot', 'Cà rốt', 50, 'g', 3),
  ('ing5-ga-kho-nuoc-mam-0', 'recipe5-ga-kho-nuoc-mam', 'food-thit-ga', 'Thịt gà', 300, 'g', 0),
  ('ing5-ga-kho-nuoc-mam-1', 'recipe5-ga-kho-nuoc-mam', 'food-nuoc-mam', 'Nước mắm', 20, 'g', 1),
  ('ing5-ga-kho-nuoc-mam-2', 'recipe5-ga-kho-nuoc-mam', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 2),
  ('ing5-salad-dau-hu-kim-chi-0', 'recipe5-salad-dau-hu-kim-chi', 'food-dau-phu', 'Đậu phụ', 150, 'g', 0),
  ('ing5-salad-dau-hu-kim-chi-1', 'recipe5-salad-dau-hu-kim-chi', 'food-kim-chi', 'Kim chi', 100, 'g', 1),
  ('ing5-thit-hop-xao-dua-chua-0', 'recipe5-thit-hop-xao-dua-chua', 'food-thit-hop', 'Thịt hộp', 100, 'g', 0),
  ('ing5-thit-hop-xao-dua-chua-1', 'recipe5-thit-hop-xao-dua-chua', 'food-dua-chua', 'Dưa cải chua', 100, 'g', 1),
  ('ing5-mi-tron-xuc-xich-trung-0', 'recipe5-mi-tron-xuc-xich-trung', 'food-mi-an-lien', 'Mì ăn liền', 80, 'g', 0),
  ('ing5-mi-tron-xuc-xich-trung-1', 'recipe5-mi-tron-xuc-xich-trung', 'food-xuc-xich', 'Xúc xích', 60, 'g', 1),
  ('ing5-mi-tron-xuc-xich-trung-2', 'recipe5-mi-tron-xuc-xich-trung', 'food-trung-ga', 'Trứng gà', 60, 'g', 2),
  ('ing5-ca-hoi-sot-tuong-ot-0', 'recipe5-ca-hoi-sot-tuong-ot', 'food-ca-hoi', 'Cá hồi', 200, 'g', 0),
  ('ing5-ca-hoi-sot-tuong-ot-1', 'recipe5-ca-hoi-sot-tuong-ot', 'food-tuong-ot', 'Tương ớt', 15, 'g', 1),
  ('ing5-ca-hoi-sot-tuong-ot-2', 'recipe5-ca-hoi-sot-tuong-ot', 'food-mat-ong', 'Mật ong', 10, 'g', 2),
  ('ing5-dau-que-xao-thit-hop-0', 'recipe5-dau-que-xao-thit-hop', 'food-dau-que', 'Đậu que', 200, 'g', 0),
  ('ing5-dau-que-xao-thit-hop-1', 'recipe5-dau-que-xao-thit-hop', 'food-thit-hop', 'Thịt hộp', 100, 'g', 1),
  ('ing5-salad-uc-ga-gio-thu-0', 'recipe5-salad-uc-ga-gio-thu', 'food-thit-ga', 'Ức gà', 150, 'g', 0),
  ('ing5-salad-uc-ga-gio-thu-1', 'recipe5-salad-uc-ga-gio-thu', 'food-gio-thu', 'Giò thủ', 50, 'g', 1),
  ('ing5-salad-uc-ga-gio-thu-2', 'recipe5-salad-uc-ga-gio-thu', 'food-dua-leo', 'Dưa leo', 80, 'g', 2),
  ('ing5-salad-uc-ga-gio-thu-3', 'recipe5-salad-uc-ga-gio-thu', 'food-dau-oliu', 'Dầu ô liu', 5, 'g', 3),
  ('ing5-canh-trung-ca-chua-mi-0', 'recipe5-canh-trung-ca-chua-mi', 'food-ca-chua', 'Cà chua', 100, 'g', 0),
  ('ing5-canh-trung-ca-chua-mi-1', 'recipe5-canh-trung-ca-chua-mi', 'food-trung-ga', 'Trứng gà', 100, 'g', 1),
  ('ing5-canh-trung-ca-chua-mi-2', 'recipe5-canh-trung-ca-chua-mi', 'food-mi-an-lien', 'Mì ăn liền', 80, 'g', 2),
  ('ing5-thit-bo-sot-tuong-den-com-0', 'recipe5-thit-bo-sot-tuong-den-com', 'food-thit-bo', 'Thịt bò', 200, 'g', 0),
  ('ing5-thit-bo-sot-tuong-den-com-1', 'recipe5-thit-bo-sot-tuong-den-com', 'food-nuoc-tuong', 'Nước tương', 15, 'g', 1),
  ('ing5-thit-bo-sot-tuong-den-com-2', 'recipe5-thit-bo-sot-tuong-den-com', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 2),
  ('ing5-dau-phong-rang-muoi-0', 'recipe5-dau-phong-rang-muoi', 'food-dau-phong-song', 'Đậu phộng', 100, 'g', 0),
  ('ing5-banh-mi-thit-hop-0', 'recipe5-banh-mi-thit-hop', 'food-banh-mi', 'Bánh mì', 100, 'g', 0),
  ('ing5-banh-mi-thit-hop-1', 'recipe5-banh-mi-thit-hop', 'food-thit-hop', 'Thịt hộp', 80, 'g', 1),
  ('ing5-banh-mi-thit-hop-2', 'recipe5-banh-mi-thit-hop', 'food-dua-leo', 'Dưa leo', 30, 'g', 2),
  ('ing5-ga-xao-xa-ot-nuoc-mam-0', 'recipe5-ga-xao-xa-ot-nuoc-mam', 'food-thit-ga', 'Thịt gà', 300, 'g', 0),
  ('ing5-ga-xao-xa-ot-nuoc-mam-1', 'recipe5-ga-xao-xa-ot-nuoc-mam', 'food-sa', 'Sả', 20, 'g', 1),
  ('ing5-ga-xao-xa-ot-nuoc-mam-2', 'recipe5-ga-xao-xa-ot-nuoc-mam', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 2),
  ('ing5-canh-rong-bien-dau-hu-0', 'recipe5-canh-rong-bien-dau-hu', 'food-cai-bo-xoi', 'Rong biển (quy đổi)', 100, 'g', 0),
  ('ing5-canh-rong-bien-dau-hu-1', 'recipe5-canh-rong-bien-dau-hu', 'food-dau-phu', 'Đậu phụ', 150, 'g', 1),
  ('ing5-canh-rong-bien-dau-hu-2', 'recipe5-canh-rong-bien-dau-hu', 'food-nuoc-tuong', 'Nước tương', 10, 'g', 2)
ON CONFLICT (id) DO NOTHING;

