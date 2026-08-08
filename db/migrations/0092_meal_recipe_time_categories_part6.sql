-- Migration: 0092_meal_recipe_time_categories_part6
-- Target: Cloudflare D1 (SQLite)
-- Part 6/6: backfills meal_categories (breakfast/lunch/
-- dinner/snack/dessert) via keyword heuristic on the recipe name — same
-- approach/limitations as deriveCookingMethods in lib/meal/recipeFilters.ts.
-- A dish gets every plausible time slot, not one exclusive pick (phở/bún/
-- mì etc. tagged breakfast+lunch since eaten at either in practice; savory
-- mains default to lunch+dinner, VN cuisine doesn't distinguish those).
UPDATE meal_recipes SET meal_categories = 'lunch,dinner' WHERE id = 'recipe-tom-tron-bong-cai';
UPDATE meal_recipes SET meal_categories = 'lunch,dinner' WHERE id = 'recipe-vit-quay-bac-kinh-chay';
UPDATE meal_recipes SET meal_categories = 'lunch,dinner' WHERE id = 'recipe-khoai-chien-lac-mayo-me-la-que';
UPDATE meal_recipes SET meal_categories = 'lunch,dinner' WHERE id = 'recipe-cuon-tau-hu-ky-xot-ro-ti';
UPDATE meal_recipes SET meal_categories = 'lunch,dinner' WHERE id = 'recipe-lau-ca-lang-mang-chua';
UPDATE meal_recipes SET meal_categories = 'lunch,dinner' WHERE id = 'recipe-nguu-bang-xao-hai-san';
