// Client-side only. Binance's REST API rejects requests from Cloudflare
// Workers (403, likely a datacenter/ASN block on their WAF) but fully
// supports CORS, so this must be called from the browser rather than
// proxied through our own API routes.

export interface BinanceInstrument {
  symbol: string;
  displayName: string;
}

interface BinanceSymbolRaw {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
}

// Shown by default (no search query) — Binance lists 400+ USDT pairs, too
// many to dump into a picker with nothing typed.
const POPULAR_BASES = new Set([
  "BTC",
  "ETH",
  "BNB",
  "SOL",
  "XRP",
  "ADA",
  "DOGE",
  "DOT",
  "MATIC",
  "LTC",
  "AVAX",
  "LINK",
  "ATOM",
  "TRX",
  "SHIB",
  "NEAR",
  "ARB",
  "OP",
  "FIL",
  "ICP",
]);

export async function searchBinanceInstruments(query?: string): Promise<BinanceInstrument[]> {
  try {
    const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
    if (!res.ok) return [];
    const json = (await res.json()) as { symbols?: BinanceSymbolRaw[] };
    const usdtPairs = (json.symbols ?? [])
      .filter((s) => s.status === "TRADING" && s.quoteAsset === "USDT")
      .map((s) => ({ symbol: s.symbol, displayName: `${s.baseAsset}/${s.quoteAsset}` }));

    if (!query) {
      return usdtPairs.filter((p) => POPULAR_BASES.has(p.symbol.slice(0, -4)));
    }

    const q = query.toLowerCase();
    return usdtPairs.filter(
      (p) => p.symbol.toLowerCase().includes(q) || p.displayName.toLowerCase().includes(q),
    );
  } catch {
    return [];
  }
}
