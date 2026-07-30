-- Migration: 0023_market_prices_binance
-- Add a source column so price_symbols can track OANDA (forex/metals) and
-- Binance (crypto) instruments side by side. Existing rows are all OANDA.
ALTER TABLE price_symbols ADD COLUMN source TEXT NOT NULL DEFAULT 'oanda';
