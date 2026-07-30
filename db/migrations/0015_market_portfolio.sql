-- Migration: 0015_market_portfolio
CREATE TABLE IF NOT EXISTS portfolio_assets (
  id                        TEXT PRIMARY KEY,
  user_id                   TEXT NOT NULL,
  asset_type                TEXT NOT NULL CHECK (asset_type IN ('gold','silver','forex','coffee','pepper','custom')),
  custom_name               TEXT,                        -- required when asset_type = 'custom'
  unit                      TEXT NOT NULL,                -- e.g. "lượng", "ounce", "kg", "USD"
  current_price             REAL NOT NULL DEFAULT 0,      -- manually entered until a live price feed exists
  current_price_updated_at  TEXT,
  created_at                TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at                TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS portfolio_transactions (
  id               TEXT PRIMARY KEY,
  asset_id         TEXT NOT NULL,
  user_id          TEXT NOT NULL,                -- denormalized for admin cross-user queries
  type             TEXT NOT NULL CHECK (type IN ('buy','sell')),
  quantity         REAL NOT NULL,
  price_per_unit   REAL NOT NULL,
  note             TEXT,
  tx_date          TEXT NOT NULL,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_portfolio_assets_user_id ON portfolio_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_transactions_asset_id ON portfolio_transactions(asset_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_transactions_user_id ON portfolio_transactions(user_id);
