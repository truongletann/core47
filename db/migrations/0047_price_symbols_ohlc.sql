-- Migration: 0047_price_symbols_ohlc
-- Target: Cloudflare D1 (SQLite)
-- Adds daily candle O/H/L + previous close to price_symbols so the Prices
-- page can show more than just the current mid-price. OANDA's candles
-- endpoint was already being called (for the day-over-day % change calc)
-- but the O/H/L/prev-close values it returns were being discarded.

ALTER TABLE price_symbols ADD COLUMN day_open REAL;
ALTER TABLE price_symbols ADD COLUMN day_high REAL;
ALTER TABLE price_symbols ADD COLUMN day_low REAL;
ALTER TABLE price_symbols ADD COLUMN prev_close REAL;
