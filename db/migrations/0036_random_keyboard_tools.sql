-- Migration: 0036_random_keyboard_tools
-- Register the Random and Keyboard subdomains in the site's tool listing
-- (same pattern as focus/genqr/beautysql/shortlink).

INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order, created_at, updated_at)
VALUES (
  'tool-random',
  'random',
  'Random',
  'Bốc thăm ngẫu nhiên từ danh sách hoặc random số trong một khoảng, dùng CSPRNG.',
  'random.core47.xyz',
  'Dices',
  'utility',
  'active',
  11,
  datetime('now'),
  datetime('now')
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order, created_at, updated_at)
VALUES (
  'tool-keyboard',
  'keyboard',
  'Keyboard Test',
  'Kiểm tra từng phím vật lý (Windows & macOS) và đo tốc độ gõ (WPM).',
  'keyboard.core47.xyz',
  'Keyboard',
  'utility',
  'active',
  12,
  datetime('now'),
  datetime('now')
)
ON CONFLICT (slug) DO NOTHING;
