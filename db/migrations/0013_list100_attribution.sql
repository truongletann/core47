-- Migration: 0013_list100_attribution
ALTER TABLE list100_items ADD COLUMN suggested_by TEXT;
