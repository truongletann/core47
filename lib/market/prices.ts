import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { priceSymbols } from "@/db/schema";
import { getPriceSettings, oandaApiHost } from "./priceSettingsService";
import { listEnabledSymbols } from "./priceSymbolsService";

interface OandaPrice {
  instrument: string;
  closeoutBid?: string;
  closeoutAsk?: string;
  status?: string;
}

interface OandaCandle {
  complete: boolean;
  mid?: { o: string; h: string; l: string; c: string };
}

interface DayCandleInfo {
  prevClose: number | null;
  dayOpen: number | null;
  dayHigh: number | null;
  dayLow: number | null;
}

function midPrice(p: OandaPrice): number | null {
  if (!p.closeoutBid || !p.closeoutAsk) return null;
  return (Number(p.closeoutBid) + Number(p.closeoutAsk)) / 2;
}

// Previous complete day's close (for the day-over-day % change calc) plus
// today's running open/high/low, all from the same 2-candle fetch — OANDA's
// pricing endpoint doesn't return any of this itself.
async function fetchDayCandleInfo(host: string, apiKey: string, instrument: string): Promise<DayCandleInfo> {
  const empty: DayCandleInfo = { prevClose: null, dayOpen: null, dayHigh: null, dayLow: null };
  try {
    const res = await fetch(
      `${host}/v3/instruments/${encodeURIComponent(instrument)}/candles?granularity=D&count=2&price=M`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    if (!res.ok) return empty;
    const json = (await res.json()) as { candles?: OandaCandle[] };
    const candles = json.candles ?? [];
    if (candles.length === 0) return empty;

    const today = candles[candles.length - 1];
    const complete = candles.filter((c) => c.complete && c.mid?.c);
    const prevClose = complete.length > 0 ? Number(complete[complete.length - 1].mid!.c) : null;

    return {
      prevClose,
      dayOpen: today.mid ? Number(today.mid.o) : null,
      dayHigh: today.mid ? Number(today.mid.h) : null,
      dayLow: today.mid ? Number(today.mid.l) : null,
    };
  } catch {
    return empty;
  }
}

async function fetchAndStoreOandaPrices(symbols: (typeof priceSymbols.$inferSelect)[]): Promise<void> {
  const settings = await getPriceSettings();
  const apiKey = settings.oandaApiKey;
  const accountId = settings.oandaAccountId;
  if (!apiKey || !accountId || symbols.length === 0) return;

  const host = oandaApiHost(settings.oandaEnvironment);
  const symbolList = symbols.map((s) => s.symbol);
  const url = `${host}/v3/accounts/${encodeURIComponent(accountId)}/pricing?instruments=${encodeURIComponent(symbolList.join(","))}`;

  let json: { prices?: OandaPrice[] };
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) {
      console.error(`[market/prices] OANDA returned HTTP ${res.status}`);
      return;
    }
    json = await res.json();
  } catch (err) {
    console.error("[market/prices] fetch failed:", err);
    return;
  }

  const priceMap = new Map((json.prices ?? []).map((p) => [p.instrument, p]));
  const db = await getDb();
  const now = new Date().toISOString();

  await Promise.all(
    symbols.map(async (s) => {
      const price = priceMap.get(s.symbol);
      if (!price || price.status === "non-tradeable") return;
      const mid = midPrice(price);
      if (mid === null) return;

      const { prevClose, dayOpen, dayHigh, dayLow } = await fetchDayCandleInfo(host, apiKey, s.symbol);
      const changePercent = prevClose ? ((mid - prevClose) / prevClose) * 100 : null;

      await db
        .update(priceSymbols)
        .set({
          lastPrice: mid,
          lastChangePercent: changePercent,
          dayOpen,
          dayHigh,
          dayLow,
          prevClose,
          lastFetchedAt: now,
        })
        .where(eq(priceSymbols.id, s.id));
    }),
  );
}

// Binance's REST API rejects requests from this Worker's network (403 —
// looks like an ASN/datacenter block on their WAF), so there's no
// server-side snapshot for Binance symbols. The public page instead
// connects to Binance's WebSocket ticker stream directly from the browser,
// which isn't blocked — new Binance rows just show "—" for the instant
// before that first tick arrives.
export async function fetchAndStorePrices(): Promise<void> {
  const symbols = await listEnabledSymbols();
  const oandaSymbols = symbols.filter((s) => s.source === "oanda");
  await fetchAndStoreOandaPrices(oandaSymbols);
}
