-- Migration: 0025_market_vn_gold_client_side
-- SJC's WAF blocks this Worker's outbound requests (403) just like
-- Binance's did, so the server-side polling table is dead weight — VN
-- gold now fetches directly from the browser (see lib/market/sjcClient.ts),
-- same pattern as Binance crypto prices.
DROP TABLE IF EXISTS vn_gold_prices;
