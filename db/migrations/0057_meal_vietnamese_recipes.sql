-- Migration: 0057_meal_vietnamese_recipes
-- Target: Cloudflare D1 (SQLite)
-- Adds 17 more raw/fresh-ingredient meal_foods entries (meat cuts,
-- seafood, produce, staples) and 20 iconic Vietnamese dishes — both
-- self-authored for this app, not sourced from any external site.

INSERT INTO meal_foods (id, name, category, calories_per_100g, protein_per_100g, fat_per_100g, carb_per_100g, created_at, updated_at) VALUES
  ('food-thit-ba-chi', 'Thịt ba chỉ (tươi)', 'thit', 518, 9.3, 53, 0, datetime('now'), datetime('now')),
  ('food-suon-heo', 'Sườn heo (tươi)', 'thit', 297, 16.7, 25.5, 0, datetime('now'), datetime('now')),
  ('food-ca-basa', 'Cá basa (tươi)', 'hai_san', 89, 15, 3, 0, datetime('now'), datetime('now')),
  ('food-ca-hoi', 'Cá hồi (tươi)', 'hai_san', 208, 20, 13, 0, datetime('now'), datetime('now')),
  ('food-ca-thu', 'Cá thu (tươi)', 'hai_san', 205, 19, 13.9, 0, datetime('now'), datetime('now')),
  ('food-cua', 'Thịt cua (tươi)', 'hai_san', 97, 19, 1.5, 0, datetime('now'), datetime('now')),
  ('food-ngheu', 'Nghêu (tươi)', 'hai_san', 86, 14.7, 1, 3.6, datetime('now'), datetime('now')),
  ('food-tom-kho', 'Tôm khô', 'hai_san', 255, 55, 3, 0, datetime('now'), datetime('now')),
  ('food-gia-do', 'Giá đỗ (tươi)', 'rau_cu_qua', 30, 3, 0.2, 5.9, datetime('now'), datetime('now')),
  ('food-du-du-xanh', 'Đu đủ xanh (tươi)', 'rau_cu_qua', 43, 0.5, 0.3, 10.8, datetime('now'), datetime('now')),
  ('food-sa', 'Sả (tươi)', 'rau_cu_qua', 99, 1.8, 0.5, 25.3, datetime('now'), datetime('now')),
  ('food-kho-qua', 'Khổ qua/Mướp đắng (tươi)', 'rau_cu_qua', 17, 1, 0.2, 3.7, datetime('now'), datetime('now')),
  ('food-nuoc-cot-dua', 'Nước cốt dừa', 'khac', 230, 2.3, 24, 3.3, datetime('now'), datetime('now')),
  ('food-cha-lua', 'Chả lụa', 'khac', 240, 16, 18, 3, datetime('now'), datetime('now')),
  ('food-dau-xanh', 'Đậu xanh (đã nấu)', 'khac', 105, 7, 0.4, 19, datetime('now'), datetime('now')),
  ('food-banh-trang', 'Bánh tráng (khô)', 'tinh_bot', 333, 0.6, 0.2, 83, datetime('now'), datetime('now')),
  ('food-mien', 'Miến (đã luộc)', 'tinh_bot', 82, 0.1, 0.1, 20, datetime('now'), datetime('now'))
ON CONFLICT (name) DO NOTHING;

INSERT INTO meal_recipes (id, name, description, instructions, servings, calories_per_serving, protein_g, fat_g, carb_g, goal_tags, created_at, updated_at) VALUES
  ('recipe3-pho-bo', 'Phở bò tái', 'Món nước quốc dân, nước dùng đậm đà.', '1. Trụng bánh phở qua nước sôi, cho vào tô.
2. Xếp thịt bò thái mỏng lên trên.
3. Chan nước dùng nóng, rắc hành lá.', 1, 480, 29.9, 15.4, 52.8, 'maintain', datetime('now'), datetime('now')),
  ('recipe3-bun-bo-hue', 'Bún bò Huế', 'Món nước cay nồng đặc trưng miền Trung.', '1. Nấu nước dùng với sả đập dập.
2. Trụng bún, cho vào tô.
3. Xếp thịt bò, chả lụa lên trên, chan nước dùng.', 1, 728, 50.9, 32, 55.3, 'maintain', datetime('now'), datetime('now')),
  ('recipe3-goi-cuon-tom-thit', 'Gỏi cuốn tôm thịt', 'Món cuốn thanh mát, ít dầu mỡ.', '1. Luộc chín tôm và thịt heo, thái mỏng.
2. Trụng bún.
3. Cuốn bánh tráng với tôm, thịt, bún và rau sống.', 2, 384, 16.4, 21.5, 31.3, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe3-cha-gio', 'Chả giò (nem rán)', 'Món chiên giòn, thường dùng dịp lễ Tết.', '1. Trộn thịt bằm với miến, giá đỗ đã cắt nhỏ.
2. Cuốn bánh tráng thành cuốn nhỏ.
3. Chiên vàng giòn các mặt.', 2, 332, 18.9, 17.6, 25.2, 'maintain', datetime('now'), datetime('now')),
  ('recipe3-com-tam-suon-bi-cha', 'Cơm tấm sườn bì chả', 'Món trưa/tối đậm chất Sài Gòn.', '1. Ướp sườn với gia vị, nướng chín thơm.
2. Cắt lát chả lụa.
3. Dọn sườn, chả cùng cơm tấm.', 1, 974, 46.8, 60.6, 57.5, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe3-bun-cha-ha-noi', 'Bún chả Hà Nội', 'Món trưa nổi tiếng miền Bắc.', '1. Ướp thịt ba chỉ, nướng chín thơm trên than.
2. Pha nước chấm chua ngọt.
3. Dọn bún, chả nướng, đồ chua ăn kèm.', 1, 1020, 18, 80.1, 56.1, 'maintain', datetime('now'), datetime('now')),
  ('recipe3-bo-kho', 'Bò kho', 'Món kho đậm vị, thường ăn cùng bánh mì.', '1. Ướp thịt bò với sả, gia vị.
2. Kho lửa nhỏ cùng cà rốt tới mềm.
3. Dùng cùng bánh mì.', 2, 449, 36.8, 20.2, 26.8, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe3-thit-kho-tau', 'Thịt kho tàu', 'Món kho truyền thống ngày Tết.', '1. Ướp thịt ba chỉ với nước mắm, đường.
2. Kho cùng trứng luộc tới thấm màu.
3. Dọn cùng cơm trắng.', 3, 708, 19.8, 60.5, 19.4, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe3-canh-kho-qua-nhoi-thit', 'Canh khổ qua nhồi thịt', 'Canh thanh mát, giải nhiệt.', '1. Khoét ruột khổ qua, nhồi thịt bằm đã ướp.
2. Nấu nước sôi, thả khổ qua vào.
3. Nấu tới khổ qua mềm, nêm nếm.', 2, 162, 19.3, 7.8, 4.6, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe3-hu-tieu-nam-vang', 'Hủ tiếu Nam Vang', 'Món nước miền Nam, topping đa dạng.', '1. Trụng hủ tiếu qua nước sôi.
2. Nấu nước dùng cùng tôm, thịt.
3. Cho hủ tiếu vào tô, chan nước dùng, xếp tôm thịt lên trên.', 1, 505, 51.6, 10.7, 50.2, 'maintain', datetime('now'), datetime('now')),
  ('recipe3-mi-quang', 'Mì Quảng', 'Đặc sản miền Trung, nước dùng sánh ít.', '1. Trụng mì trứng.
2. Xào tôm, thịt heo cùng gia vị đặc trưng.
3. Cho mì ra tô, xếp tôm thịt và trứng cút lên trên.', 1, 641, 63.5, 20, 50.8, 'maintain', datetime('now'), datetime('now')),
  ('recipe3-banh-cuon-cha-lua', 'Bánh cuốn chả lụa', 'Món sáng nhẹ bụng, mềm mịn.', '1. Tráng bánh cuốn từ bột gạo pha loãng.
2. Cuốn nhân thịt bằm, nấm.
3. Dọn cùng chả lụa thái lát, giá đỗ trụng.', 1, 396, 17.8, 14.9, 46.2, 'maintain', datetime('now'), datetime('now')),
  ('recipe3-che-dau-xanh', 'Chè đậu xanh nước cốt dừa', 'Món tráng miệng ngọt dịu.', '1. Nấu đậu xanh tới mềm nhừ.
2. Cho mật ong vào nêm ngọt vừa ăn.
3. Múc ra chén, chan nước cốt dừa lên trên.', 2, 224, 6.4, 12.3, 24.1, 'gain_weight', datetime('now'), datetime('now')),
  ('recipe3-goi-du-du-tom-kho', 'Gỏi đu đủ tôm khô', 'Món khai vị chua cay giòn giòn.', '1. Bào sợi đu đủ xanh.
2. Trộn cùng tôm khô, đậu phộng rang.
3. Nêm nước mắm chua ngọt, trộn đều.', 2, 111, 10, 3.3, 11.8, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe3-sup-cua', 'Súp cua', 'Món súp sánh mịn, giàu đạm.', '1. Nấu nước dùng, cho thịt cua vào.
2. Đánh tan trứng, rưới từ từ vào nồi súp đang sôi nhẹ.
3. Cho ngô hạt vào, nêm nếm, đun sôi lại.', 2, 136, 18.4, 4.3, 5.5, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe3-canh-chua-ca-loc', 'Canh chua cá lóc', 'Canh chua ngọt đặc trưng Nam Bộ.', '1. Phi thơm cà chua với chút dầu.
2. Đổ nước, đun sôi, thả cá vào nấu chín.
3. Cho giá đỗ vào, nêm chua ngọt vừa ăn.', 2, 148, 23.7, 3.9, 3.4, 'maintain', datetime('now'), datetime('now')),
  ('recipe3-ca-hoi-ap-chao-sot-bo-toi', 'Cá hồi áp chảo sốt bơ tỏi', 'Món Âu-Việt kết hợp, giàu omega-3.', '1. Ướp cá hồi với muối, tiêu.
2. Áp chảo chín vàng hai mặt.
3. Rưới sốt bơ tỏi lên khi dùng.', 1, 504, 40, 36, 0, 'gain_muscle', datetime('now'), datetime('now')),
  ('recipe3-ca-thu-kho-thom', 'Cá thu kho thơm', 'Món kho đưa cơm, vị đậm đà.', '1. Ướp cá thu với nước mắm, đường.
2. Kho lửa nhỏ cùng thơm (dứa) tới thấm.
3. Dọn cùng cơm trắng.', 2, 386, 26.5, 17.7, 28, 'maintain', datetime('now'), datetime('now')),
  ('recipe3-ngheu-hap-sa', 'Nghêu hấp sả', 'Món hải sản giữ vị ngọt tự nhiên.', '1. Ngâm nghêu cho nhả cát.
2. Xếp nghêu cùng sả đập dập vào nồi.
3. Hấp tới nghêu mở miệng, dùng nóng.', 2, 139, 22.2, 1.6, 7.9, 'lose_weight', datetime('now'), datetime('now')),
  ('recipe3-banh-xeo-tom-thit', 'Bánh xèo tôm thịt', 'Món chiên giòn đặc trưng miền Nam.', '1. Pha bột gạo với nước cốt dừa.
2. Xào tôm, thịt ba chỉ, giá đỗ làm nhân.
3. Đổ bột vào chảo, cho nhân vào, chiên giòn gập đôi.', 2, 421, 20.2, 27, 24.1, 'gain_weight', datetime('now'), datetime('now'))
ON CONFLICT (id) DO NOTHING;

INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES
  ('ing3-pho-bo-0', 'recipe3-pho-bo', 'food-bun-pho', 'Bánh phở', 200, 'g', 0),
  ('ing3-pho-bo-1', 'recipe3-pho-bo', 'food-thit-bo', 'Thịt bò', 100, 'g', 1),
  ('ing3-pho-bo-2', 'recipe3-pho-bo', 'food-hanh-tay', 'Hành tây', 30, 'g', 2),
  ('ing3-bun-bo-hue-0', 'recipe3-bun-bo-hue', 'food-bun-pho', 'Bún', 200, 'g', 0),
  ('ing3-bun-bo-hue-1', 'recipe3-bun-bo-hue', 'food-thit-bo', 'Thịt bò', 150, 'g', 1),
  ('ing3-bun-bo-hue-2', 'recipe3-bun-bo-hue', 'food-cha-lua', 'Chả lụa', 50, 'g', 2),
  ('ing3-bun-bo-hue-3', 'recipe3-bun-bo-hue', 'food-sa', 'Sả', 15, 'g', 3),
  ('ing3-goi-cuon-tom-thit-0', 'recipe3-goi-cuon-tom-thit', 'food-banh-trang', 'Bánh tráng', 60, 'g', 0),
  ('ing3-goi-cuon-tom-thit-1', 'recipe3-goi-cuon-tom-thit', 'food-tom', 'Tôm', 100, 'g', 1),
  ('ing3-goi-cuon-tom-thit-2', 'recipe3-goi-cuon-tom-thit', 'food-thit-ba-chi', 'Thịt ba chỉ', 80, 'g', 2),
  ('ing3-goi-cuon-tom-thit-3', 'recipe3-goi-cuon-tom-thit', 'food-bun-pho', 'Bún', 50, 'g', 3),
  ('ing3-cha-gio-0', 'recipe3-cha-gio', 'food-banh-trang', 'Bánh tráng', 50, 'g', 0),
  ('ing3-cha-gio-1', 'recipe3-cha-gio', 'food-thit-heo', 'Thịt heo bằm', 150, 'g', 1),
  ('ing3-cha-gio-2', 'recipe3-cha-gio', 'food-gia-do', 'Giá đỗ', 50, 'g', 2),
  ('ing3-cha-gio-3', 'recipe3-cha-gio', 'food-mien', 'Miến', 30, 'g', 3),
  ('ing3-cha-gio-4', 'recipe3-cha-gio', 'food-dau-oliu', 'Dầu chiên', 20, 'g', 4),
  ('ing3-com-tam-suon-bi-cha-0', 'recipe3-com-tam-suon-bi-cha', 'food-gao-trang', 'Cơm tấm', 200, 'g', 0),
  ('ing3-com-tam-suon-bi-cha-1', 'recipe3-com-tam-suon-bi-cha', 'food-suon-heo', 'Sườn heo', 200, 'g', 1),
  ('ing3-com-tam-suon-bi-cha-2', 'recipe3-com-tam-suon-bi-cha', 'food-cha-lua', 'Chả lụa', 50, 'g', 2),
  ('ing3-bun-cha-ha-noi-0', 'recipe3-bun-cha-ha-noi', 'food-bun-pho', 'Bún', 200, 'g', 0),
  ('ing3-bun-cha-ha-noi-1', 'recipe3-bun-cha-ha-noi', 'food-thit-ba-chi', 'Thịt ba chỉ', 150, 'g', 1),
  ('ing3-bun-cha-ha-noi-2', 'recipe3-bun-cha-ha-noi', 'food-ca-rot', 'Cà rốt', 30, 'g', 2),
  ('ing3-bun-cha-ha-noi-3', 'recipe3-bun-cha-ha-noi', 'food-du-du-xanh', 'Đu đủ xanh', 30, 'g', 3),
  ('ing3-bo-kho-0', 'recipe3-bo-kho', 'food-thit-bo', 'Thịt bò', 250, 'g', 0),
  ('ing3-bo-kho-1', 'recipe3-bo-kho', 'food-ca-rot', 'Cà rốt', 150, 'g', 1),
  ('ing3-bo-kho-2', 'recipe3-bo-kho', 'food-banh-mi', 'Bánh mì', 80, 'g', 2),
  ('ing3-thit-kho-tau-0', 'recipe3-thit-kho-tau', 'food-thit-ba-chi', 'Thịt ba chỉ', 300, 'g', 0),
  ('ing3-thit-kho-tau-1', 'recipe3-thit-kho-tau', 'food-trung-ga', 'Trứng gà', 200, 'g', 1),
  ('ing3-thit-kho-tau-2', 'recipe3-thit-kho-tau', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 2),
  ('ing3-canh-kho-qua-nhoi-thit-0', 'recipe3-canh-kho-qua-nhoi-thit', 'food-kho-qua', 'Khổ qua', 250, 'g', 0),
  ('ing3-canh-kho-qua-nhoi-thit-1', 'recipe3-canh-kho-qua-nhoi-thit', 'food-thit-heo', 'Thịt heo bằm', 150, 'g', 1),
  ('ing3-hu-tieu-nam-vang-0', 'recipe3-hu-tieu-nam-vang', 'food-bun-pho', 'Hủ tiếu', 200, 'g', 0),
  ('ing3-hu-tieu-nam-vang-1', 'recipe3-hu-tieu-nam-vang', 'food-tom', 'Tôm', 100, 'g', 1),
  ('ing3-hu-tieu-nam-vang-2', 'recipe3-hu-tieu-nam-vang', 'food-thit-heo', 'Thịt heo', 100, 'g', 2),
  ('ing3-mi-quang-0', 'recipe3-mi-quang', 'food-mi-trung', 'Mì trứng (đã luộc)', 200, 'g', 0),
  ('ing3-mi-quang-1', 'recipe3-mi-quang', 'food-tom', 'Tôm', 100, 'g', 1),
  ('ing3-mi-quang-2', 'recipe3-mi-quang', 'food-thit-heo', 'Thịt heo', 100, 'g', 2),
  ('ing3-mi-quang-3', 'recipe3-mi-quang', 'food-trung-ga', 'Trứng gà', 50, 'g', 3),
  ('ing3-banh-cuon-cha-lua-0', 'recipe3-banh-cuon-cha-lua', 'food-gao-trang', 'Bột gạo (quy đổi)', 150, 'g', 0),
  ('ing3-banh-cuon-cha-lua-1', 'recipe3-banh-cuon-cha-lua', 'food-cha-lua', 'Chả lụa', 80, 'g', 1),
  ('ing3-banh-cuon-cha-lua-2', 'recipe3-banh-cuon-cha-lua', 'food-gia-do', 'Giá đỗ', 30, 'g', 2),
  ('ing3-che-dau-xanh-0', 'recipe3-che-dau-xanh', 'food-dau-xanh', 'Đậu xanh', 150, 'g', 0),
  ('ing3-che-dau-xanh-1', 'recipe3-che-dau-xanh', 'food-nuoc-cot-dua', 'Nước cốt dừa', 100, 'g', 1),
  ('ing3-che-dau-xanh-2', 'recipe3-che-dau-xanh', 'food-mat-ong', 'Mật ong', 20, 'g', 2),
  ('ing3-goi-du-du-tom-kho-0', 'recipe3-goi-du-du-tom-kho', 'food-du-du-xanh', 'Đu đủ xanh', 200, 'g', 0),
  ('ing3-goi-du-du-tom-kho-1', 'recipe3-goi-du-du-tom-kho', 'food-tom-kho', 'Tôm khô', 30, 'g', 1),
  ('ing3-goi-du-du-tom-kho-2', 'recipe3-goi-du-du-tom-kho', 'food-bo-dau-phong', 'Đậu phộng', 10, 'g', 2),
  ('ing3-sup-cua-0', 'recipe3-sup-cua', 'food-cua', 'Thịt cua', 150, 'g', 0),
  ('ing3-sup-cua-1', 'recipe3-sup-cua', 'food-trung-ga', 'Trứng gà', 50, 'g', 1),
  ('ing3-sup-cua-2', 'recipe3-sup-cua', 'food-ngo', 'Ngô', 50, 'g', 2),
  ('ing3-canh-chua-ca-loc-0', 'recipe3-canh-chua-ca-loc', 'food-ca', 'Cá lóc', 250, 'g', 0),
  ('ing3-canh-chua-ca-loc-1', 'recipe3-canh-chua-ca-loc', 'food-ca-chua', 'Cà chua', 100, 'g', 1),
  ('ing3-canh-chua-ca-loc-2', 'recipe3-canh-chua-ca-loc', 'food-gia-do', 'Giá đỗ', 50, 'g', 2),
  ('ing3-ca-hoi-ap-chao-sot-bo-toi-0', 'recipe3-ca-hoi-ap-chao-sot-bo-toi', 'food-ca-hoi', 'Cá hồi', 200, 'g', 0),
  ('ing3-ca-hoi-ap-chao-sot-bo-toi-1', 'recipe3-ca-hoi-ap-chao-sot-bo-toi', 'food-dau-oliu', 'Dầu ô liu', 10, 'g', 1),
  ('ing3-ca-thu-kho-thom-0', 'recipe3-ca-thu-kho-thom', 'food-ca-thu', 'Cá thu', 250, 'g', 0),
  ('ing3-ca-thu-kho-thom-1', 'recipe3-ca-thu-kho-thom', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 1),
  ('ing3-ngheu-hap-sa-0', 'recipe3-ngheu-hap-sa', 'food-ngheu', 'Nghêu', 300, 'g', 0),
  ('ing3-ngheu-hap-sa-1', 'recipe3-ngheu-hap-sa', 'food-sa', 'Sả', 20, 'g', 1),
  ('ing3-banh-xeo-tom-thit-0', 'recipe3-banh-xeo-tom-thit', 'food-gao-trang', 'Bột gạo (quy đổi)', 150, 'g', 0),
  ('ing3-banh-xeo-tom-thit-1', 'recipe3-banh-xeo-tom-thit', 'food-tom', 'Tôm', 100, 'g', 1),
  ('ing3-banh-xeo-tom-thit-2', 'recipe3-banh-xeo-tom-thit', 'food-thit-ba-chi', 'Thịt ba chỉ', 100, 'g', 2),
  ('ing3-banh-xeo-tom-thit-3', 'recipe3-banh-xeo-tom-thit', 'food-gia-do', 'Giá đỗ', 100, 'g', 3)
ON CONFLICT (id) DO NOTHING;

