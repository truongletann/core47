-- Migration: 0053_meal_seed_recipes
-- Target: Cloudflare D1 (SQLite)
-- Seeds a starter library of 15 real recipes (breakfast/lunch/dinner/snack,
-- covering all 4 goals) so the recipe library page isn't empty on first
-- visit. Adds a few more meal_foods entries needed by these recipes, then
-- each recipe's ingredients link to a food so per-serving totals below are
-- computed the same way the admin "Tính tự động từ nguyên liệu" button
-- would (sum of quantity/100 * food's per-100g values, divided by servings).

INSERT INTO meal_foods (id, name, calories_per_100g, protein_per_100g, fat_per_100g, carb_per_100g, created_at, updated_at) VALUES
  ('food-yen-mach',       'Yến mạch',              389, 16.9, 6.9,  66.3, datetime('now'), datetime('now')),
  ('food-banh-mi',        'Bánh mì',               265, 9.0,  3.2,  49.0, datetime('now'), datetime('now')),
  ('food-bun-pho',        'Bún/phở (đã luộc)',     109, 1.8,  0.2,  25.0, datetime('now'), datetime('now')),
  ('food-ca-chua',        'Cà chua',               18,  0.9,  0.2,  3.9,  datetime('now'), datetime('now')),
  ('food-dua-leo',        'Dưa leo',               15,  0.7,  0.1,  3.6,  datetime('now'), datetime('now')),
  ('food-dau-oliu',       'Dầu ô liu',             884, 0.0,  100.0, 0.0, datetime('now'), datetime('now')),
  ('food-hanh-nhan',      'Hạnh nhân',             579, 21.0, 50.0, 22.0, datetime('now'), datetime('now')),
  ('food-sua-chua',       'Sữa chua không đường',  61,  3.5,  3.3,  4.7,  datetime('now'), datetime('now')),
  ('food-qua-bo',         'Quả bơ',                160, 2.0,  15.0, 8.5,  datetime('now'), datetime('now')),
  ('food-bo-dau-phong',   'Bơ đậu phộng',          588, 25.0, 50.0, 20.0, datetime('now'), datetime('now'))
ON CONFLICT (name) DO NOTHING;

INSERT INTO meal_recipes (id, name, description, instructions, servings, calories_per_serving, protein_g, fat_g, carb_g, goal_tags, created_at, updated_at) VALUES
  ('recipe-com-ga-xe', 'Cơm gà xé', 'Ức gà luộc xé sợi ăn cùng cơm trắng và rau muống, ít dầu mỡ.',
    '1. Luộc ức gà với chút muối và gừng cho thơm.
2. Xé nhỏ thịt gà, để ráo.
3. Luộc/xào rau muống với ít dầu.
4. Dọn cơm trắng cùng gà xé và rau muống.',
    2, 387, 50.5, 5.8, 29.6, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-uc-ga-ap-chao-salad', 'Ức gà áp chảo salad', 'Ức gà áp chảo ăn kèm salad dưa leo cà chua, dùng dầu ô liu.',
    '1. Ướp ức gà với muối, tiêu.
2. Áp chảo ức gà với chút dầu ô liu tới chín vàng hai mặt.
3. Thái lát dưa leo, cà chua.
4. Cắt ức gà thành lát, trộn cùng rau, rưới thêm dầu ô liu.',
    1, 451, 63.6, 17.5, 7.5, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-trung-chien-rau-cu', 'Trứng chiên cà chua', 'Món quen thuộc, nhanh gọn, giàu đạm.',
    '1. Đánh tan trứng, nêm chút muối.
2. Cắt nhỏ cà chua.
3. Phi cà chua với dầu ô liu cho mềm.
4. Đổ trứng vào chiên chín, đảo đều.',
    1, 286, 20.0, 21.6, 3.6, 'maintain', datetime('now'), datetime('now')),

  ('recipe-chao-yen-mach-chuoi', 'Cháo yến mạch chuối', 'Bữa sáng nhanh, no lâu, tốt cho tiêu hoá.',
    '1. Nấu yến mạch với sữa tươi trên lửa nhỏ tới sánh mịn.
2. Cắt lát chuối.
3. Múc cháo ra bát, xếp chuối lên trên.',
    1, 406, 16.0, 10.4, 65.8, 'lose_weight,maintain', datetime('now'), datetime('now')),

  ('recipe-sinh-to-bo-dau-phong', 'Sinh tố bơ đậu phộng chuối', 'Sinh tố giàu năng lượng, phù hợp người cần tăng cân/tăng cơ.',
    '1. Cho bơ, chuối, bơ đậu phộng, sữa tươi vào máy xay.
2. Xay nhuyễn mịn.
3. Rót ra ly, dùng ngay.',
    1, 658, 19.6, 46.1, 53.8, 'gain_weight,gain_muscle', datetime('now'), datetime('now')),

  ('recipe-com-thit-bo-xao-bong-cai', 'Cơm thịt bò xào bông cải', 'Món giàu đạm và sắt, hỗ trợ tăng cơ.',
    '1. Thái thịt bò mỏng, ướp tỏi, tiêu, chút dầu ăn.
2. Xào thịt bò lửa lớn nhanh tay tới chín tới.
3. Xào bông cải xanh riêng cho giòn.
4. Trộn thịt bò và bông cải, dọn cùng cơm trắng.',
    2, 468, 37.3, 19.4, 33.0, 'gain_muscle', datetime('now'), datetime('now')),

  ('recipe-dau-phu-sot-ca-chua', 'Đậu phụ sốt cà chua', 'Món chay nhẹ nhàng, ít calo.',
    '1. Cắt đậu phụ thành miếng vừa ăn, chiên sơ hoặc để nguyên.
2. Phi thơm cà chua băm nhỏ với dầu ô liu.
3. Cho đậu phụ vào, đảo nhẹ tay, nêm nếm.
4. Đun tới khi sốt sánh lại.',
    2, 134, 8.7, 10.0, 4.8, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-tom-hap-khoai-lang', 'Tôm hấp khoai lang', 'Bữa ăn nhẹ, giàu đạm, ít béo.',
    '1. Hấp tôm với sả tới chín, bóc vỏ.
2. Hấp hoặc luộc khoai lang tới mềm.
3. Dọn tôm và khoai lang ra đĩa, dùng nóng.',
    2, 185, 25.6, 0.4, 20.2, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-ca-kho-rau-muong', 'Cá kho rau muống', 'Cơm nhà truyền thống, cân bằng dinh dưỡng.',
    '1. Kho cá với nước mắm, đường, tiêu tới thấm.
2. Luộc rau muống, vớt ra để ráo.
3. Dọn cá kho, rau muống cùng cơm trắng.',
    2, 280, 27.8, 4.3, 31.1, 'maintain', datetime('now'), datetime('now')),

  ('recipe-bun-thit-heo-nuong', 'Bún thịt heo nướng', 'Món trưa quen thuộc, đủ chất.',
    '1. Ướp thịt heo với tỏi, sả, nước mắm rồi nướng chín thơm.
2. Trụng bún qua nước sôi.
3. Thái dưa leo, cà chua.
4. Trộn bún với thịt nướng, rau sống, chan nước mắm chua ngọt.',
    2, 305, 26.2, 10.3, 26.9, 'maintain', datetime('now'), datetime('now')),

  ('recipe-banh-mi-trung-op-la', 'Bánh mì trứng ốp la', 'Bữa sáng nhanh gọn.',
    '1. Chiên trứng ốp la với chút dầu.
2. Thái lát dưa leo.
3. Xẻ bánh mì, kẹp trứng và dưa leo vào.',
    1, 372, 20.4, 13.6, 41.4, 'maintain', datetime('now'), datetime('now')),

  ('recipe-sua-chua-hanh-nhan-chuoi', 'Sữa chua hạnh nhân chuối', 'Bữa phụ lành mạnh, giàu probiotic.',
    '1. Múc sữa chua ra ly.
2. Cắt lát chuối, rắc hạnh nhân lên trên.
3. Trộn đều trước khi dùng.',
    1, 296, 10.6, 15.3, 34.5, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-thit-heo-kho-trung', 'Thịt heo kho trứng', 'Món ăn quen thuộc, giàu năng lượng.',
    '1. Thịt heo cắt miếng vừa ăn, ướp nước mắm, đường, tiêu.
2. Luộc chín trứng, bóc vỏ.
3. Kho thịt tới săn lại rồi cho trứng vào, kho lửa nhỏ tới thấm.
4. Dọn cùng cơm trắng.',
    3, 378, 34.5, 17.5, 19.4, 'gain_weight', datetime('now'), datetime('now')),

  ('recipe-salad-uc-ga-bo', 'Salad ức gà bơ', 'Món giàu đạm và chất béo tốt, hỗ trợ tăng cơ.',
    '1. Áp chảo ức gà chín, thái lát.
2. Cắt lát quả bơ, cà chua, dưa leo.
3. Trộn tất cả cùng ức gà, nêm nhẹ dầu ô liu nếu thích.',
    1, 507, 64.8, 22.4, 12.3, 'gain_muscle', datetime('now'), datetime('now')),

  ('recipe-chao-yen-mach-trung-bo', 'Cháo yến mạch trứng thịt bò', 'Bữa sáng giàu năng lượng và đạm cho người tập luyện.',
    '1. Nấu yến mạch với sữa tươi tới sánh.
2. Áp chảo thịt bò băm/lát mỏng chín tới.
3. Luộc hoặc chần trứng.
4. Trộn thịt bò và trứng vào cháo, dùng nóng.',
    1, 730, 53.9, 35.1, 48.1, 'gain_muscle', datetime('now'), datetime('now'))
ON CONFLICT (id) DO NOTHING;

INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES
  ('ing-cgx-1', 'recipe-com-ga-xe', 'food-thit-ga', 'Ức gà', 300, 'g', 0),
  ('ing-cgx-2', 'recipe-com-ga-xe', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 1),
  ('ing-cgx-3', 'recipe-com-ga-xe', 'food-rau-muong', 'Rau muống', 100, 'g', 2),

  ('ing-ugascs-1', 'recipe-uc-ga-ap-chao-salad', 'food-thit-ga', 'Ức gà', 200, 'g', 0),
  ('ing-ugascs-2', 'recipe-uc-ga-ap-chao-salad', 'food-dua-leo', 'Dưa leo', 100, 'g', 1),
  ('ing-ugascs-3', 'recipe-uc-ga-ap-chao-salad', 'food-ca-chua', 'Cà chua', 100, 'g', 2),
  ('ing-ugascs-4', 'recipe-uc-ga-ap-chao-salad', 'food-dau-oliu', 'Dầu ô liu', 10, 'g', 3),

  ('ing-tcrc-1', 'recipe-trung-chien-rau-cu', 'food-trung-ga', 'Trứng gà', 150, 'g', 0),
  ('ing-tcrc-2', 'recipe-trung-chien-rau-cu', 'food-ca-chua', 'Cà chua', 50, 'g', 1),
  ('ing-tcrc-3', 'recipe-trung-chien-rau-cu', 'food-dau-oliu', 'Dầu ô liu', 5, 'g', 2),

  ('ing-cymc-1', 'recipe-chao-yen-mach-chuoi', 'food-yen-mach', 'Yến mạch', 50, 'g', 0),
  ('ing-cymc-2', 'recipe-chao-yen-mach-chuoi', 'food-chuoi', 'Chuối', 100, 'g', 1),
  ('ing-cymc-3', 'recipe-chao-yen-mach-chuoi', 'food-sua-tuoi', 'Sữa tươi', 200, 'ml', 2),

  ('ing-stbdp-1', 'recipe-sinh-to-bo-dau-phong', 'food-qua-bo', 'Quả bơ', 150, 'g', 0),
  ('ing-stbdp-2', 'recipe-sinh-to-bo-dau-phong', 'food-bo-dau-phong', 'Bơ đậu phộng', 30, 'g', 1),
  ('ing-stbdp-3', 'recipe-sinh-to-bo-dau-phong', 'food-sua-tuoi', 'Sữa tươi', 250, 'ml', 2),
  ('ing-stbdp-4', 'recipe-sinh-to-bo-dau-phong', 'food-chuoi', 'Chuối', 100, 'g', 3),

  ('ing-ctbxbc-1', 'recipe-com-thit-bo-xao-bong-cai', 'food-thit-bo', 'Thịt bò', 250, 'g', 0),
  ('ing-ctbxbc-2', 'recipe-com-thit-bo-xao-bong-cai', 'food-bong-cai', 'Bông cải xanh', 150, 'g', 1),
  ('ing-ctbxbc-3', 'recipe-com-thit-bo-xao-bong-cai', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 2),

  ('ing-dpsct-1', 'recipe-dau-phu-sot-ca-chua', 'food-dau-phu', 'Đậu phụ', 200, 'g', 0),
  ('ing-dpsct-2', 'recipe-dau-phu-sot-ca-chua', 'food-ca-chua', 'Cà chua', 150, 'g', 1),
  ('ing-dpsct-3', 'recipe-dau-phu-sot-ca-chua', 'food-dau-oliu', 'Dầu ô liu', 10, 'g', 2),

  ('ing-thkl-1', 'recipe-tom-hap-khoai-lang', 'food-tom', 'Tôm', 200, 'g', 0),
  ('ing-thkl-2', 'recipe-tom-hap-khoai-lang', 'food-khoai-lang', 'Khoai lang', 200, 'g', 1),

  ('ing-ckrm-1', 'recipe-ca-kho-rau-muong', 'food-ca', 'Cá', 250, 'g', 0),
  ('ing-ckrm-2', 'recipe-ca-kho-rau-muong', 'food-rau-muong', 'Rau muống', 200, 'g', 1),
  ('ing-ckrm-3', 'recipe-ca-kho-rau-muong', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 2),

  ('ing-bthn-1', 'recipe-bun-thit-heo-nuong', 'food-thit-heo', 'Thịt heo', 200, 'g', 0),
  ('ing-bthn-2', 'recipe-bun-thit-heo-nuong', 'food-bun-pho', 'Bún', 200, 'g', 1),
  ('ing-bthn-3', 'recipe-bun-thit-heo-nuong', 'food-dua-leo', 'Dưa leo', 50, 'g', 2),
  ('ing-bthn-4', 'recipe-bun-thit-heo-nuong', 'food-ca-chua', 'Cà chua', 50, 'g', 3),

  ('ing-bmtol-1', 'recipe-banh-mi-trung-op-la', 'food-banh-mi', 'Bánh mì', 80, 'g', 0),
  ('ing-bmtol-2', 'recipe-banh-mi-trung-op-la', 'food-trung-ga', 'Trứng gà', 100, 'g', 1),
  ('ing-bmtol-3', 'recipe-banh-mi-trung-op-la', 'food-dua-leo', 'Dưa leo', 30, 'g', 2),

  ('ing-schnc-1', 'recipe-sua-chua-hanh-nhan-chuoi', 'food-sua-chua', 'Sữa chua không đường', 150, 'g', 0),
  ('ing-schnc-2', 'recipe-sua-chua-hanh-nhan-chuoi', 'food-hanh-nhan', 'Hạnh nhân', 20, 'g', 1),
  ('ing-schnc-3', 'recipe-sua-chua-hanh-nhan-chuoi', 'food-chuoi', 'Chuối', 100, 'g', 2),

  ('ing-thkt-1', 'recipe-thit-heo-kho-trung', 'food-thit-heo', 'Thịt heo', 300, 'g', 0),
  ('ing-thkt-2', 'recipe-thit-heo-kho-trung', 'food-trung-ga', 'Trứng gà', 200, 'g', 1),
  ('ing-thkt-3', 'recipe-thit-heo-kho-trung', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 2),

  ('ing-sugb-1', 'recipe-salad-uc-ga-bo', 'food-thit-ga', 'Ức gà', 200, 'g', 0),
  ('ing-sugb-2', 'recipe-salad-uc-ga-bo', 'food-qua-bo', 'Quả bơ', 100, 'g', 1),
  ('ing-sugb-3', 'recipe-salad-uc-ga-bo', 'food-ca-chua', 'Cà chua', 50, 'g', 2),
  ('ing-sugb-4', 'recipe-salad-uc-ga-bo', 'food-dua-leo', 'Dưa leo', 50, 'g', 3),

  ('ing-cymtb-1', 'recipe-chao-yen-mach-trung-bo', 'food-yen-mach', 'Yến mạch', 60, 'g', 0),
  ('ing-cymtb-2', 'recipe-chao-yen-mach-trung-bo', 'food-trung-ga', 'Trứng gà', 100, 'g', 1),
  ('ing-cymtb-3', 'recipe-chao-yen-mach-trung-bo', 'food-thit-bo', 'Thịt bò', 100, 'g', 2),
  ('ing-cymtb-4', 'recipe-chao-yen-mach-trung-bo', 'food-sua-tuoi', 'Sữa tươi', 150, 'ml', 3)
ON CONFLICT (id) DO NOTHING;
