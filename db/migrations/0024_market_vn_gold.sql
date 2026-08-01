-- Migration: 0024_market_vn_gold
-- SJC gold prices (Vietnam domestic) shown on /market/prices. Uses SJC's
-- own undocumented internal endpoint, same precedent as the fxtin.com
-- integration. Not admin-configurable — just two fixed rows.
CREATE TABLE IF NOT EXISTS vn_gold_prices (
  id                TEXT PRIMARY KEY,
  gold_price_id     INTEGER NOT NULL,
  label             TEXT NOT NULL,
  unit              TEXT NOT NULL DEFAULT 'đ/lượng',
  buy_price         REAL,
  sell_price        REAL,
  change_percent    REAL,
  last_fetched_at   TEXT
);

INSERT INTO vn_gold_prices (id, gold_price_id, label, unit) VALUES
  ('sjc-1l', 1, 'Vàng SJC 1L, 10L, 1KG', 'đ/lượng'),
  ('sjc-nhan', 49, 'Vàng nhẫn SJC 99,99%', 'đ/lượng')
ON CONFLICT (id) DO NOTHING;
