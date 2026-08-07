-- Migration: 0063_meal_instructions_v2
-- Target: Cloudflare D1 (SQLite)
-- Fixes two bugs the user caught in the first instruction rewrite:
-- (1) steps referenced hành/tỏi/đường/etc. that weren't in the recipe's
-- own ingredient list — adds those as real ingredient rows (skipped if
-- already present under the same name); (2) prep and cooking steps were
-- one undifferentiated numbered list — now split into explicit
-- "Sơ chế:" / "Thực hiện:" sections. Self-authored/templated from our
-- own data, not sourced from any external site.
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Chuẩn bị Trứng gà, Dưa leo, cắt lát vừa ăn.

Thực hiện:
1. Chế biến phần nhân: chiên/áp chảo Trứng gà tới chín, hoặc phết trực tiếp nếu là pate/bơ.
2. Xẻ dọc ổ Bánh mì, không cắt đứt hẳn hai bên.
3. Kẹp phần nhân đã chuẩn bị vào giữa bánh.
4. Thêm rau/dưa leo, tương ớt hoặc đồ chua tuỳ thích.
5. Dùng ngay khi bánh còn giòn.', updated_at = datetime('now') WHERE id = 'recipe-banh-mi-trung-op-la';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Đậu phụ: ướp cùng gia vị cơ bản trong khoảng 15 phút.

Thực hiện:
1. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
2. Cho Đậu phụ vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
3. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
4. Xếp Bún và Cà chua lên trên.
5. Chan nước dùng nóng vào tô, rắc hành lá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe-bun-dau-phu-sot-ca';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt heo, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Thịt heo tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Bún.', updated_at = datetime('now') WHERE id = 'recipe-bun-thit-heo-nuong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Cá đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Rau muống vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe-ca-kho-rau-muong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cải bó xôi và Dầu ô liu, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Cải bó xôi với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Cải bó xôi vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Dầu ô liu vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Cải bó xôi trở lại chảo, đảo đều cùng Dầu ô liu, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe-cai-bo-xoi-xao-toi';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Bí đỏ và Thịt heo bằm: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Thịt heo bằm vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe-canh-bi-do-thit-bam';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá và Cà chua: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Cà chua và Hành tây vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe-canh-chua-ca';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Yến mạch: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.

Thực hiện:
1. Cho Yến mạch cùng Chuối vào máy xay sinh tố.
2. Xay nhuyễn mịn trong khoảng 30-60 giây.
3. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
4. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe-chao-yen-mach-chuoi';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Yến mạch: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.

Thực hiện:
1. Cho Yến mạch cùng Trứng gà vào máy xay sinh tố.
2. Xay nhuyễn mịn trong khoảng 30-60 giây.
3. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
4. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe-chao-yen-mach-trung-bo';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Gạo trắng (đã nấu), để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Gạo trắng (đã nấu) tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Trứng gà.', updated_at = datetime('now') WHERE id = 'recipe-com-chien-trung-dau-que';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Ức gà và Gạo trắng (đã nấu), để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Ức gà theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Gạo trắng (đã nấu), Rau muống, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe-com-ga-xe';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt bò và Bông cải xanh, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Bông cải xanh và Gạo trắng (đã nấu) vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Thịt bò trở lại chảo, đảo đều cùng Bông cải xanh, Gạo trắng (đã nấu), nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe-com-thit-bo-xao-bong-cai';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt heo, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Thịt heo tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Gạo trắng (đã nấu).', updated_at = datetime('now') WHERE id = 'recipe-com-thit-heo-nuong-sa';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Đậu lăng (đã nấu) và Bí đỏ, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Đậu lăng (đã nấu) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Bí đỏ, Cà chua, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe-dau-lang-ham-rau-cu';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Đậu phụ và Cà chua, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Đậu phụ theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Cà chua, Dầu ô liu, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe-dau-phu-sot-ca-chua';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Mực và Hành tây, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Mực với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Mực vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Hành tây và Dầu ô liu vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Mực trở lại chảo, đảo đều cùng Hành tây, Dầu ô liu, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe-muc-xao-hanh-tay';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Ngô, để ráo nước; Trứng gà cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).

Thực hiện:
1. Đun sôi nước trong nồi hấp hoặc nồi luộc.
2. Cho Ngô cùng Trứng gà vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
3. Vớt ra, để ráo trong vài phút.
4. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe-ngo-luoc-trung-luoc';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Trứng gà, Cải bó xôi, Dầu ô liu, để ráo.
2. Thái/bào Trứng gà thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Cá tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe-salad-ca-trung';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Quả bơ, Cà chua, Dưa leo, để ráo.
2. Thái/bào Quả bơ thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Ức gà tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe-salad-uc-ga-bo';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Quả bơ: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.

Thực hiện:
1. Cho Quả bơ cùng Bơ đậu phộng vào máy xay sinh tố.
2. Xay nhuyễn mịn trong khoảng 30-60 giây.
3. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
4. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe-sinh-to-bo-dau-phong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Phô mai: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.

Thực hiện:
1. Cho Phô mai cùng Chuối vào máy xay sinh tố.
2. Xay nhuyễn mịn trong khoảng 30-60 giây.
3. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
4. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe-sinh-to-pho-mai-chuoi';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Sữa chua không đường và Hạnh nhân, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Sữa chua không đường theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Hạnh nhân, Chuối, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe-sua-chua-hanh-nhan-chuoi';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Nấm và Ức gà: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Ức gà vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe-sup-nam-ga';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt heo: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Thịt heo đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Trứng gà vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe-thit-heo-kho-trung';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt vịt, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Thịt vịt tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Gạo trắng (đã nấu).', updated_at = datetime('now') WHERE id = 'recipe-thit-vit-quay-com';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Tôm: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Tôm đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Khoai lang vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe-tom-hap-khoai-lang';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Trứng gà, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Trứng gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Cà chua.', updated_at = datetime('now') WHERE id = 'recipe-trung-chien-rau-cu';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Trứng gà, để ráo nước; Phô mai cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).

Thực hiện:
1. Đun sôi nước trong nồi hấp hoặc nồi luộc.
2. Cho Trứng gà cùng Phô mai vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
3. Vớt ra, để ráo trong vài phút.
4. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe-trung-hap-pho-mai';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Ức gà, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Ức gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Dưa leo.', updated_at = datetime('now') WHERE id = 'recipe-uc-ga-ap-chao-salad';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Sữa chua không đường, Hạnh nhân, để ráo.
2. Thái/bào Sữa chua không đường thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Yến mạch tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe-yen-mach-sua-chua-hat';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Chuẩn bị Bơ đậu phộng, Chuối, cắt lát vừa ăn.

Thực hiện:
1. Chế biến phần nhân: chiên/áp chảo Bơ đậu phộng tới chín, hoặc phết trực tiếp nếu là pate/bơ.
2. Xẻ dọc ổ Bánh mì, không cắt đứt hẳn hai bên.
3. Kẹp phần nhân đã chuẩn bị vào giữa bánh.
4. Thêm rau/dưa leo, tương ớt hoặc đồ chua tuỳ thích.
5. Dùng ngay khi bánh còn giòn.', updated_at = datetime('now') WHERE id = 'recipe2-banh-mi-bo-dau-phong-chuoi';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt bò: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Thịt bò đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Khoai lang vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe2-bo-luc-lac-khoai-lang';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt bò và Đậu Hà Lan, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Đậu Hà Lan vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Thịt bò trở lại chảo, đảo đều cùng Đậu Hà Lan, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-bo-xao-dau-ha-lan';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt bò và Bún, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Bún và Dưa leo vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Thịt bò trở lại chảo, đảo đều cùng Bún, Dưa leo, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-bun-thit-bo-xao';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá, để ráo nước; Hành tây cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).

Thực hiện:
1. Đun sôi nước trong nồi hấp hoặc nồi luộc.
2. Cho Cá cùng Hành tây vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
3. Vớt ra, để ráo trong vài phút.
4. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe2-ca-hap-gung-hanh';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Cá đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Gạo trắng (đã nấu) vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe2-ca-kho-to';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Trứng gà, để ráo nước; Cà rốt cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).

Thực hiện:
1. Đun sôi nước trong nồi hấp hoặc nồi luộc.
2. Cho Trứng gà cùng Cà rốt vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
3. Vớt ra, để ráo trong vài phút.
4. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe2-ca-rot-luoc-trung';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Bắp cải và Tôm: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Tôm vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe2-canh-bap-cai-tom';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt heo bằm và Cà rốt: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Cà rốt và Khoai lang vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe2-canh-ca-rot-khoai-lang';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cải thìa và Thịt heo bằm: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Thịt heo bằm vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe2-canh-cai-thia-thit-bam';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt heo bằm và Su hào: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Su hào vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe2-canh-su-hao-xuong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Yến mạch: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.

Thực hiện:
1. Cho Yến mạch cùng Bí đỏ vào máy xay sinh tố.
2. Xay nhuyễn mịn trong khoảng 30-60 giây.
3. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
4. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe2-chao-yen-mach-bi-do';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt bò và Hành tây, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Hành tây và Gạo trắng (đã nấu) vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Thịt bò trở lại chảo, đảo đều cùng Hành tây, Gạo trắng (đã nấu), nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-com-bo-xao-hanh-tay';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt vịt và Gạo trắng (đã nấu), để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Thịt vịt theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Gạo trắng (đã nấu), Cà rốt, Đậu que, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe2-com-thit-vit-rau-cu';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Đậu phụ và Nấm, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Đậu phụ với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Đậu phụ vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Nấm và Dầu ô liu vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Đậu phụ trở lại chảo, đảo đều cùng Nấm, Dầu ô liu, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-dau-hu-xao-nam';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Đậu lăng (đã nấu) và Cà rốt, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Đậu lăng (đã nấu) với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Đậu lăng (đã nấu) vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Cà rốt và Su hào vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Đậu lăng (đã nấu) trở lại chảo, đảo đều cùng Cà rốt, Su hào, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-dau-lang-xao-rau-cu';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Đậu phụ, để ráo nước; Nấm cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).

Thực hiện:
1. Đun sôi nước trong nồi hấp hoặc nồi luộc.
2. Cho Đậu phụ cùng Nấm vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
3. Vớt ra, để ráo trong vài phút.
4. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe2-dau-phu-hap-nam';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Ức gà, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Ức gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Nấm.', updated_at = datetime('now') WHERE id = 'recipe2-ga-ap-chao-nam';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt gà: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Thịt gà đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Gạo trắng (đã nấu) vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe2-ga-kho-gung';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Ức gà, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Ức gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Mật ong.', updated_at = datetime('now') WHERE id = 'recipe2-ga-nuong-mat-ong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Ức gà và Su hào, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Ức gà với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Ức gà vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Su hào và Dầu ô liu vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Ức gà trở lại chảo, đảo đều cùng Su hào, Dầu ô liu, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-ga-xao-su-hao';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Mì trứng (đã luộc) và Thịt bò, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Mì trứng (đã luộc) với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Mì trứng (đã luộc) vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Thịt bò và Hành tây vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Mì trứng (đã luộc) trở lại chảo, đảo đều cùng Thịt bò, Hành tây, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-mi-trung-xao-bo';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Mì trứng (đã luộc) và Cà rốt, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Mì trứng (đã luộc) với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Mì trứng (đã luộc) vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Cà rốt và Bắp cải vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Mì trứng (đã luộc) trở lại chảo, đảo đều cùng Cà rốt, Bắp cải, Đậu que, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-mi-trung-xao-rau-cu';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Mực, để ráo nước; Hành tây cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).

Thực hiện:
1. Đun sôi nước trong nồi hấp hoặc nồi luộc.
2. Cho Mực cùng Hành tây vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
3. Vớt ra, để ráo trong vài phút.
4. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe2-muc-hap-hanh-gung';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Tôm, Dầu ô liu, để ráo.
2. Thái/bào Tôm thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Bắp cải tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe2-salad-bap-cai-tom';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Hạnh nhân, để ráo.
2. Thái/bào Hạnh nhân thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Cam tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe2-salad-cam-hanh-nhan';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Phô mai, để ráo.
2. Thái/bào Phô mai thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Dưa hấu tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe2-salad-dua-hau-pho-mai';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Quả bơ, Cà chua, Dầu ô liu, để ráo.
2. Thái/bào Quả bơ thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Tôm tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe2-salad-tom-bo';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Xoài, để ráo.
2. Thái/bào Xoài thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Tôm tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe2-salad-xoai-tom';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Quả bơ: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.

Thực hiện:
1. Cho Quả bơ cùng Sữa tươi vào máy xay sinh tố.
2. Xay nhuyễn mịn trong khoảng 30-60 giây.
3. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
4. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe2-sinh-to-bo-mat-ong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Cam: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.

Thực hiện:
1. Cho Cam cùng Cà rốt vào máy xay sinh tố.
2. Xay nhuyễn mịn trong khoảng 30-60 giây.
3. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
4. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe2-sinh-to-cam-ca-rot';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Chuối: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.

Thực hiện:
1. Cho Chuối cùng Hạt điều vào máy xay sinh tố.
2. Xay nhuyễn mịn trong khoảng 30-60 giây.
3. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
4. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe2-sinh-to-chuoi-hat-dieu';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Xoài: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.

Thực hiện:
1. Cho Xoài cùng Sữa chua không đường vào máy xay sinh tố.
2. Xay nhuyễn mịn trong khoảng 30-60 giây.
3. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
4. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe2-sinh-to-xoai';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Ức gà và Ngô: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Ngô vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe2-sup-ga-ngo';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt heo, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Thịt heo tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Mật ong.', updated_at = datetime('now') WHERE id = 'recipe2-thit-heo-nuong-mat-ong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt heo và Cà rốt, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt heo với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Thịt heo vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Cà rốt vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Thịt heo trở lại chảo, đảo đều cùng Cà rốt, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-thit-heo-xao-ca-rot';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Tôm và Bắp cải, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Tôm với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Tôm vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Bắp cải và Dầu ô liu vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Tôm trở lại chảo, đảo đều cùng Bắp cải, Dầu ô liu, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-tom-xao-bap-cai';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Trứng gà, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Trứng gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Cải thìa.', updated_at = datetime('now') WHERE id = 'recipe2-trung-chien-cai-thia';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Trứng gà, để ráo nước; Tôm cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).

Thực hiện:
1. Đun sôi nước trong nồi hấp hoặc nồi luộc.
2. Cho Trứng gà cùng Tôm vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
3. Vớt ra, để ráo trong vài phút.
4. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe2-trung-hap-tom';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Yến mạch và Sữa tươi, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Yến mạch theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Sữa tươi, Mật ong, Hạt điều, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe2-yen-mach-mat-ong-hat-dieu';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Bột gạo (quy đổi) và Chả lụa, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Bột gạo (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Chả lụa, Giá đỗ, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe3-banh-cuon-cha-lua';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Bột gạo (quy đổi) và Tôm, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Bột gạo (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Tôm, Thịt ba chỉ, Giá đỗ, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe3-banh-xeo-tom-thit';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt bò: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Thịt bò đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Cà rốt vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe3-bo-kho';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Bún: ướp cùng gia vị cơ bản trong khoảng 15 phút.

Thực hiện:
1. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
2. Cho Bún vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
3. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
4. Xếp Thịt bò và Chả lụa lên trên.
5. Chan nước dùng nóng vào tô, rắc hành lá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe3-bun-bo-hue';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Bún: ướp cùng gia vị cơ bản trong khoảng 15 phút.

Thực hiện:
1. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
2. Cho Bún vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
3. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
4. Xếp Thịt ba chỉ và Cà rốt lên trên.
5. Chan nước dùng nóng vào tô, rắc hành lá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe3-bun-cha-ha-noi';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá hồi, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Cá hồi tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Dầu ô liu.', updated_at = datetime('now') WHERE id = 'recipe3-ca-hoi-ap-chao-sot-bo-toi';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá thu: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Cá thu đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Gạo trắng (đã nấu) vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe3-ca-thu-kho-thom';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá lóc và Cà chua: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Cà chua và Giá đỗ vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe3-canh-chua-ca-loc';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Khổ qua và Thịt heo bằm: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Thịt heo bằm vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe3-canh-kho-qua-nhoi-thit';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Bánh tráng và Thịt heo bằm, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Bánh tráng theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Thịt heo bằm, Giá đỗ, Miến, Dầu chiên, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe3-cha-gio';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Đậu xanh và Nước cốt dừa, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Đậu xanh theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Nước cốt dừa, Mật ong, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe3-che-dau-xanh';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cơm tấm và Sườn heo, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Cơm tấm theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Sườn heo, Chả lụa, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe3-com-tam-suon-bi-cha';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Tôm, Thịt ba chỉ, Bún, để ráo.
2. Thái/bào Tôm thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Bánh tráng tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe3-goi-cuon-tom-thit';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Tôm khô, Đậu phộng, để ráo.
2. Thái/bào Tôm khô thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Đu đủ xanh tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe3-goi-du-du-tom-kho';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Hủ tiếu: ướp cùng gia vị cơ bản trong khoảng 15 phút.

Thực hiện:
1. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
2. Cho Hủ tiếu vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
3. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
4. Xếp Tôm và Thịt heo lên trên.
5. Chan nước dùng nóng vào tô, rắc hành lá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe3-hu-tieu-nam-vang';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Mì trứng (đã luộc): ướp cùng gia vị cơ bản trong khoảng 15 phút.

Thực hiện:
1. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
2. Cho Mì trứng (đã luộc) vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
3. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
4. Xếp Tôm và Thịt heo lên trên.
5. Chan nước dùng nóng vào tô, rắc hành lá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe3-mi-quang';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Nghêu, để ráo nước; Sả cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).

Thực hiện:
1. Đun sôi nước trong nồi hấp hoặc nồi luộc.
2. Cho Nghêu cùng Sả vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
3. Vớt ra, để ráo trong vài phút.
4. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe3-ngheu-hap-sa';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Bánh phở: ướp cùng gia vị cơ bản trong khoảng 15 phút.

Thực hiện:
1. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
2. Cho Bánh phở vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
3. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
4. Xếp Thịt bò và Hành tây lên trên.
5. Chan nước dùng nóng vào tô, rắc hành lá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe3-pho-bo';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt cua và Trứng gà: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Trứng gà và Ngô vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe3-sup-cua';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt ba chỉ: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Thịt ba chỉ đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Trứng gà vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe3-thit-kho-tau';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Bột gạo (quy đổi) và Tôm khô, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Bột gạo (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Tôm khô, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-banh-beo';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Bột gạo (quy đổi) và Thịt heo bằm, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Bột gạo (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Thịt heo bằm, Nấm, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-banh-cuon-thit-nam';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Bột gạo (quy đổi) và Tôm, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Bột gạo (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Tôm, Nước cốt dừa, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-banh-khot';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Bánh tráng, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Bánh tráng tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Trứng gà.', updated_at = datetime('now') WHERE id = 'recipe4-banh-trang-nuong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Tôm khô, Đậu phộng, để ráo.
2. Thái/bào Tôm khô thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Bánh tráng tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe4-banh-trang-tron';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Bún: ướp cùng gia vị cơ bản trong khoảng 15 phút.

Thực hiện:
1. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
2. Cho Bún vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
3. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
4. Xếp Thịt cua và Cà chua lên trên.
5. Chan nước dùng nóng vào tô, rắc hành lá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe4-bun-rieu-cua';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá basa: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Cá basa đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Gạo trắng (đã nấu) vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe4-ca-basa-kho-to';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Sườn heo và Măng (quy đổi tạm): cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Măng (quy đổi tạm) vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe4-canh-mang-suon';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá và Lá lốt, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Cá theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Lá lốt, Bún, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-cha-ca-la-vong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Ngô (bắp) và Nước cốt dừa, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Ngô (bắp) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Nước cốt dừa, Đường/mật ong, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-che-bap';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Bột nếp (quy đổi) và Đậu xanh, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Bột nếp (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Đậu xanh, Nước cốt dừa, Đường/mật ong, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-che-troi-nuoc';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt gà, để ráo nước.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).

Thực hiện:
1. Đun sôi nước trong nồi hấp hoặc nồi luộc.
2. Cho Thịt gà vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
3. Vớt ra, để ráo trong vài phút.
4. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe4-ga-hap-la-chanh';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Bắp cải, để ráo.
2. Thái/bào Bắp cải thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Ức gà tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe4-goi-ga-la-chanh';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Tôm và Mực, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Tôm theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Mực, Nghêu, Cà chua, Sả, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-lau-thai-hai-san';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Mì trứng (đã luộc) và Tôm, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Mì trứng (đã luộc) với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Mì trứng (đã luộc) vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Tôm và Mực vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Mì trứng (đã luộc) trở lại chảo, đảo đều cùng Tôm, Mực, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe4-mi-xao-hai-san';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt heo bằm, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Thịt heo bằm tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Bánh tráng.', updated_at = datetime('now') WHERE id = 'recipe4-nem-nuong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Ốc và Sả, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Ốc với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Ốc vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Sả vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Ốc trở lại chảo, đảo đều cùng Sả, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe4-oc-xao-sa-ot';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Dưa leo, Vừng (mè), Dầu ô liu, để ráo.
2. Thái/bào Dưa leo thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Đậu phụ tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe4-salad-vung-dau-phu';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt dê, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Thịt dê tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Lá lốt.', updated_at = datetime('now') WHERE id = 'recipe4-thit-de-nuong-la-lot';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Tôm và Me chua, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Tôm theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Me chua, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-tom-rang-me';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Gạo nếp (đã nấu) và Thịt gà, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Gạo nếp (đã nấu) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Thịt gà, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-xoi-ga';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Chuẩn bị Pate hộp, Xúc xích, cắt lát vừa ăn.

Thực hiện:
1. Chế biến phần nhân: chiên/áp chảo Pate hộp tới chín, hoặc phết trực tiếp nếu là pate/bơ.
2. Xẻ dọc ổ Bánh mì, không cắt đứt hẳn hai bên.
3. Kẹp phần nhân đã chuẩn bị vào giữa bánh.
4. Thêm rau/dưa leo, tương ớt hoặc đồ chua tuỳ thích.
5. Dùng ngay khi bánh còn giòn.', updated_at = datetime('now') WHERE id = 'recipe5-banh-mi-pate-xuc-xich';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Chuẩn bị Thịt hộp, Dưa leo, cắt lát vừa ăn.

Thực hiện:
1. Chế biến phần nhân: chiên/áp chảo Thịt hộp tới chín, hoặc phết trực tiếp nếu là pate/bơ.
2. Xẻ dọc ổ Bánh mì, không cắt đứt hẳn hai bên.
3. Kẹp phần nhân đã chuẩn bị vào giữa bánh.
4. Thêm rau/dưa leo, tương ớt hoặc đồ chua tuỳ thích.
5. Dùng ngay khi bánh còn giòn.', updated_at = datetime('now') WHERE id = 'recipe5-banh-mi-thit-hop';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá hồi và Tương ớt, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Cá hồi theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Tương ớt, Mật ong, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-ca-hoi-sot-tuong-ot';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá hộp sốt cà: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Cá hộp sốt cà đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Gạo trắng (đã nấu) vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe5-ca-hop-sot-ca-kho';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá ngừ hộp, Dưa leo, Cà rốt, để ráo.
2. Thái/bào Cá ngừ hộp thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Bún tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-ca-ngu-hop-tron-bun';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cá hộp sốt cà và Cải thìa: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Cải thìa vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe5-canh-ca-hop-rau-cai';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Rong biển (quy đổi) và Đậu phụ: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Đậu phụ và Nước tương vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe5-canh-rong-bien-dau-hu';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cà chua và Trứng gà: cắt/thái miếng vừa ăn.
2. Băm nhỏ hành tím, cắt nhỏ hành lá.

Thực hiện:
1. Phi thơm hành tím với chút dầu ăn, cho nguyên liệu chính vào xào săn khoảng 2 phút.
2. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
3. Hạ lửa vừa, cho Trứng gà và Mì ăn liền vào, nấu khoảng 8-10 phút tới chín mềm.
4. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
5. Tắt bếp, múc ra tô, rắc hành lá lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe5-canh-trung-ca-chua-mi';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Cơm nguội, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Cơm nguội tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Xúc xích.', updated_at = datetime('now') WHERE id = 'recipe5-com-chien-xuc-xich';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Đậu phụ và Nước tương, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Đậu phụ theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Nước tương, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-dau-hu-sot-nuoc-tuong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Đậu phộng, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Đậu phộng theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Nêm nếm lại cho vừa khẩu vị.
3. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-dau-phong-rang-muoi';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Đậu que và Thịt hộp, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Đậu que với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Đậu que vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Thịt hộp vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Đậu que trở lại chảo, đảo đều cùng Thịt hộp, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-dau-que-xao-thit-hop';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt gà: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Thịt gà đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Nước mắm vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe5-ga-kho-nuoc-mam';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt gà và Sả, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt gà với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Thịt gà vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Sả và Nước mắm vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Thịt gà trở lại chảo, đảo đều cùng Sả, Nước mắm, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-ga-xao-xa-ot-nuoc-mam';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Giò thủ và Dưa cải chua, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Giò thủ theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Dưa cải chua, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-gio-thu-dua-chua';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt bò và Kim chi, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Kim chi vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Thịt bò trở lại chảo, đảo đều cùng Kim chi, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-kim-chi-xao-thit-bo';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Mì ăn liền và Thịt bò, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Mì ăn liền với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Mì ăn liền vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Thịt bò và Cải bó xôi vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Mì ăn liền trở lại chảo, đảo đều cùng Thịt bò, Cải bó xôi, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-mi-an-lien-xao-bo';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Sơ chế Mì ăn liền: ướp cùng gia vị cơ bản trong khoảng 15 phút.

Thực hiện:
1. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
2. Cho Mì ăn liền vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
3. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
4. Xếp Trứng gà lên trên.
5. Chan nước dùng nóng vào tô, rắc hành lá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe5-mi-tom-trung';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Xúc xích, Trứng gà, để ráo.
2. Thái/bào Xúc xích thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Mì ăn liền tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-mi-tron-xuc-xich-trung';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Dưa leo, Cà chua, Dầu ô liu, để ráo.
2. Thái/bào Dưa leo thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Cá ngừ hộp tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-salad-ca-ngu-hop';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Kim chi, để ráo.
2. Thái/bào Kim chi thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Đậu phụ tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-salad-dau-hu-kim-chi';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Phô mai, Dưa leo, để ráo.
2. Thái/bào Phô mai thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Trứng gà tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-salad-trung-pho-mai';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Giò thủ, Dưa leo, Dầu ô liu, để ráo.
2. Thái/bào Giò thủ thành lát hoặc sợi mỏng vừa ăn.
3. Băm nhỏ tỏi, ớt.

Thực hiện:
1. Luộc hoặc áp chảo Ức gà tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
2. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
3. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
4. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-salad-uc-ga-gio-thu';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt bò và Hành tây, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Hành tây và Nước tương vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Thịt bò trở lại chảo, đảo đều cùng Hành tây, Nước tương, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-thit-bo-kho-tuong-den';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt bò và Nước tương, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Thịt bò theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Nước tương, Gạo trắng (đã nấu), đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-thit-bo-sot-tuong-den-com';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt heo: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Thịt heo đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Dưa cải chua vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe5-thit-heo-kho-dua-chua';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Thịt hộp và Dưa cải chua, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt hộp với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Băm nhỏ hành tím và tỏi.

Thực hiện:
1. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành tím và tỏi băm.
2. Cho Thịt hộp vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
3. Cho Dưa cải chua vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
4. Cho Thịt hộp trở lại chảo, đảo đều cùng Dưa cải chua, nêm nếm lại cho vừa ăn rồi tắt bếp.
5. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-thit-hop-xao-dua-chua';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Tôm và Tương ớt, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.

Thực hiện:
1. Chế biến Tôm theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
2. Kết hợp cùng Tương ớt, đảo/trộn đều.
3. Nêm nếm lại cho vừa khẩu vị.
4. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-tom-sot-tuong-ot';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Trứng gà, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Băm nhỏ tỏi.
3. Ướp cùng muối, tiêu, tỏi băm trong khoảng 20-30 phút.

Thực hiện:
1. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
2. Chiên/nướng Trứng gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
3. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
4. Bày ra đĩa, dùng kèm Nước tương.', updated_at = datetime('now') WHERE id = 'recipe5-trung-chien-nuoc-tuong';
UPDATE meal_recipes SET instructions = 'Sơ chế:
1. Rửa sạch Xúc xích: cắt miếng vừa ăn, để ráo.
2. Băm nhỏ hành tím, tỏi.
3. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.

Thực hiện:
1. Bắc nồi lên bếp, cho Xúc xích đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
2. Cho Khoai lang vào cùng, đảo đều.
3. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
4. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
5. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe5-xuc-xich-nuong-khoai-lang';

INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-bun-dau-phu-sot-ca-food-hanh-la', 'recipe-bun-dau-phu-sot-ca', 'food-hanh-la', 'Hành lá', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-bun-thit-heo-nuong-food-toi', 'recipe-bun-thit-heo-nuong', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-ca-kho-rau-muong-food-hanh-tim', 'recipe-ca-kho-rau-muong', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-ca-kho-rau-muong-food-toi', 'recipe-ca-kho-rau-muong', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-ca-kho-rau-muong-food-duong', 'recipe-ca-kho-rau-muong', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-ca-kho-rau-muong-food-nuoc-mam', 'recipe-ca-kho-rau-muong', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-cai-bo-xoi-xao-toi-food-hanh-tim', 'recipe-cai-bo-xoi-xao-toi', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-cai-bo-xoi-xao-toi-food-toi', 'recipe-cai-bo-xoi-xao-toi', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-canh-bi-do-thit-bam-food-hanh-tim', 'recipe-canh-bi-do-thit-bam', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-canh-bi-do-thit-bam-food-hanh-la', 'recipe-canh-bi-do-thit-bam', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-canh-bi-do-thit-bam-food-nuoc-mam', 'recipe-canh-bi-do-thit-bam', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-canh-chua-ca-food-hanh-tim', 'recipe-canh-chua-ca', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-canh-chua-ca-food-hanh-la', 'recipe-canh-chua-ca', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-canh-chua-ca-food-nuoc-mam', 'recipe-canh-chua-ca', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-com-chien-trung-dau-que-food-toi', 'recipe-com-chien-trung-dau-que', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-com-thit-bo-xao-bong-cai-food-hanh-tim', 'recipe-com-thit-bo-xao-bong-cai', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-com-thit-bo-xao-bong-cai-food-toi', 'recipe-com-thit-bo-xao-bong-cai', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-com-thit-heo-nuong-sa-food-toi', 'recipe-com-thit-heo-nuong-sa', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-muc-xao-hanh-tay-food-hanh-tim', 'recipe-muc-xao-hanh-tay', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-muc-xao-hanh-tay-food-toi', 'recipe-muc-xao-hanh-tay', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-salad-ca-trung-food-toi', 'recipe-salad-ca-trung', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-salad-ca-trung-food-ot', 'recipe-salad-ca-trung', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-salad-ca-trung-food-chanh', 'recipe-salad-ca-trung', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-salad-ca-trung-food-duong', 'recipe-salad-ca-trung', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-salad-ca-trung-food-nuoc-mam', 'recipe-salad-ca-trung', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-salad-uc-ga-bo-food-toi', 'recipe-salad-uc-ga-bo', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-salad-uc-ga-bo-food-ot', 'recipe-salad-uc-ga-bo', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-salad-uc-ga-bo-food-chanh', 'recipe-salad-uc-ga-bo', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-salad-uc-ga-bo-food-duong', 'recipe-salad-uc-ga-bo', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-salad-uc-ga-bo-food-nuoc-mam', 'recipe-salad-uc-ga-bo', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-sup-nam-ga-food-hanh-tim', 'recipe-sup-nam-ga', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-sup-nam-ga-food-hanh-la', 'recipe-sup-nam-ga', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-sup-nam-ga-food-nuoc-mam', 'recipe-sup-nam-ga', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-thit-heo-kho-trung-food-hanh-tim', 'recipe-thit-heo-kho-trung', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-thit-heo-kho-trung-food-toi', 'recipe-thit-heo-kho-trung', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-thit-heo-kho-trung-food-duong', 'recipe-thit-heo-kho-trung', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-thit-heo-kho-trung-food-nuoc-mam', 'recipe-thit-heo-kho-trung', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-thit-vit-quay-com-food-toi', 'recipe-thit-vit-quay-com', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-tom-hap-khoai-lang-food-hanh-tim', 'recipe-tom-hap-khoai-lang', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-tom-hap-khoai-lang-food-toi', 'recipe-tom-hap-khoai-lang', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-tom-hap-khoai-lang-food-duong', 'recipe-tom-hap-khoai-lang', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-tom-hap-khoai-lang-food-nuoc-mam', 'recipe-tom-hap-khoai-lang', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-trung-chien-rau-cu-food-toi', 'recipe-trung-chien-rau-cu', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-uc-ga-ap-chao-salad-food-toi', 'recipe-uc-ga-ap-chao-salad', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-yen-mach-sua-chua-hat-food-toi', 'recipe-yen-mach-sua-chua-hat', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-yen-mach-sua-chua-hat-food-ot', 'recipe-yen-mach-sua-chua-hat', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-yen-mach-sua-chua-hat-food-chanh', 'recipe-yen-mach-sua-chua-hat', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-yen-mach-sua-chua-hat-food-duong', 'recipe-yen-mach-sua-chua-hat', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe-yen-mach-sua-chua-hat-food-nuoc-mam', 'recipe-yen-mach-sua-chua-hat', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-bo-luc-lac-khoai-lang-food-hanh-tim', 'recipe2-bo-luc-lac-khoai-lang', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-bo-luc-lac-khoai-lang-food-toi', 'recipe2-bo-luc-lac-khoai-lang', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-bo-luc-lac-khoai-lang-food-duong', 'recipe2-bo-luc-lac-khoai-lang', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-bo-luc-lac-khoai-lang-food-nuoc-mam', 'recipe2-bo-luc-lac-khoai-lang', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-bo-xao-dau-ha-lan-food-hanh-tim', 'recipe2-bo-xao-dau-ha-lan', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-bo-xao-dau-ha-lan-food-toi', 'recipe2-bo-xao-dau-ha-lan', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-bun-thit-bo-xao-food-hanh-tim', 'recipe2-bun-thit-bo-xao', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-bun-thit-bo-xao-food-toi', 'recipe2-bun-thit-bo-xao', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ca-kho-to-food-hanh-tim', 'recipe2-ca-kho-to', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ca-kho-to-food-toi', 'recipe2-ca-kho-to', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ca-kho-to-food-duong', 'recipe2-ca-kho-to', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ca-kho-to-food-nuoc-mam', 'recipe2-ca-kho-to', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-bap-cai-tom-food-hanh-tim', 'recipe2-canh-bap-cai-tom', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-bap-cai-tom-food-hanh-la', 'recipe2-canh-bap-cai-tom', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-bap-cai-tom-food-nuoc-mam', 'recipe2-canh-bap-cai-tom', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-ca-rot-khoai-lang-food-hanh-tim', 'recipe2-canh-ca-rot-khoai-lang', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-ca-rot-khoai-lang-food-hanh-la', 'recipe2-canh-ca-rot-khoai-lang', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-ca-rot-khoai-lang-food-nuoc-mam', 'recipe2-canh-ca-rot-khoai-lang', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-cai-thia-thit-bam-food-hanh-tim', 'recipe2-canh-cai-thia-thit-bam', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-cai-thia-thit-bam-food-hanh-la', 'recipe2-canh-cai-thia-thit-bam', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-cai-thia-thit-bam-food-nuoc-mam', 'recipe2-canh-cai-thia-thit-bam', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-su-hao-xuong-food-hanh-tim', 'recipe2-canh-su-hao-xuong', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-su-hao-xuong-food-hanh-la', 'recipe2-canh-su-hao-xuong', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-canh-su-hao-xuong-food-nuoc-mam', 'recipe2-canh-su-hao-xuong', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-com-bo-xao-hanh-tay-food-hanh-tim', 'recipe2-com-bo-xao-hanh-tay', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-com-bo-xao-hanh-tay-food-toi', 'recipe2-com-bo-xao-hanh-tay', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-dau-hu-xao-nam-food-hanh-tim', 'recipe2-dau-hu-xao-nam', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-dau-hu-xao-nam-food-toi', 'recipe2-dau-hu-xao-nam', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-dau-lang-xao-rau-cu-food-hanh-tim', 'recipe2-dau-lang-xao-rau-cu', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-dau-lang-xao-rau-cu-food-toi', 'recipe2-dau-lang-xao-rau-cu', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ga-ap-chao-nam-food-toi', 'recipe2-ga-ap-chao-nam', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ga-kho-gung-food-hanh-tim', 'recipe2-ga-kho-gung', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ga-kho-gung-food-toi', 'recipe2-ga-kho-gung', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ga-kho-gung-food-duong', 'recipe2-ga-kho-gung', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ga-kho-gung-food-nuoc-mam', 'recipe2-ga-kho-gung', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ga-nuong-mat-ong-food-toi', 'recipe2-ga-nuong-mat-ong', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ga-xao-su-hao-food-hanh-tim', 'recipe2-ga-xao-su-hao', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-ga-xao-su-hao-food-toi', 'recipe2-ga-xao-su-hao', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-mi-trung-xao-bo-food-hanh-tim', 'recipe2-mi-trung-xao-bo', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-mi-trung-xao-bo-food-toi', 'recipe2-mi-trung-xao-bo', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-mi-trung-xao-rau-cu-food-hanh-tim', 'recipe2-mi-trung-xao-rau-cu', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-mi-trung-xao-rau-cu-food-toi', 'recipe2-mi-trung-xao-rau-cu', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-bap-cai-tom-food-toi', 'recipe2-salad-bap-cai-tom', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-bap-cai-tom-food-ot', 'recipe2-salad-bap-cai-tom', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-bap-cai-tom-food-chanh', 'recipe2-salad-bap-cai-tom', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-bap-cai-tom-food-duong', 'recipe2-salad-bap-cai-tom', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-bap-cai-tom-food-nuoc-mam', 'recipe2-salad-bap-cai-tom', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-cam-hanh-nhan-food-toi', 'recipe2-salad-cam-hanh-nhan', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-cam-hanh-nhan-food-ot', 'recipe2-salad-cam-hanh-nhan', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-cam-hanh-nhan-food-chanh', 'recipe2-salad-cam-hanh-nhan', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-cam-hanh-nhan-food-duong', 'recipe2-salad-cam-hanh-nhan', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-cam-hanh-nhan-food-nuoc-mam', 'recipe2-salad-cam-hanh-nhan', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-dua-hau-pho-mai-food-toi', 'recipe2-salad-dua-hau-pho-mai', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-dua-hau-pho-mai-food-ot', 'recipe2-salad-dua-hau-pho-mai', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-dua-hau-pho-mai-food-chanh', 'recipe2-salad-dua-hau-pho-mai', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-dua-hau-pho-mai-food-duong', 'recipe2-salad-dua-hau-pho-mai', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-dua-hau-pho-mai-food-nuoc-mam', 'recipe2-salad-dua-hau-pho-mai', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-tom-bo-food-toi', 'recipe2-salad-tom-bo', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-tom-bo-food-ot', 'recipe2-salad-tom-bo', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-tom-bo-food-chanh', 'recipe2-salad-tom-bo', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-tom-bo-food-duong', 'recipe2-salad-tom-bo', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-tom-bo-food-nuoc-mam', 'recipe2-salad-tom-bo', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-xoai-tom-food-toi', 'recipe2-salad-xoai-tom', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-xoai-tom-food-ot', 'recipe2-salad-xoai-tom', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-xoai-tom-food-chanh', 'recipe2-salad-xoai-tom', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-xoai-tom-food-duong', 'recipe2-salad-xoai-tom', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-salad-xoai-tom-food-nuoc-mam', 'recipe2-salad-xoai-tom', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-sup-ga-ngo-food-hanh-tim', 'recipe2-sup-ga-ngo', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-sup-ga-ngo-food-hanh-la', 'recipe2-sup-ga-ngo', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-sup-ga-ngo-food-nuoc-mam', 'recipe2-sup-ga-ngo', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-thit-heo-nuong-mat-ong-food-toi', 'recipe2-thit-heo-nuong-mat-ong', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-thit-heo-xao-ca-rot-food-hanh-tim', 'recipe2-thit-heo-xao-ca-rot', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-thit-heo-xao-ca-rot-food-toi', 'recipe2-thit-heo-xao-ca-rot', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-tom-xao-bap-cai-food-hanh-tim', 'recipe2-tom-xao-bap-cai', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-tom-xao-bap-cai-food-toi', 'recipe2-tom-xao-bap-cai', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe2-trung-chien-cai-thia-food-toi', 'recipe2-trung-chien-cai-thia', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-bo-kho-food-hanh-tim', 'recipe3-bo-kho', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-bo-kho-food-toi', 'recipe3-bo-kho', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-bo-kho-food-duong', 'recipe3-bo-kho', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-bo-kho-food-nuoc-mam', 'recipe3-bo-kho', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-bun-bo-hue-food-hanh-la', 'recipe3-bun-bo-hue', 'food-hanh-la', 'Hành lá', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-bun-cha-ha-noi-food-hanh-la', 'recipe3-bun-cha-ha-noi', 'food-hanh-la', 'Hành lá', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-ca-hoi-ap-chao-sot-bo-toi-food-toi', 'recipe3-ca-hoi-ap-chao-sot-bo-toi', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-ca-thu-kho-thom-food-hanh-tim', 'recipe3-ca-thu-kho-thom', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-ca-thu-kho-thom-food-toi', 'recipe3-ca-thu-kho-thom', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-ca-thu-kho-thom-food-duong', 'recipe3-ca-thu-kho-thom', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-ca-thu-kho-thom-food-nuoc-mam', 'recipe3-ca-thu-kho-thom', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-canh-chua-ca-loc-food-hanh-tim', 'recipe3-canh-chua-ca-loc', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-canh-chua-ca-loc-food-hanh-la', 'recipe3-canh-chua-ca-loc', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-canh-chua-ca-loc-food-nuoc-mam', 'recipe3-canh-chua-ca-loc', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-canh-kho-qua-nhoi-thit-food-hanh-tim', 'recipe3-canh-kho-qua-nhoi-thit', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-canh-kho-qua-nhoi-thit-food-hanh-la', 'recipe3-canh-kho-qua-nhoi-thit', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-canh-kho-qua-nhoi-thit-food-nuoc-mam', 'recipe3-canh-kho-qua-nhoi-thit', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-goi-cuon-tom-thit-food-toi', 'recipe3-goi-cuon-tom-thit', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-goi-cuon-tom-thit-food-ot', 'recipe3-goi-cuon-tom-thit', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-goi-cuon-tom-thit-food-chanh', 'recipe3-goi-cuon-tom-thit', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-goi-cuon-tom-thit-food-duong', 'recipe3-goi-cuon-tom-thit', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-goi-cuon-tom-thit-food-nuoc-mam', 'recipe3-goi-cuon-tom-thit', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-goi-du-du-tom-kho-food-toi', 'recipe3-goi-du-du-tom-kho', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-goi-du-du-tom-kho-food-ot', 'recipe3-goi-du-du-tom-kho', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-goi-du-du-tom-kho-food-chanh', 'recipe3-goi-du-du-tom-kho', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-goi-du-du-tom-kho-food-duong', 'recipe3-goi-du-du-tom-kho', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-goi-du-du-tom-kho-food-nuoc-mam', 'recipe3-goi-du-du-tom-kho', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-hu-tieu-nam-vang-food-hanh-la', 'recipe3-hu-tieu-nam-vang', 'food-hanh-la', 'Hành lá', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-mi-quang-food-hanh-la', 'recipe3-mi-quang', 'food-hanh-la', 'Hành lá', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-pho-bo-food-hanh-la', 'recipe3-pho-bo', 'food-hanh-la', 'Hành lá', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-sup-cua-food-hanh-tim', 'recipe3-sup-cua', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-sup-cua-food-hanh-la', 'recipe3-sup-cua', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-sup-cua-food-nuoc-mam', 'recipe3-sup-cua', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-thit-kho-tau-food-hanh-tim', 'recipe3-thit-kho-tau', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-thit-kho-tau-food-toi', 'recipe3-thit-kho-tau', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-thit-kho-tau-food-duong', 'recipe3-thit-kho-tau', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe3-thit-kho-tau-food-nuoc-mam', 'recipe3-thit-kho-tau', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-banh-trang-nuong-food-toi', 'recipe4-banh-trang-nuong', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-banh-trang-tron-food-toi', 'recipe4-banh-trang-tron', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-banh-trang-tron-food-ot', 'recipe4-banh-trang-tron', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-banh-trang-tron-food-chanh', 'recipe4-banh-trang-tron', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-banh-trang-tron-food-duong', 'recipe4-banh-trang-tron', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-banh-trang-tron-food-nuoc-mam', 'recipe4-banh-trang-tron', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-bun-rieu-cua-food-hanh-la', 'recipe4-bun-rieu-cua', 'food-hanh-la', 'Hành lá', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-ca-basa-kho-to-food-hanh-tim', 'recipe4-ca-basa-kho-to', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-ca-basa-kho-to-food-toi', 'recipe4-ca-basa-kho-to', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-ca-basa-kho-to-food-duong', 'recipe4-ca-basa-kho-to', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-ca-basa-kho-to-food-nuoc-mam', 'recipe4-ca-basa-kho-to', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-canh-mang-suon-food-hanh-tim', 'recipe4-canh-mang-suon', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-canh-mang-suon-food-hanh-la', 'recipe4-canh-mang-suon', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-canh-mang-suon-food-nuoc-mam', 'recipe4-canh-mang-suon', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-goi-ga-la-chanh-food-toi', 'recipe4-goi-ga-la-chanh', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-goi-ga-la-chanh-food-ot', 'recipe4-goi-ga-la-chanh', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-goi-ga-la-chanh-food-chanh', 'recipe4-goi-ga-la-chanh', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-goi-ga-la-chanh-food-duong', 'recipe4-goi-ga-la-chanh', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-goi-ga-la-chanh-food-nuoc-mam', 'recipe4-goi-ga-la-chanh', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-mi-xao-hai-san-food-hanh-tim', 'recipe4-mi-xao-hai-san', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-mi-xao-hai-san-food-toi', 'recipe4-mi-xao-hai-san', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-nem-nuong-food-toi', 'recipe4-nem-nuong', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-oc-xao-sa-ot-food-hanh-tim', 'recipe4-oc-xao-sa-ot', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-oc-xao-sa-ot-food-toi', 'recipe4-oc-xao-sa-ot', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-salad-vung-dau-phu-food-toi', 'recipe4-salad-vung-dau-phu', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-salad-vung-dau-phu-food-ot', 'recipe4-salad-vung-dau-phu', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-salad-vung-dau-phu-food-chanh', 'recipe4-salad-vung-dau-phu', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-salad-vung-dau-phu-food-duong', 'recipe4-salad-vung-dau-phu', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-salad-vung-dau-phu-food-nuoc-mam', 'recipe4-salad-vung-dau-phu', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe4-thit-de-nuong-la-lot-food-toi', 'recipe4-thit-de-nuong-la-lot', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ca-hop-sot-ca-kho-food-hanh-tim', 'recipe5-ca-hop-sot-ca-kho', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ca-hop-sot-ca-kho-food-toi', 'recipe5-ca-hop-sot-ca-kho', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ca-hop-sot-ca-kho-food-duong', 'recipe5-ca-hop-sot-ca-kho', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ca-hop-sot-ca-kho-food-nuoc-mam', 'recipe5-ca-hop-sot-ca-kho', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ca-ngu-hop-tron-bun-food-toi', 'recipe5-ca-ngu-hop-tron-bun', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ca-ngu-hop-tron-bun-food-ot', 'recipe5-ca-ngu-hop-tron-bun', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ca-ngu-hop-tron-bun-food-chanh', 'recipe5-ca-ngu-hop-tron-bun', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ca-ngu-hop-tron-bun-food-duong', 'recipe5-ca-ngu-hop-tron-bun', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ca-ngu-hop-tron-bun-food-nuoc-mam', 'recipe5-ca-ngu-hop-tron-bun', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-canh-ca-hop-rau-cai-food-hanh-tim', 'recipe5-canh-ca-hop-rau-cai', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-canh-ca-hop-rau-cai-food-hanh-la', 'recipe5-canh-ca-hop-rau-cai', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-canh-ca-hop-rau-cai-food-nuoc-mam', 'recipe5-canh-ca-hop-rau-cai', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-canh-rong-bien-dau-hu-food-hanh-tim', 'recipe5-canh-rong-bien-dau-hu', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-canh-rong-bien-dau-hu-food-hanh-la', 'recipe5-canh-rong-bien-dau-hu', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-canh-rong-bien-dau-hu-food-nuoc-mam', 'recipe5-canh-rong-bien-dau-hu', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-canh-trung-ca-chua-mi-food-hanh-tim', 'recipe5-canh-trung-ca-chua-mi', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-canh-trung-ca-chua-mi-food-hanh-la', 'recipe5-canh-trung-ca-chua-mi', 'food-hanh-la', 'Hành lá', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-canh-trung-ca-chua-mi-food-nuoc-mam', 'recipe5-canh-trung-ca-chua-mi', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-com-chien-xuc-xich-food-toi', 'recipe5-com-chien-xuc-xich', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-dau-que-xao-thit-hop-food-hanh-tim', 'recipe5-dau-que-xao-thit-hop', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-dau-que-xao-thit-hop-food-toi', 'recipe5-dau-que-xao-thit-hop', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ga-kho-nuoc-mam-food-hanh-tim', 'recipe5-ga-kho-nuoc-mam', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ga-kho-nuoc-mam-food-toi', 'recipe5-ga-kho-nuoc-mam', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ga-kho-nuoc-mam-food-duong', 'recipe5-ga-kho-nuoc-mam', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ga-xao-xa-ot-nuoc-mam-food-hanh-tim', 'recipe5-ga-xao-xa-ot-nuoc-mam', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-ga-xao-xa-ot-nuoc-mam-food-toi', 'recipe5-ga-xao-xa-ot-nuoc-mam', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-kim-chi-xao-thit-bo-food-hanh-tim', 'recipe5-kim-chi-xao-thit-bo', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-kim-chi-xao-thit-bo-food-toi', 'recipe5-kim-chi-xao-thit-bo', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-mi-an-lien-xao-bo-food-hanh-tim', 'recipe5-mi-an-lien-xao-bo', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-mi-an-lien-xao-bo-food-toi', 'recipe5-mi-an-lien-xao-bo', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-mi-tom-trung-food-hanh-la', 'recipe5-mi-tom-trung', 'food-hanh-la', 'Hành lá', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-mi-tron-xuc-xich-trung-food-toi', 'recipe5-mi-tron-xuc-xich-trung', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-mi-tron-xuc-xich-trung-food-ot', 'recipe5-mi-tron-xuc-xich-trung', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-mi-tron-xuc-xich-trung-food-chanh', 'recipe5-mi-tron-xuc-xich-trung', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-mi-tron-xuc-xich-trung-food-duong', 'recipe5-mi-tron-xuc-xich-trung', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-mi-tron-xuc-xich-trung-food-nuoc-mam', 'recipe5-mi-tron-xuc-xich-trung', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-ca-ngu-hop-food-toi', 'recipe5-salad-ca-ngu-hop', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-ca-ngu-hop-food-ot', 'recipe5-salad-ca-ngu-hop', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-ca-ngu-hop-food-chanh', 'recipe5-salad-ca-ngu-hop', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-ca-ngu-hop-food-duong', 'recipe5-salad-ca-ngu-hop', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-ca-ngu-hop-food-nuoc-mam', 'recipe5-salad-ca-ngu-hop', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-dau-hu-kim-chi-food-toi', 'recipe5-salad-dau-hu-kim-chi', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-dau-hu-kim-chi-food-ot', 'recipe5-salad-dau-hu-kim-chi', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-dau-hu-kim-chi-food-chanh', 'recipe5-salad-dau-hu-kim-chi', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-dau-hu-kim-chi-food-duong', 'recipe5-salad-dau-hu-kim-chi', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-dau-hu-kim-chi-food-nuoc-mam', 'recipe5-salad-dau-hu-kim-chi', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-trung-pho-mai-food-toi', 'recipe5-salad-trung-pho-mai', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-trung-pho-mai-food-ot', 'recipe5-salad-trung-pho-mai', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-trung-pho-mai-food-chanh', 'recipe5-salad-trung-pho-mai', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-trung-pho-mai-food-duong', 'recipe5-salad-trung-pho-mai', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-trung-pho-mai-food-nuoc-mam', 'recipe5-salad-trung-pho-mai', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-uc-ga-gio-thu-food-toi', 'recipe5-salad-uc-ga-gio-thu', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-uc-ga-gio-thu-food-ot', 'recipe5-salad-uc-ga-gio-thu', 'food-ot', 'Ớt', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-uc-ga-gio-thu-food-chanh', 'recipe5-salad-uc-ga-gio-thu', 'food-chanh', 'Chanh', 15, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-uc-ga-gio-thu-food-duong', 'recipe5-salad-uc-ga-gio-thu', 'food-duong', 'Đường', 10, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-salad-uc-ga-gio-thu-food-nuoc-mam', 'recipe5-salad-uc-ga-gio-thu', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 104) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-thit-bo-kho-tuong-den-food-hanh-tim', 'recipe5-thit-bo-kho-tuong-den', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-thit-bo-kho-tuong-den-food-toi', 'recipe5-thit-bo-kho-tuong-den', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-thit-heo-kho-dua-chua-food-hanh-tim', 'recipe5-thit-heo-kho-dua-chua', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-thit-heo-kho-dua-chua-food-toi', 'recipe5-thit-heo-kho-dua-chua', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-thit-heo-kho-dua-chua-food-duong', 'recipe5-thit-heo-kho-dua-chua', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-thit-heo-kho-dua-chua-food-nuoc-mam', 'recipe5-thit-heo-kho-dua-chua', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-thit-hop-xao-dua-chua-food-hanh-tim', 'recipe5-thit-hop-xao-dua-chua', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-thit-hop-xao-dua-chua-food-toi', 'recipe5-thit-hop-xao-dua-chua', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-trung-chien-nuoc-tuong-food-toi', 'recipe5-trung-chien-nuoc-tuong', 'food-toi', 'Tỏi', 5, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-xuc-xich-nuong-khoai-lang-food-hanh-tim', 'recipe5-xuc-xich-nuong-khoai-lang', 'food-hanh-tim', 'Hành tím', 10, 'g', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-xuc-xich-nuong-khoai-lang-food-toi', 'recipe5-xuc-xich-nuong-khoai-lang', 'food-toi', 'Tỏi', 5, 'g', 101) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-xuc-xich-nuong-khoai-lang-food-duong', 'recipe5-xuc-xich-nuong-khoai-lang', 'food-duong', 'Đường', 10, 'g', 102) ON CONFLICT (id) DO NOTHING;
INSERT INTO meal_recipe_ingredients (id, recipe_id, food_id, name, quantity, unit, sort_order) VALUES ('ing-arom-recipe5-xuc-xich-nuong-khoai-lang-food-nuoc-mam', 'recipe5-xuc-xich-nuong-khoai-lang', 'food-nuoc-mam', 'Nước mắm', 15, 'g', 103) ON CONFLICT (id) DO NOTHING;
