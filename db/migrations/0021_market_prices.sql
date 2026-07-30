-- Migration: 0021_market_prices
-- twelve_data_api_key intentionally starts NULL — set via SQL or the admin
-- form directly, never committed to this migration file.
CREATE TABLE IF NOT EXISTS price_settings (
  id                    TEXT PRIMARY KEY,
  twelve_data_api_key   TEXT,
  updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO price_settings (id, twelve_data_api_key, updated_at)
VALUES ('default', NULL, datetime('now'))
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS price_symbols (
  id                     TEXT PRIMARY KEY,
  symbol                 TEXT NOT NULL UNIQUE,
  label                  TEXT NOT NULL,
  unit                   TEXT NOT NULL,
  enabled                INTEGER NOT NULL DEFAULT 1,
  sort_order             INTEGER NOT NULL DEFAULT 0,
  last_price             REAL,
  last_change_percent    REAL,
  last_fetched_at        TEXT,
  created_at             TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Free-tier-confirmed defaults — XAG/USD (silver) requires a paid Twelve
-- Data plan, so it's intentionally left out until a different source covers it.
INSERT INTO price_symbols (id, symbol, label, unit, sort_order, created_at) VALUES
  ('sym-xauusd', 'XAU/USD', 'Gold', 'USD/oz', 0, datetime('now')),
  ('sym-eurusd', 'EUR/USD', 'EUR/USD', '', 1, datetime('now')),
  ('sym-gbpusd', 'GBP/USD', 'GBP/USD', '', 2, datetime('now')),
  ('sym-usdjpy', 'USD/JPY', 'USD/JPY', '', 3, datetime('now')),
  ('sym-usdvnd', 'USD/VND', 'USD/VND', '', 4, datetime('now'))
ON CONFLICT (symbol) DO NOTHING;
