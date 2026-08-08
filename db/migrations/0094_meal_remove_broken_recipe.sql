-- Migration: 0094_meal_remove_broken_recipe
-- Target: Cloudflare D1 (SQLite)
-- Removes one recipe found during a DB audit: "Thực đơn cúng Ông Táo đơn
-- giản cầu phúc năm mới" has zero ingredients and its instructions field
-- is actually a different dish's recipe (Há cảo tam sắc) — a source-data
-- mismatch, not something fixable without fabricating content. Only 1 of
-- 2506 recipes affected.

DELETE FROM meal_plan_entries WHERE recipe_id = 'recipe-thuc-don-cung-ong-tao-don-gian-cau-phuc-nam-moi';
DELETE FROM meal_recipe_ingredients WHERE recipe_id = 'recipe-thuc-don-cung-ong-tao-don-gian-cau-phuc-nam-moi';
DELETE FROM meal_recipes WHERE id = 'recipe-thuc-don-cung-ong-tao-don-gian-cau-phuc-nam-moi';
