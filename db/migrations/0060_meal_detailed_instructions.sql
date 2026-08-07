-- Migration: 0060_meal_detailed_instructions
-- Target: Cloudflare D1 (SQLite)
-- Rewrites every existing recipe's instructions with a longer, more
-- concrete step sequence (prep -> cooking -> finish, with realistic
-- times/heat/doneness cues) instead of the original 3-line summaries —
-- composed from cooking-method templates + each recipe's own real
-- ingredient list, self-authored, not sourced from any external site.
UPDATE meal_recipes SET instructions = '1. Sơ chế nguyên liệu: Trứng gà, Dưa leo chuẩn bị sẵn, cắt lát vừa ăn.
2. Chế biến phần nhân: chiên/áp chảo Trứng gà tới chín, hoặc phết trực tiếp nếu là pate/bơ.
3. Xẻ dọc ổ Bánh mì, không cắt đứt hẳn hai bên.
4. Kẹp phần nhân đã chuẩn bị vào giữa bánh.
5. Thêm rau/dưa leo, tương ớt hoặc đồ chua tuỳ thích.
6. Dùng ngay khi bánh còn giòn.', updated_at = datetime('now') WHERE id = 'recipe-banh-mi-trung-op-la';
UPDATE meal_recipes SET instructions = '1. Sơ chế Đậu phụ: ướp cùng gia vị cơ bản trong khoảng 15 phút.
2. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
3. Cho Đậu phụ vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
4. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
5. Xếp Bún và Cà chua lên trên.
6. Chan nước dùng nóng vào tô, rắc hành ngò, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe-bun-dau-phu-sot-ca';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt heo: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Thịt heo tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Bún.', updated_at = datetime('now') WHERE id = 'recipe-bun-thit-heo-nuong';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Cá đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Rau muống vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe-ca-kho-rau-muong';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Cải bó xôi và Dầu ô liu, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Cải bó xôi với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Cải bó xôi vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Dầu ô liu vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Cải bó xôi trở lại chảo, đảo đều cùng Dầu ô liu, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe-cai-bo-xoi-xao-toi';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bí đỏ và Thịt heo bằm: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Bí đỏ vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Thịt heo bằm vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe-canh-bi-do-thit-bam';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá và Cà chua: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Cá vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Cà chua và Hành tây vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe-canh-chua-ca';
UPDATE meal_recipes SET instructions = '1. Sơ chế Yến mạch: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.
2. Cho Yến mạch cùng Chuối vào máy xay sinh tố.
3. Xay nhuyễn mịn trong khoảng 30-60 giây.
4. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
5. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe-chao-yen-mach-chuoi';
UPDATE meal_recipes SET instructions = '1. Sơ chế Yến mạch: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.
2. Cho Yến mạch cùng Trứng gà vào máy xay sinh tố.
3. Xay nhuyễn mịn trong khoảng 30-60 giây.
4. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
5. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe-chao-yen-mach-trung-bo';
UPDATE meal_recipes SET instructions = '1. Sơ chế Gạo trắng (đã nấu): rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Gạo trắng (đã nấu) tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Trứng gà.', updated_at = datetime('now') WHERE id = 'recipe-com-chien-trung-dau-que';
UPDATE meal_recipes SET instructions = '1. Sơ chế Ức gà và Gạo trắng (đã nấu): rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Ức gà theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Gạo trắng (đã nấu), Rau muống, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe-com-ga-xe';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Thịt bò và Bông cải xanh, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Bông cải xanh và Gạo trắng (đã nấu) vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Thịt bò trở lại chảo, đảo đều cùng Bông cải xanh, Gạo trắng (đã nấu), nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe-com-thit-bo-xao-bong-cai';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt heo: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Thịt heo tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Gạo trắng (đã nấu).', updated_at = datetime('now') WHERE id = 'recipe-com-thit-heo-nuong-sa';
UPDATE meal_recipes SET instructions = '1. Sơ chế Đậu lăng (đã nấu) và Bí đỏ: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Đậu lăng (đã nấu) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Bí đỏ, Cà chua, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe-dau-lang-ham-rau-cu';
UPDATE meal_recipes SET instructions = '1. Sơ chế Đậu phụ và Cà chua: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Đậu phụ theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Cà chua, Dầu ô liu, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe-dau-phu-sot-ca-chua';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Mực và Hành tây, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Mực với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Mực vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Hành tây và Dầu ô liu vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Mực trở lại chảo, đảo đều cùng Hành tây, Dầu ô liu, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe-muc-xao-hanh-tay';
UPDATE meal_recipes SET instructions = '1. Sơ chế Ngô: rửa sạch, để ráo nước; Trứng gà cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).
3. Đun sôi nước trong nồi hấp hoặc nồi luộc.
4. Cho Ngô cùng Trứng gà vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
5. Vớt ra, để ráo trong vài phút.
6. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe-ngo-luoc-trung-luoc';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Trứng gà, Cải bó xôi, Dầu ô liu, để ráo.
2. Thái/bào Trứng gà thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Cá tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe-salad-ca-trung';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Quả bơ, Cà chua, Dưa leo, để ráo.
2. Thái/bào Quả bơ thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Ức gà tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe-salad-uc-ga-bo';
UPDATE meal_recipes SET instructions = '1. Sơ chế Quả bơ: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.
2. Cho Quả bơ cùng Bơ đậu phộng vào máy xay sinh tố.
3. Xay nhuyễn mịn trong khoảng 30-60 giây.
4. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
5. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe-sinh-to-bo-dau-phong';
UPDATE meal_recipes SET instructions = '1. Sơ chế Phô mai: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.
2. Cho Phô mai cùng Chuối vào máy xay sinh tố.
3. Xay nhuyễn mịn trong khoảng 30-60 giây.
4. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
5. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe-sinh-to-pho-mai-chuoi';
UPDATE meal_recipes SET instructions = '1. Sơ chế Sữa chua không đường và Hạnh nhân: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Sữa chua không đường theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Hạnh nhân, Chuối, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe-sua-chua-hanh-nhan-chuoi';
UPDATE meal_recipes SET instructions = '1. Sơ chế Nấm và Ức gà: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Nấm vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Ức gà vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe-sup-nam-ga';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt heo: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Thịt heo đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Trứng gà vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe-thit-heo-kho-trung';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt vịt: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Thịt vịt tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Gạo trắng (đã nấu).', updated_at = datetime('now') WHERE id = 'recipe-thit-vit-quay-com';
UPDATE meal_recipes SET instructions = '1. Sơ chế Tôm: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Tôm đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Khoai lang vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe-tom-hap-khoai-lang';
UPDATE meal_recipes SET instructions = '1. Sơ chế Trứng gà: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Trứng gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Cà chua.', updated_at = datetime('now') WHERE id = 'recipe-trung-chien-rau-cu';
UPDATE meal_recipes SET instructions = '1. Sơ chế Trứng gà: rửa sạch, để ráo nước; Phô mai cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).
3. Đun sôi nước trong nồi hấp hoặc nồi luộc.
4. Cho Trứng gà cùng Phô mai vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
5. Vớt ra, để ráo trong vài phút.
6. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe-trung-hap-pho-mai';
UPDATE meal_recipes SET instructions = '1. Sơ chế Ức gà: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Ức gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Dưa leo.', updated_at = datetime('now') WHERE id = 'recipe-uc-ga-ap-chao-salad';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Sữa chua không đường, Hạnh nhân, để ráo.
2. Thái/bào Sữa chua không đường thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Yến mạch tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe-yen-mach-sua-chua-hat';
UPDATE meal_recipes SET instructions = '1. Sơ chế nguyên liệu: Bơ đậu phộng, Chuối chuẩn bị sẵn, cắt lát vừa ăn.
2. Chế biến phần nhân: chiên/áp chảo Bơ đậu phộng tới chín, hoặc phết trực tiếp nếu là pate/bơ.
3. Xẻ dọc ổ Bánh mì, không cắt đứt hẳn hai bên.
4. Kẹp phần nhân đã chuẩn bị vào giữa bánh.
5. Thêm rau/dưa leo, tương ớt hoặc đồ chua tuỳ thích.
6. Dùng ngay khi bánh còn giòn.', updated_at = datetime('now') WHERE id = 'recipe2-banh-mi-bo-dau-phong-chuoi';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt bò: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Thịt bò đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Khoai lang vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe2-bo-luc-lac-khoai-lang';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Thịt bò và Đậu Hà Lan, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Đậu Hà Lan vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Thịt bò trở lại chảo, đảo đều cùng Đậu Hà Lan, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-bo-xao-dau-ha-lan';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Thịt bò và Bún, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Bún và Dưa leo vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Thịt bò trở lại chảo, đảo đều cùng Bún, Dưa leo, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-bun-thit-bo-xao';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá: rửa sạch, để ráo nước; Hành tây cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).
3. Đun sôi nước trong nồi hấp hoặc nồi luộc.
4. Cho Cá cùng Hành tây vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
5. Vớt ra, để ráo trong vài phút.
6. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe2-ca-hap-gung-hanh';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Cá đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Gạo trắng (đã nấu) vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe2-ca-kho-to';
UPDATE meal_recipes SET instructions = '1. Sơ chế Trứng gà: rửa sạch, để ráo nước; Cà rốt cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).
3. Đun sôi nước trong nồi hấp hoặc nồi luộc.
4. Cho Trứng gà cùng Cà rốt vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
5. Vớt ra, để ráo trong vài phút.
6. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe2-ca-rot-luoc-trung';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bắp cải và Tôm: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Bắp cải vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Tôm vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe2-canh-bap-cai-tom';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt heo bằm và Cà rốt: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Thịt heo bằm vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Cà rốt và Khoai lang vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe2-canh-ca-rot-khoai-lang';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cải thìa và Thịt heo bằm: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Cải thìa vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Thịt heo bằm vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe2-canh-cai-thia-thit-bam';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt heo bằm và Su hào: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Thịt heo bằm vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Su hào vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe2-canh-su-hao-xuong';
UPDATE meal_recipes SET instructions = '1. Sơ chế Yến mạch: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.
2. Cho Yến mạch cùng Bí đỏ vào máy xay sinh tố.
3. Xay nhuyễn mịn trong khoảng 30-60 giây.
4. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
5. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe2-chao-yen-mach-bi-do';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Thịt bò và Hành tây, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Hành tây và Gạo trắng (đã nấu) vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Thịt bò trở lại chảo, đảo đều cùng Hành tây, Gạo trắng (đã nấu), nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-com-bo-xao-hanh-tay';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt vịt và Gạo trắng (đã nấu): rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Thịt vịt theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Gạo trắng (đã nấu), Cà rốt, Đậu que, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe2-com-thit-vit-rau-cu';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Đậu phụ và Nấm, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Đậu phụ với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Đậu phụ vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Nấm và Dầu ô liu vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Đậu phụ trở lại chảo, đảo đều cùng Nấm, Dầu ô liu, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-dau-hu-xao-nam';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Đậu lăng (đã nấu) và Cà rốt, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Đậu lăng (đã nấu) với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Đậu lăng (đã nấu) vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Cà rốt và Su hào vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Đậu lăng (đã nấu) trở lại chảo, đảo đều cùng Cà rốt, Su hào, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-dau-lang-xao-rau-cu';
UPDATE meal_recipes SET instructions = '1. Sơ chế Đậu phụ: rửa sạch, để ráo nước; Nấm cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).
3. Đun sôi nước trong nồi hấp hoặc nồi luộc.
4. Cho Đậu phụ cùng Nấm vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
5. Vớt ra, để ráo trong vài phút.
6. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe2-dau-phu-hap-nam';
UPDATE meal_recipes SET instructions = '1. Sơ chế Ức gà: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Ức gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Nấm.', updated_at = datetime('now') WHERE id = 'recipe2-ga-ap-chao-nam';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt gà: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Thịt gà đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Gạo trắng (đã nấu) vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe2-ga-kho-gung';
UPDATE meal_recipes SET instructions = '1. Sơ chế Ức gà: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Ức gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Mật ong.', updated_at = datetime('now') WHERE id = 'recipe2-ga-nuong-mat-ong';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Ức gà và Su hào, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Ức gà với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Ức gà vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Su hào và Dầu ô liu vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Ức gà trở lại chảo, đảo đều cùng Su hào, Dầu ô liu, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-ga-xao-su-hao';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Mì trứng (đã luộc) và Thịt bò, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Mì trứng (đã luộc) với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Mì trứng (đã luộc) vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Thịt bò và Hành tây vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Mì trứng (đã luộc) trở lại chảo, đảo đều cùng Thịt bò, Hành tây, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-mi-trung-xao-bo';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Mì trứng (đã luộc) và Cà rốt, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Mì trứng (đã luộc) với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Mì trứng (đã luộc) vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Cà rốt và Bắp cải vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Mì trứng (đã luộc) trở lại chảo, đảo đều cùng Cà rốt, Bắp cải, Đậu que, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-mi-trung-xao-rau-cu';
UPDATE meal_recipes SET instructions = '1. Sơ chế Mực: rửa sạch, để ráo nước; Hành tây cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).
3. Đun sôi nước trong nồi hấp hoặc nồi luộc.
4. Cho Mực cùng Hành tây vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
5. Vớt ra, để ráo trong vài phút.
6. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe2-muc-hap-hanh-gung';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Tôm, Dầu ô liu, để ráo.
2. Thái/bào Tôm thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Bắp cải tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe2-salad-bap-cai-tom';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Hạnh nhân, để ráo.
2. Thái/bào Hạnh nhân thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Cam tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe2-salad-cam-hanh-nhan';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Phô mai, để ráo.
2. Thái/bào Phô mai thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Dưa hấu tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe2-salad-dua-hau-pho-mai';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Quả bơ, Cà chua, Dầu ô liu, để ráo.
2. Thái/bào Quả bơ thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Tôm tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe2-salad-tom-bo';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Xoài, để ráo.
2. Thái/bào Xoài thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Tôm tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe2-salad-xoai-tom';
UPDATE meal_recipes SET instructions = '1. Sơ chế Quả bơ: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.
2. Cho Quả bơ cùng Sữa tươi vào máy xay sinh tố.
3. Xay nhuyễn mịn trong khoảng 30-60 giây.
4. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
5. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe2-sinh-to-bo-mat-ong';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cam: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.
2. Cho Cam cùng Cà rốt vào máy xay sinh tố.
3. Xay nhuyễn mịn trong khoảng 30-60 giây.
4. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
5. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe2-sinh-to-cam-ca-rot';
UPDATE meal_recipes SET instructions = '1. Sơ chế Chuối: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.
2. Cho Chuối cùng Hạt điều vào máy xay sinh tố.
3. Xay nhuyễn mịn trong khoảng 30-60 giây.
4. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
5. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe2-sinh-to-chuoi-hat-dieu';
UPDATE meal_recipes SET instructions = '1. Sơ chế Xoài: gọt vỏ/rửa sạch, cắt miếng nhỏ vừa cho vào máy xay.
2. Cho Xoài cùng Sữa chua không đường vào máy xay sinh tố.
3. Xay nhuyễn mịn trong khoảng 30-60 giây.
4. Nếm thử, điều chỉnh thêm đường/mật ong nếu cần cho vừa khẩu vị.
5. Rót ra ly, có thể thêm đá, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe2-sinh-to-xoai';
UPDATE meal_recipes SET instructions = '1. Sơ chế Ức gà và Ngô: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Ức gà vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Ngô vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe2-sup-ga-ngo';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt heo: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Thịt heo tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Mật ong.', updated_at = datetime('now') WHERE id = 'recipe2-thit-heo-nuong-mat-ong';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Thịt heo và Cà rốt, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt heo với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Thịt heo vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Cà rốt vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Thịt heo trở lại chảo, đảo đều cùng Cà rốt, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-thit-heo-xao-ca-rot';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Tôm và Bắp cải, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Tôm với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Tôm vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Bắp cải và Dầu ô liu vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Tôm trở lại chảo, đảo đều cùng Bắp cải, Dầu ô liu, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe2-tom-xao-bap-cai';
UPDATE meal_recipes SET instructions = '1. Sơ chế Trứng gà: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Trứng gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Cải thìa.', updated_at = datetime('now') WHERE id = 'recipe2-trung-chien-cai-thia';
UPDATE meal_recipes SET instructions = '1. Sơ chế Trứng gà: rửa sạch, để ráo nước; Tôm cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).
3. Đun sôi nước trong nồi hấp hoặc nồi luộc.
4. Cho Trứng gà cùng Tôm vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
5. Vớt ra, để ráo trong vài phút.
6. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe2-trung-hap-tom';
UPDATE meal_recipes SET instructions = '1. Sơ chế Yến mạch và Sữa tươi: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Yến mạch theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Sữa tươi, Mật ong, Hạt điều, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe2-yen-mach-mat-ong-hat-dieu';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bột gạo (quy đổi) và Chả lụa: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Bột gạo (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Chả lụa, Giá đỗ, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe3-banh-cuon-cha-lua';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bột gạo (quy đổi) và Tôm: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Bột gạo (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Tôm, Thịt ba chỉ, Giá đỗ, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe3-banh-xeo-tom-thit';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt bò: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Thịt bò đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Cà rốt vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe3-bo-kho';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bún: ướp cùng gia vị cơ bản trong khoảng 15 phút.
2. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
3. Cho Bún vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
4. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
5. Xếp Thịt bò và Chả lụa lên trên.
6. Chan nước dùng nóng vào tô, rắc hành ngò, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe3-bun-bo-hue';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bún: ướp cùng gia vị cơ bản trong khoảng 15 phút.
2. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
3. Cho Bún vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
4. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
5. Xếp Thịt ba chỉ và Cà rốt lên trên.
6. Chan nước dùng nóng vào tô, rắc hành ngò, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe3-bun-cha-ha-noi';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá hồi: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Cá hồi tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Dầu ô liu.', updated_at = datetime('now') WHERE id = 'recipe3-ca-hoi-ap-chao-sot-bo-toi';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá thu: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Cá thu đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Gạo trắng (đã nấu) vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe3-ca-thu-kho-thom';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá lóc và Cà chua: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Cá lóc vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Cà chua và Giá đỗ vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe3-canh-chua-ca-loc';
UPDATE meal_recipes SET instructions = '1. Sơ chế Khổ qua và Thịt heo bằm: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Khổ qua vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Thịt heo bằm vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe3-canh-kho-qua-nhoi-thit';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bánh tráng và Thịt heo bằm: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Bánh tráng theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Thịt heo bằm, Giá đỗ, Miến, Dầu chiên, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe3-cha-gio';
UPDATE meal_recipes SET instructions = '1. Sơ chế Đậu xanh và Nước cốt dừa: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Đậu xanh theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Nước cốt dừa, Mật ong, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe3-che-dau-xanh';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cơm tấm và Sườn heo: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Cơm tấm theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Sườn heo, Chả lụa, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe3-com-tam-suon-bi-cha';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Tôm, Thịt ba chỉ, Bún, để ráo.
2. Thái/bào Tôm thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Bánh tráng tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe3-goi-cuon-tom-thit';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Tôm khô, Đậu phộng, để ráo.
2. Thái/bào Tôm khô thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Đu đủ xanh tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe3-goi-du-du-tom-kho';
UPDATE meal_recipes SET instructions = '1. Sơ chế Hủ tiếu: ướp cùng gia vị cơ bản trong khoảng 15 phút.
2. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
3. Cho Hủ tiếu vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
4. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
5. Xếp Tôm và Thịt heo lên trên.
6. Chan nước dùng nóng vào tô, rắc hành ngò, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe3-hu-tieu-nam-vang';
UPDATE meal_recipes SET instructions = '1. Sơ chế Mì trứng (đã luộc): ướp cùng gia vị cơ bản trong khoảng 15 phút.
2. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
3. Cho Mì trứng (đã luộc) vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
4. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
5. Xếp Tôm và Thịt heo lên trên.
6. Chan nước dùng nóng vào tô, rắc hành ngò, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe3-mi-quang';
UPDATE meal_recipes SET instructions = '1. Sơ chế Nghêu: rửa sạch, để ráo nước; Sả cũng rửa sạch, cắt miếng vừa ăn.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).
3. Đun sôi nước trong nồi hấp hoặc nồi luộc.
4. Cho Nghêu cùng Sả vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
5. Vớt ra, để ráo trong vài phút.
6. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe3-ngheu-hap-sa';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bánh phở: ướp cùng gia vị cơ bản trong khoảng 15 phút.
2. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
3. Cho Bánh phở vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
4. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
5. Xếp Thịt bò và Hành tây lên trên.
6. Chan nước dùng nóng vào tô, rắc hành ngò, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe3-pho-bo';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt cua và Trứng gà: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Thịt cua vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Trứng gà và Ngô vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe3-sup-cua';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt ba chỉ: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Thịt ba chỉ đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Trứng gà vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe3-thit-kho-tau';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bột gạo (quy đổi) và Tôm khô: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Bột gạo (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Tôm khô, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-banh-beo';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bột gạo (quy đổi) và Thịt heo bằm: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Bột gạo (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Thịt heo bằm, Nấm, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-banh-cuon-thit-nam';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bột gạo (quy đổi) và Tôm: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Bột gạo (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Tôm, Nước cốt dừa, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-banh-khot';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bánh tráng: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Bánh tráng tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Trứng gà.', updated_at = datetime('now') WHERE id = 'recipe4-banh-trang-nuong';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Tôm khô, Đậu phộng, để ráo.
2. Thái/bào Tôm khô thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Bánh tráng tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe4-banh-trang-tron';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bún: ướp cùng gia vị cơ bản trong khoảng 15 phút.
2. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
3. Cho Bún vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
4. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
5. Xếp Thịt cua và Cà chua lên trên.
6. Chan nước dùng nóng vào tô, rắc hành ngò, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe4-bun-rieu-cua';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá basa: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Cá basa đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Gạo trắng (đã nấu) vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe4-ca-basa-kho-to';
UPDATE meal_recipes SET instructions = '1. Sơ chế Sườn heo và Măng (quy đổi tạm): rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Sườn heo vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Măng (quy đổi tạm) vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe4-canh-mang-suon';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá và Lá lốt: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Cá theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Lá lốt, Bún, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-cha-ca-la-vong';
UPDATE meal_recipes SET instructions = '1. Sơ chế Ngô (bắp) và Nước cốt dừa: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Ngô (bắp) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Nước cốt dừa, Đường/mật ong, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-che-bap';
UPDATE meal_recipes SET instructions = '1. Sơ chế Bột nếp (quy đổi) và Đậu xanh: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Bột nếp (quy đổi) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Đậu xanh, Nước cốt dừa, Đường/mật ong, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-che-troi-nuoc';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt gà: rửa sạch, để ráo nước.
2. Ướp sơ với chút muối trong khoảng 10 phút (nếu cần).
3. Đun sôi nước trong nồi hấp hoặc nồi luộc.
4. Cho Thịt gà vào hấp/luộc khoảng 12-15 phút tới chín — dùng đũa xiên qua thấy mềm, không còn màu sống là đạt.
5. Vớt ra, để ráo trong vài phút.
6. Bày ra đĩa, dùng kèm nước chấm phù hợp.', updated_at = datetime('now') WHERE id = 'recipe4-ga-hap-la-chanh';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Bắp cải, để ráo.
2. Thái/bào Bắp cải thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Ức gà tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe4-goi-ga-la-chanh';
UPDATE meal_recipes SET instructions = '1. Sơ chế Tôm và Mực: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Tôm theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Mực, Nghêu, Cà chua, Sả, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-lau-thai-hai-san';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Mì trứng (đã luộc) và Tôm, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Mì trứng (đã luộc) với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Mì trứng (đã luộc) vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Tôm và Mực vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Mì trứng (đã luộc) trở lại chảo, đảo đều cùng Tôm, Mực, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe4-mi-xao-hai-san';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt heo bằm: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Thịt heo bằm tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Bánh tráng.', updated_at = datetime('now') WHERE id = 'recipe4-nem-nuong';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Ốc và Sả, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Ốc với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Ốc vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Sả vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Ốc trở lại chảo, đảo đều cùng Sả, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe4-oc-xao-sa-ot';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Dưa leo, Vừng (mè), Dầu ô liu, để ráo.
2. Thái/bào Dưa leo thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Đậu phụ tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe4-salad-vung-dau-phu';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt dê: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Thịt dê tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Lá lốt.', updated_at = datetime('now') WHERE id = 'recipe4-thit-de-nuong-la-lot';
UPDATE meal_recipes SET instructions = '1. Sơ chế Tôm và Me chua: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Tôm theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Me chua, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-tom-rang-me';
UPDATE meal_recipes SET instructions = '1. Sơ chế Gạo nếp (đã nấu) và Thịt gà: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Gạo nếp (đã nấu) theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Thịt gà, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe4-xoi-ga';
UPDATE meal_recipes SET instructions = '1. Sơ chế nguyên liệu: Pate hộp, Xúc xích chuẩn bị sẵn, cắt lát vừa ăn.
2. Chế biến phần nhân: chiên/áp chảo Pate hộp tới chín, hoặc phết trực tiếp nếu là pate/bơ.
3. Xẻ dọc ổ Bánh mì, không cắt đứt hẳn hai bên.
4. Kẹp phần nhân đã chuẩn bị vào giữa bánh.
5. Thêm rau/dưa leo, tương ớt hoặc đồ chua tuỳ thích.
6. Dùng ngay khi bánh còn giòn.', updated_at = datetime('now') WHERE id = 'recipe5-banh-mi-pate-xuc-xich';
UPDATE meal_recipes SET instructions = '1. Sơ chế nguyên liệu: Thịt hộp, Dưa leo chuẩn bị sẵn, cắt lát vừa ăn.
2. Chế biến phần nhân: chiên/áp chảo Thịt hộp tới chín, hoặc phết trực tiếp nếu là pate/bơ.
3. Xẻ dọc ổ Bánh mì, không cắt đứt hẳn hai bên.
4. Kẹp phần nhân đã chuẩn bị vào giữa bánh.
5. Thêm rau/dưa leo, tương ớt hoặc đồ chua tuỳ thích.
6. Dùng ngay khi bánh còn giòn.', updated_at = datetime('now') WHERE id = 'recipe5-banh-mi-thit-hop';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá hồi và Tương ớt: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Cá hồi theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Tương ớt, Mật ong, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-ca-hoi-sot-tuong-ot';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá hộp sốt cà: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Cá hộp sốt cà đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Gạo trắng (đã nấu) vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe5-ca-hop-sot-ca-kho';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Cá ngừ hộp, Dưa leo, Cà rốt, để ráo.
2. Thái/bào Cá ngừ hộp thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Bún tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-ca-ngu-hop-tron-bun';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cá hộp sốt cà và Cải thìa: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Cá hộp sốt cà vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Cải thìa vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe5-canh-ca-hop-rau-cai';
UPDATE meal_recipes SET instructions = '1. Sơ chế Rong biển (quy đổi) và Đậu phụ: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Rong biển (quy đổi) vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Đậu phụ và Nước tương vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe5-canh-rong-bien-dau-hu';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cà chua và Trứng gà: rửa sạch, cắt/thái miếng vừa ăn.
2. Phi thơm hành với chút dầu ăn, cho Cà chua vào xào săn khoảng 2 phút.
3. Đổ khoảng 700ml-1 lít nước vào nồi, đun lửa lớn tới sôi.
4. Hạ lửa vừa, cho Trứng gà và Mì ăn liền vào, nấu khoảng 8-10 phút tới chín mềm.
5. Nêm muối, hạt nêm, nước mắm vừa ăn, đun thêm 1-2 phút.
6. Tắt bếp, múc ra tô, rắc hành ngò lên trên, dùng nóng.', updated_at = datetime('now') WHERE id = 'recipe5-canh-trung-ca-chua-mi';
UPDATE meal_recipes SET instructions = '1. Sơ chế Cơm nguội: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Cơm nguội tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Xúc xích.', updated_at = datetime('now') WHERE id = 'recipe5-com-chien-xuc-xich';
UPDATE meal_recipes SET instructions = '1. Sơ chế Đậu phụ và Nước tương: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Đậu phụ theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Nước tương, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-dau-hu-sot-nuoc-tuong';
UPDATE meal_recipes SET instructions = '1. Sơ chế Đậu phộng: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Đậu phộng theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Nêm nếm lại cho vừa khẩu vị.
5. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-dau-phong-rang-muoi';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Đậu que và Thịt hộp, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Đậu que với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Đậu que vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Thịt hộp vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Đậu que trở lại chảo, đảo đều cùng Thịt hộp, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-dau-que-xao-thit-hop';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt gà: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Thịt gà đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Nước mắm vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe5-ga-kho-nuoc-mam';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Thịt gà và Sả, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt gà với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Thịt gà vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Sả và Nước mắm vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Thịt gà trở lại chảo, đảo đều cùng Sả, Nước mắm, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-ga-xao-xa-ot-nuoc-mam';
UPDATE meal_recipes SET instructions = '1. Sơ chế Giò thủ và Dưa cải chua: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Giò thủ theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Dưa cải chua, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-gio-thu-dua-chua';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Thịt bò và Kim chi, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Kim chi vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Thịt bò trở lại chảo, đảo đều cùng Kim chi, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-kim-chi-xao-thit-bo';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Mì ăn liền và Thịt bò, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Mì ăn liền với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Mì ăn liền vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Thịt bò và Cải bó xôi vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Mì ăn liền trở lại chảo, đảo đều cùng Thịt bò, Cải bó xôi, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-mi-an-lien-xao-bo';
UPDATE meal_recipes SET instructions = '1. Sơ chế Mì ăn liền: ướp cùng gia vị cơ bản trong khoảng 15 phút.
2. Nấu nước dùng: đun sôi nước, nêm gia vị vừa ăn.
3. Cho Mì ăn liền vào nấu chín, khoảng 5-7 phút tuỳ loại nguyên liệu.
4. Trụng bún/mì/phở qua nước sôi cho mềm, để ráo, cho vào tô.
5. Xếp Trứng gà lên trên.
6. Chan nước dùng nóng vào tô, rắc hành ngò, dùng ngay.', updated_at = datetime('now') WHERE id = 'recipe5-mi-tom-trung';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Xúc xích, Trứng gà, để ráo.
2. Thái/bào Xúc xích thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Mì ăn liền tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-mi-tron-xuc-xich-trung';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Dưa leo, Cà chua, Dầu ô liu, để ráo.
2. Thái/bào Dưa leo thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Cá ngừ hộp tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-salad-ca-ngu-hop';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Kim chi, để ráo.
2. Thái/bào Kim chi thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Đậu phụ tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-salad-dau-hu-kim-chi';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Phô mai, Dưa leo, để ráo.
2. Thái/bào Phô mai thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Trứng gà tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-salad-trung-pho-mai';
UPDATE meal_recipes SET instructions = '1. Sơ chế toàn bộ nguyên liệu: rửa sạch Giò thủ, Dưa leo, Dầu ô liu, để ráo.
2. Thái/bào Giò thủ thành lát hoặc sợi mỏng vừa ăn.
3. Luộc hoặc áp chảo Ức gà tới chín, để nguội bớt rồi xé/thái miếng vừa ăn.
4. Pha nước trộn chua ngọt từ nước mắm, đường, nước cốt chanh, tỏi ớt băm theo khẩu vị.
5. Trộn đều tất cả nguyên liệu cùng nước trộn, nêm nếm lại cho vừa miệng.
6. Bày ra đĩa, dùng ngay để rau củ giữ được độ giòn.', updated_at = datetime('now') WHERE id = 'recipe5-salad-uc-ga-gio-thu';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Thịt bò và Hành tây, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt bò với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Thịt bò vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Hành tây và Nước tương vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Thịt bò trở lại chảo, đảo đều cùng Hành tây, Nước tương, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-thit-bo-kho-tuong-den';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt bò và Nước tương: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Thịt bò theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Nước tương, Gạo trắng (đã nấu), đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-thit-bo-sot-tuong-den-com';
UPDATE meal_recipes SET instructions = '1. Sơ chế Thịt heo: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Thịt heo đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Dưa cải chua vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe5-thit-heo-kho-dua-chua';
UPDATE meal_recipes SET instructions = '1. Sơ chế: rửa sạch Thịt hộp và Dưa cải chua, để ráo nước rồi thái miếng vừa ăn.
2. Ướp Thịt hộp với chút muối, hạt nêm, tiêu trong khoảng 10-15 phút cho ngấm gia vị.
3. Bắc chảo lên bếp, cho dầu ăn vào đun nóng, phi thơm hành/tỏi băm.
4. Cho Thịt hộp vào xào lửa lớn khoảng 3-4 phút tới săn lại và chín tới, sau đó gắp riêng ra bát.
5. Cho Dưa cải chua vào chảo, xào khoảng 2-3 phút tới chín tới, còn hơi giòn.
6. Cho Thịt hộp trở lại chảo, đảo đều cùng Dưa cải chua, nêm nếm lại cho vừa ăn rồi tắt bếp.
7. Múc ra đĩa, dùng nóng cùng cơm trắng.', updated_at = datetime('now') WHERE id = 'recipe5-thit-hop-xao-dua-chua';
UPDATE meal_recipes SET instructions = '1. Sơ chế Tôm và Tương ớt: rửa sạch, để ráo, chuẩn bị theo đúng định lượng.
2. Chuẩn bị các nguyên liệu còn lại, cắt/thái vừa ăn.
3. Chế biến Tôm theo cách phù hợp với món (xào/hấp/trộn) tới chín tới.
4. Kết hợp cùng Tương ớt, đảo/trộn đều.
5. Nêm nếm lại cho vừa khẩu vị.
6. Bày ra đĩa/tô, dùng khi còn nóng hoặc theo đúng cách thưởng thức của món.', updated_at = datetime('now') WHERE id = 'recipe5-tom-sot-tuong-ot';
UPDATE meal_recipes SET instructions = '1. Sơ chế Trứng gà: rửa sạch, để ráo, có thể khía nhẹ để dễ ngấm gia vị.
2. Ướp cùng muối, tiêu, tỏi băm (và các gia vị khác nếu có) trong khoảng 20-30 phút.
3. Làm nóng chảo hoặc lò nướng trước khi cho nguyên liệu vào.
4. Chiên/nướng Trứng gà tới chín vàng đều hai mặt, khoảng 4-5 phút mỗi mặt tuỳ độ dày.
5. Kiểm tra độ chín bằng cách xiên đũa vào phần dày nhất — nước chảy ra trong là đã chín.
6. Bày ra đĩa, dùng kèm Nước tương.', updated_at = datetime('now') WHERE id = 'recipe5-trung-chien-nuoc-tuong';
UPDATE meal_recipes SET instructions = '1. Sơ chế Xúc xích: rửa sạch, cắt miếng vừa ăn, để ráo.
2. Ướp cùng nước mắm, đường, tiêu, hành tỏi băm trong khoảng 20-30 phút cho ngấm đều.
3. Bắc nồi lên bếp, cho Xúc xích đã ướp vào đảo săn trên lửa vừa khoảng 3-4 phút.
4. Cho Khoai lang vào cùng, đảo đều.
5. Đổ nước xâm xấp mặt, đun sôi rồi hạ lửa nhỏ, đậy vung kho liu riu khoảng 25-30 phút tới nước sánh lại.
6. Mở vung, nêm nếm lại cho vừa ăn, kho thêm 3-5 phút cho thấm rồi tắt bếp.
7. Dọn cùng cơm trắng khi còn nóng.', updated_at = datetime('now') WHERE id = 'recipe5-xuc-xich-nuong-khoai-lang';
