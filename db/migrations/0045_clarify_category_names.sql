-- Migration: 0045_clarify_category_names
-- Target: Cloudflare D1 (SQLite)
-- "Dev Tools" was misleading — the category actually holds the toolbox hub
-- plus Random and Keyboard, which aren't dev-specific. Renamed to
-- "Utilities" to match what's actually inside.

UPDATE categories SET name = 'Utilities' WHERE id = 'dev-utilities';
