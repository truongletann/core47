-- Migration: 0077_meal_link_ingredients_to_foods_part7
-- Target: Cloudflare D1 (SQLite)
-- Part 7/7: links meal_recipe_ingredients.food_id to an existing
-- meal_foods entry by matching the ingredient's name (diacritic/tone-mark-
-- preserving normalized match — an earlier stripped-diacritics attempt
-- wrongly collided distinct words, e.g. "Cá"/fish vs "Cà"/tomato, "Gan"/
-- liver vs "Gân"/tendon, "Ngô"/corn vs "Ngò"/cilantro — fixed before this
-- ran). Only sets food_id where the (sub)name exactly matches an existing
-- curated food; does not fabricate new nutrition entries. ~34% coverage
-- (9016/26615 rows) — the rest are spices/brand condiments/uncommon
-- items with no matching entry, left unlinked rather than guessed.
UPDATE meal_recipe_ingredients SET food_id = 'food-tuong-ot' WHERE id = '8b03f52d-bfc4-4779-9250-b28a9855d113';
UPDATE meal_recipe_ingredients SET food_id = 'food-nam-dong-co' WHERE id = '2670ad4c-bf1d-433b-acfd-9d430ff3dc55';
UPDATE meal_recipe_ingredients SET food_id = 'food-nam-kim-cham' WHERE id = '6e3fbed5-367f-4ba1-b3ca-ab4325ce96f8';
UPDATE meal_recipe_ingredients SET food_id = 'food-mat-ong' WHERE id = '4036fa0c-0dd5-4e0c-8c7b-bfe9253b9b07';
UPDATE meal_recipe_ingredients SET food_id = 'food-nuoc-tuong' WHERE id = 'b9b33873-5044-4ff4-9b81-302f40283b9a';
UPDATE meal_recipe_ingredients SET food_id = 'food-khoai-lang' WHERE id = '4c9cbd52-df4c-41a5-b506-c88c9556c61d';
UPDATE meal_recipe_ingredients SET food_id = 'food-sua-chua' WHERE id = '94f91bd0-912c-4e1a-9951-a4c88a647ce3';
UPDATE meal_recipe_ingredients SET food_id = 'food-nuoc-tuong' WHERE id = 'cd28d8e9-9933-4b58-8bec-130eed288880';
UPDATE meal_recipe_ingredients SET food_id = 'food-ca-chua' WHERE id = '3258c1f4-b79a-45b9-a8ed-8cf4f6603942';
UPDATE meal_recipe_ingredients SET food_id = 'food-hanh-tim' WHERE id = 'eb3be219-71f8-4e1d-ac3f-8cc29ce4eaf8';
UPDATE meal_recipe_ingredients SET food_id = 'food-toi' WHERE id = '3d794027-42f0-4216-8934-5e4e8c27a086';
UPDATE meal_recipe_ingredients SET food_id = 'food-ot' WHERE id = 'c0948cba-17b2-4282-a033-81563a38daa1';
UPDATE meal_recipe_ingredients SET food_id = 'food-gung' WHERE id = '18361785-444c-47bd-b5e9-1d307ecce0ad';
UPDATE meal_recipe_ingredients SET food_id = 'food-ca-rot' WHERE id = 'abc7a641-f8ff-4c4a-b52c-cca41ce5b002';
UPDATE meal_recipe_ingredients SET food_id = 'food-muc' WHERE id = '1dea6673-de1a-4692-82dc-e37c97614268';
UPDATE meal_recipe_ingredients SET food_id = 'food-nuoc-tuong' WHERE id = '8342bdc2-cf4d-4644-9e49-036f0ac76cc0';
