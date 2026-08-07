-- Migration: 0054_meal_more_recipes
-- Target: Cloudflare D1 (SQLite)
-- Doubles the recipe library (15 more, ids recipe-16.. through recipe-30..)
-- with 10 more meal_foods entries, same linked-ingredient pattern as
-- 0053_meal_seed_recipes.sql — per-serving totals computed the same way the
-- admin auto-calc button would.

INSERT INTO meal_foods (id, name, calories_per_100g, protein_per_100g, fat_per_100g, carb_per_100g, created_at, updated_at) VALUES
  ('food-nam',        'Nấm',            22,  3.1,  0.3,  3.3,  datetime('now'), datetime('now')),
  ('food-bi-do',      'Bí đỏ',          26,  1.0,  0.1,  6.5,  datetime('now'), datetime('now')),
  ('food-cai-bo-xoi', 'Cải bó xôi',     23,  2.9,  0.4,  3.6,  datetime('now'), datetime('now')),
  ('food-ngo',        'Ngô',            96,  3.4,  1.5,  21.0, datetime('now'), datetime('now')),
  ('food-dau-que',    'Đậu que',        31,  1.8,  0.2,  7.0,  datetime('now'), datetime('now')),
  ('food-pho-mai',    'Phô mai',        402, 25.0, 33.0, 1.3,  datetime('now'), datetime('now')),
  ('food-hanh-tay',   'Hành tây',       40,  1.1,  0.1,  9.3,  datetime('now'), datetime('now')),
  ('food-muc',        'Mực',            92,  15.6, 1.4,  3.1,  datetime('now'), datetime('now')),
  ('food-thit-vit',   'Thịt vịt',       337, 19.0, 28.4, 0.0,  datetime('now'), datetime('now')),
  ('food-dau-lang',   'Đậu lăng (đã nấu)', 116, 9.0, 0.4, 20.0, datetime('now'), datetime('now'))
ON CONFLICT (name) DO NOTHING;

INSERT INTO meal_recipes (id, name, description, instructions, servings, calories_per_serving, protein_g, fat_g, carb_g, goal_tags, created_at, updated_at) VALUES
  ('recipe-canh-bi-do-thit-bam', 'Canh bí đỏ nấu thịt bằm', 'Canh thanh mát, dễ nấu, hợp bữa cơm gia đình.',
    '1. Phi thơm hành, cho thịt bằm vào xào săn.
2. Cho bí đỏ đã gọt vỏ, cắt miếng vào xào sơ.
3. Đổ nước, nêm nếm, nấu tới bí mềm.',
    2, 120, 13.0, 5.1, 6.5, 'maintain', datetime('now'), datetime('now')),

  ('recipe-sup-nam-ga', 'Súp nấm gà', 'Súp nhẹ bụng, giàu đạm, ít calo.',
    '1. Luộc ức gà, xé sợi.
2. Thái lát nấm.
3. Nấu nước dùng, cho nấm vào nấu chín.
4. Cho gà xé vào, nêm nếm, đun sôi lại.',
    2, 140, 25.6, 2.9, 2.5, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-cai-bo-xoi-xao-toi', 'Cải bó xôi xào tỏi', 'Món rau nhanh gọn, ít calo, nhiều chất xơ.',
    '1. Rửa sạch cải bó xôi, để ráo.
2. Phi thơm tỏi với dầu ô liu.
3. Cho cải vào xào lửa lớn tới chín tới, nêm nếm.',
    2, 67, 2.9, 5.4, 3.6, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-salad-ca-trung', 'Salad cá trứng', 'Giàu đạm và omega, hỗ trợ tăng cơ.',
    '1. Áp chảo hoặc hấp cá chín, dằm nhỏ.
2. Luộc trứng, bổ múi cau.
3. Trộn cá, trứng, cải bó xôi cùng dầu ô liu.',
    1, 476, 51.9, 27.4, 4.7, 'gain_muscle', datetime('now'), datetime('now')),

  ('recipe-com-chien-trung-dau-que', 'Cơm chiên trứng đậu que', 'Cơm chiên đơn giản, cân bằng dinh dưỡng.',
    '1. Luộc/hấp đậu que, cắt khúc nhỏ.
2. Đánh tan trứng, tráng chín, thái sợi.
3. Chiên cơm với chút dầu, cho đậu que và trứng vào đảo đều, nêm nếm.',
    2, 223, 10.1, 5.9, 32.1, 'maintain', datetime('now'), datetime('now')),

  ('recipe-muc-xao-hanh-tay', 'Mực xào hành tây', 'Món hải sản ít béo, giàu đạm.',
    '1. Sơ chế mực, cắt khoanh, chần sơ qua nước sôi.
2. Thái múi cau hành tây.
3. Phi thơm tỏi với dầu ô liu, cho mực và hành tây vào xào lửa lớn nhanh tay.',
    2, 156, 16.2, 6.5, 7.8, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-ngo-luoc-trung-luoc', 'Ngô luộc trứng luộc', 'Bữa phụ đơn giản, dễ chuẩn bị.',
    '1. Luộc ngô tới chín mềm.
2. Luộc trứng chín tới.
3. Dùng cùng nhau khi còn ấm.',
    1, 299, 18.1, 13.3, 32.6, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-sinh-to-pho-mai-chuoi', 'Sinh tố phô mai chuối', 'Sinh tố giàu năng lượng cho người cần tăng cân.',
    '1. Cho phô mai, chuối, sữa tươi vào máy xay.
2. Xay nhuyễn mịn.
3. Rót ra ly, dùng ngay.',
    1, 457, 20.6, 23.6, 44.8, 'gain_weight', datetime('now'), datetime('now')),

  ('recipe-dau-lang-ham-rau-cu', 'Đậu lăng hầm rau củ', 'Món chay giàu đạm thực vật và chất xơ.',
    '1. Cho đậu lăng đã nấu, bí đỏ cắt miếng, cà chua vào nồi.
2. Đổ nước xâm xấp, hầm lửa nhỏ tới rau củ mềm.
3. Nêm nếm vừa ăn.',
    2, 138, 10.0, 0.6, 25.2, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-thit-vit-quay-com', 'Thịt vịt quay cơm', 'Món giàu năng lượng, phù hợp người cần tăng cân.',
    '1. Ướp thịt vịt với gia vị, quay/nướng chín vàng da.
2. Chặt miếng vừa ăn.
3. Dọn cùng cơm trắng.',
    2, 467, 21.7, 28.7, 28.0, 'gain_weight', datetime('now'), datetime('now')),

  ('recipe-canh-chua-ca', 'Canh chua cá', 'Canh chua thanh mát, dễ ăn.',
    '1. Phi thơm hành tây với chút dầu.
2. Cho cà chua vào xào mềm.
3. Đổ nước, đun sôi rồi thả cá vào nấu chín, nêm chua ngọt vừa ăn.',
    2, 124, 18.7, 3.1, 4.3, 'maintain', datetime('now'), datetime('now')),

  ('recipe-bun-dau-phu-sot-ca', 'Bún đậu phụ sốt cà', 'Món chay nhẹ bụng, đủ tinh bột và đạm thực vật.',
    '1. Chiên sơ đậu phụ cho vàng nhẹ.
2. Nấu sốt cà chua sánh lại.
3. Trụng bún, trộn cùng đậu phụ và sốt cà.',
    2, 175, 8.3, 3.9, 28.4, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-yen-mach-sua-chua-hat', 'Yến mạch trộn sữa chua hạt', 'Bữa phụ lành mạnh, no lâu.',
    '1. Cho yến mạch vào sữa chua, trộn đều.
2. Để khoảng 5 phút cho yến mạch nở mềm.
3. Rắc hạnh nhân lên trên trước khi dùng.',
    1, 334, 15.2, 15.2, 36.9, 'lose_weight', datetime('now'), datetime('now')),

  ('recipe-com-thit-heo-nuong-sa', 'Cơm thịt heo nướng sả', 'Cơm trưa quen thuộc, đủ chất.',
    '1. Ướp thịt heo với sả băm, tỏi, nước mắm.
2. Nướng chín thơm.
3. Luộc/hấp đậu que.
4. Dọn thịt nướng, đậu que cùng cơm trắng.',
    2, 334, 27.6, 10.4, 31.5, 'maintain', datetime('now'), datetime('now')),

  ('recipe-trung-hap-pho-mai', 'Trứng hấp phô mai', 'Món giàu đạm, mềm mịn, dễ ăn.',
    '1. Đánh tan trứng với sữa tươi.
2. Rắc phô mai bào vào trộn đều.
3. Hấp cách thủy lửa nhỏ tới chín mềm.',
    1, 461, 35.1, 33.6, 5.0, 'gain_muscle', datetime('now'), datetime('now'))
ON CONFLICT (id) DO NOTHING;

INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES
  ('ing-cbdtb-1', 'recipe-canh-bi-do-thit-bam', 'food-bi-do', 'Bí đỏ', 200, 'g', 0),
  ('ing-cbdtb-2', 'recipe-canh-bi-do-thit-bam', 'food-thit-heo', 'Thịt heo bằm', 100, 'g', 1),

  ('ing-sng-1', 'recipe-sup-nam-ga', 'food-nam', 'Nấm', 150, 'g', 0),
  ('ing-sng-2', 'recipe-sup-nam-ga', 'food-thit-ga', 'Ức gà', 150, 'g', 1),

  ('ing-cbxt-1', 'recipe-cai-bo-xoi-xao-toi', 'food-cai-bo-xoi', 'Cải bó xôi', 200, 'g', 0),
  ('ing-cbxt-2', 'recipe-cai-bo-xoi-xao-toi', 'food-dau-oliu', 'Dầu ô liu', 10, 'g', 1),

  ('ing-sct-1', 'recipe-salad-ca-trung', 'food-ca', 'Cá', 200, 'g', 0),
  ('ing-sct-2', 'recipe-salad-ca-trung', 'food-trung-ga', 'Trứng gà', 100, 'g', 1),
  ('ing-sct-3', 'recipe-salad-ca-trung', 'food-cai-bo-xoi', 'Cải bó xôi', 100, 'g', 2),
  ('ing-sct-4', 'recipe-salad-ca-trung', 'food-dau-oliu', 'Dầu ô liu', 10, 'g', 3),

  ('ing-ctcdq-1', 'recipe-com-chien-trung-dau-que', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 0),
  ('ing-ctcdq-2', 'recipe-com-chien-trung-dau-que', 'food-trung-ga', 'Trứng gà', 100, 'g', 1),
  ('ing-ctcdq-3', 'recipe-com-chien-trung-dau-que', 'food-dau-que', 'Đậu que', 100, 'g', 2),

  ('ing-mxht-1', 'recipe-muc-xao-hanh-tay', 'food-muc', 'Mực', 200, 'g', 0),
  ('ing-mxht-2', 'recipe-muc-xao-hanh-tay', 'food-hanh-tay', 'Hành tây', 100, 'g', 1),
  ('ing-mxht-3', 'recipe-muc-xao-hanh-tay', 'food-dau-oliu', 'Dầu ô liu', 10, 'g', 2),

  ('ing-nltl-1', 'recipe-ngo-luoc-trung-luoc', 'food-ngo', 'Ngô', 150, 'g', 0),
  ('ing-nltl-2', 'recipe-ngo-luoc-trung-luoc', 'food-trung-ga', 'Trứng gà', 100, 'g', 1),

  ('ing-stpmc-1', 'recipe-sinh-to-pho-mai-chuoi', 'food-pho-mai', 'Phô mai', 50, 'g', 0),
  ('ing-stpmc-2', 'recipe-sinh-to-pho-mai-chuoi', 'food-chuoi', 'Chuối', 150, 'g', 1),
  ('ing-stpmc-3', 'recipe-sinh-to-pho-mai-chuoi', 'food-sua-tuoi', 'Sữa tươi', 200, 'ml', 2),

  ('ing-dlhrc-1', 'recipe-dau-lang-ham-rau-cu', 'food-dau-lang', 'Đậu lăng (đã nấu)', 200, 'g', 0),
  ('ing-dlhrc-2', 'recipe-dau-lang-ham-rau-cu', 'food-bi-do', 'Bí đỏ', 100, 'g', 1),
  ('ing-dlhrc-3', 'recipe-dau-lang-ham-rau-cu', 'food-ca-chua', 'Cà chua', 100, 'g', 2),

  ('ing-tvqc-1', 'recipe-thit-vit-quay-com', 'food-thit-vit', 'Thịt vịt', 200, 'g', 0),
  ('ing-tvqc-2', 'recipe-thit-vit-quay-com', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 1),

  ('ing-ccc-1', 'recipe-canh-chua-ca', 'food-ca', 'Cá', 200, 'g', 0),
  ('ing-ccc-2', 'recipe-canh-chua-ca', 'food-ca-chua', 'Cà chua', 100, 'g', 1),
  ('ing-ccc-3', 'recipe-canh-chua-ca', 'food-hanh-tay', 'Hành tây', 50, 'g', 2),

  ('ing-bdpsc-1', 'recipe-bun-dau-phu-sot-ca', 'food-dau-phu', 'Đậu phụ', 150, 'g', 0),
  ('ing-bdpsc-2', 'recipe-bun-dau-phu-sot-ca', 'food-bun-pho', 'Bún', 200, 'g', 1),
  ('ing-bdpsc-3', 'recipe-bun-dau-phu-sot-ca', 'food-ca-chua', 'Cà chua', 100, 'g', 2),

  ('ing-ymsch-1', 'recipe-yen-mach-sua-chua-hat', 'food-yen-mach', 'Yến mạch', 40, 'g', 0),
  ('ing-ymsch-2', 'recipe-yen-mach-sua-chua-hat', 'food-sua-chua', 'Sữa chua không đường', 150, 'g', 1),
  ('ing-ymsch-3', 'recipe-yen-mach-sua-chua-hat', 'food-hanh-nhan', 'Hạnh nhân', 15, 'g', 2),

  ('ing-cthns-1', 'recipe-com-thit-heo-nuong-sa', 'food-thit-heo', 'Thịt heo', 200, 'g', 0),
  ('ing-cthns-2', 'recipe-com-thit-heo-nuong-sa', 'food-gao-trang', 'Gạo trắng (đã nấu)', 200, 'g', 1),
  ('ing-cthns-3', 'recipe-com-thit-heo-nuong-sa', 'food-dau-que', 'Đậu que', 100, 'g', 2),

  ('ing-thpm-1', 'recipe-trung-hap-pho-mai', 'food-trung-ga', 'Trứng gà', 200, 'g', 0),
  ('ing-thpm-2', 'recipe-trung-hap-pho-mai', 'food-pho-mai', 'Phô mai', 30, 'g', 1),
  ('ing-thpm-3', 'recipe-trung-hap-pho-mai', 'food-sua-tuoi', 'Sữa tươi', 50, 'ml', 2)
ON CONFLICT (id) DO NOTHING;
