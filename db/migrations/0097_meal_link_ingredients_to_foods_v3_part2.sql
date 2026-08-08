-- Migration: 0097_meal_link_ingredients_to_foods_v3_part2
-- Target: Cloudflare D1 (SQLite)
-- Part 2/2: third pass of ingredient->food linking, after
-- 0095_meal_more_foods_round3 added ~40 more foods. Also adds a leading-
-- prefix strip fallback ("rau X"/"lá X"/"thịt X"/"phi lê X" -> X) — with a
-- blocklist for plants where the leaf/flower is a different food from the
-- fruit/seed (chuối/chanh/mè/gừng/ớt/dừa/cam/bí), caught during spot-check
-- before this ran (an unblocked version wrongly matched "Lá chuối"/banana
-- leaf and "Rau chuối"/banana flower to banana FRUIT's nutrition).
UPDATE meal_recipe_ingredients SET food_id = 'food-hanh-boaro' WHERE id = '718e1cf5-01e0-4e79-88b0-3d774470e8ef';
UPDATE meal_recipe_ingredients SET food_id = 'food-long-do-trung' WHERE id = '5a13550b-49d1-4369-b863-5e081db45e1f';
UPDATE meal_recipe_ingredients SET food_id = 'food-thit-ba-roi' WHERE id = 'bde24dd0-84a2-4be1-a44c-e8c0ffcd3bcf';
UPDATE meal_recipe_ingredients SET food_id = 'food-tieu' WHERE id = '93170dd5-f6be-4a0d-81cf-bda626b4576b';
UPDATE meal_recipe_ingredients SET food_id = 'food-long-trang-trung-ga' WHERE id = '68aab59c-3d1e-4433-a443-83ec27885dbe';
UPDATE meal_recipe_ingredients SET food_id = 'food-dau-petit-pois' WHERE id = '8475aaad-8f2d-4d8b-86ff-1e41b009539a';
UPDATE meal_recipe_ingredients SET food_id = 'food-boaro' WHERE id = 'aa90a8ce-dc33-44d2-a6f4-e9aac9ca4733';
UPDATE meal_recipe_ingredients SET food_id = 'food-tieu' WHERE id = '9fcecfe4-5bbf-465f-bbad-245d5ee74768';
UPDATE meal_recipe_ingredients SET food_id = 'food-cot-chanh' WHERE id = '05ccbe35-487e-4a42-85cc-bf4cba8d3064';
UPDATE meal_recipe_ingredients SET food_id = 'food-uc-ga' WHERE id = 'd54f8d8a-725b-4a26-a6ba-a5504accb401';
UPDATE meal_recipe_ingredients SET food_id = 'food-bap-my' WHERE id = '11e984f7-49be-4620-8d7b-0ecd86a712d6';
UPDATE meal_recipe_ingredients SET food_id = 'food-tieu' WHERE id = '52ddac9a-6a68-4984-a5c9-a30c4d28e1ea';
UPDATE meal_recipe_ingredients SET food_id = 'food-tieu' WHERE id = '634ad4d6-967f-4acc-93a5-b782cf5d935f';
UPDATE meal_recipe_ingredients SET food_id = 'food-long-ga' WHERE id = 'cd7f80e1-8a16-42ec-8976-6c81197c1d70';
UPDATE meal_recipe_ingredients SET food_id = 'food-cu-nen' WHERE id = '089b8d4b-2606-43c7-bd5c-5728fada1cb8';
UPDATE meal_recipe_ingredients SET food_id = 'food-bot-nghe' WHERE id = 'e06c1ad2-d88f-42ac-858b-3f9163219ad6';
UPDATE meal_recipe_ingredients SET food_id = 'food-tieu' WHERE id = '814089a8-f5b0-44bc-ba0c-d253a5e89869';
UPDATE meal_recipe_ingredients SET food_id = 'food-hanh-boaro' WHERE id = '8015d45c-9629-4485-be31-caf7be1cb21a';
UPDATE meal_recipe_ingredients SET food_id = 'food-hanh-boaro' WHERE id = 'fa75c838-6090-4dd6-9a0e-d1f91d3472f7';
UPDATE meal_recipe_ingredients SET food_id = 'food-thit-nac-dam' WHERE id = '1b0063a9-8bef-4cc7-938d-aed1051511e9';
UPDATE meal_recipe_ingredients SET food_id = 'food-gio-heo' WHERE id = '47bdeedc-5134-421d-b7d8-3c8f8d1f9bb3';
UPDATE meal_recipe_ingredients SET food_id = 'food-bap-my' WHERE id = '696238d1-684a-4840-952a-56ea037311cf';
UPDATE meal_recipe_ingredients SET food_id = 'food-gio-heo' WHERE id = '2140f05d-696a-4694-964f-34cd45a5c95d';
UPDATE meal_recipe_ingredients SET food_id = 'food-tieu' WHERE id = 'b3547fd9-2e7d-4a0a-a7ce-00438317d5ee';
UPDATE meal_recipe_ingredients SET food_id = 'food-hanh-boaro' WHERE id = 'fa975714-a807-4f23-b492-2d5e28cefc5e';
UPDATE meal_recipe_ingredients SET food_id = 'food-hanh-boaro' WHERE id = '9f9bdbe9-857f-48ff-a464-0ce88d033457';
UPDATE meal_recipe_ingredients SET food_id = 'food-tieu' WHERE id = '62cb9443-3fe9-44a6-a0a1-202b8e2ffd14';
