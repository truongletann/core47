-- Migration: 0026_market_vn_gold_vangtoday
-- Recreates VN gold pricing on vang.today's public API (free, no key,
-- not blocked from this Worker — unlike SJC's own endpoint, which is why
-- 0024/0025 dropped the client-side-only version). Covers SJC bar + ring
-- gold plus DOJI and PNJ, all in one call.
CREATE TABLE IF NOT EXISTS vn_gold_prices (
  id                TEXT PRIMARY KEY,
  type_code         TEXT NOT NULL,
  label             TEXT NOT NULL,
  unit              TEXT NOT NULL DEFAULT 'đ/lượng',
  buy_price         REAL,
  sell_price        REAL,
  change_percent    REAL,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  last_fetched_at   TEXT
);

INSERT INTO vn_gold_prices (id, type_code, label, unit, sort_order) VALUES
  ('sjc-bar', 'SJL1L10', 'Vàng SJC 1L, 10L, 1KG', 'đ/lượng', 0),
  ('sjc-ring', 'SJ9999', 'Vàng nhẫn SJC 99,99%', 'đ/lượng', 1),
  ('doji', 'DOJINHTV', 'Vàng DOJI', 'đ/lượng', 2),
  ('pnj', 'PQHN24NTT', 'Vàng PNJ 24K', 'đ/lượng', 3)
ON CONFLICT (id) DO NOTHING;
