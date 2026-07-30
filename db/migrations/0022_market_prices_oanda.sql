-- Migration: 0022_market_prices_oanda
-- Switch World prices from Twelve Data to OANDA. oanda_api_key /
-- oanda_account_id intentionally start NULL — set via the admin form,
-- never committed to this migration file.
ALTER TABLE price_settings ADD COLUMN oanda_api_key TEXT;
ALTER TABLE price_settings ADD COLUMN oanda_account_id TEXT;
ALTER TABLE price_settings ADD COLUMN oanda_environment TEXT NOT NULL DEFAULT 'practice';

-- OANDA instrument format uses underscores (XAU_USD), not slashes.
-- USD/VND is not an OANDA instrument, so that row is dropped.
UPDATE price_symbols SET symbol = 'XAU_USD' WHERE symbol = 'XAU/USD';
UPDATE price_symbols SET symbol = 'EUR_USD' WHERE symbol = 'EUR/USD';
UPDATE price_symbols SET symbol = 'GBP_USD' WHERE symbol = 'GBP/USD';
UPDATE price_symbols SET symbol = 'USD_JPY' WHERE symbol = 'USD/JPY';
DELETE FROM price_symbols WHERE symbol = 'USD/VND';
