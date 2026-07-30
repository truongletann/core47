import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { priceSymbols } from "@/db/schema";
import { getPriceSettings } from "./priceSettingsService";
import { listEnabledSymbols } from "./priceSymbolsService";

interface TwelveDataQuote {
  close?: string;
  percent_change?: string;
  status?: string;
  message?: string;
}

export async function fetchAndStorePrices(): Promise<void> {
  const [settings, symbols] = await Promise.all([getPriceSettings(), listEnabledSymbols()]);
  const apiKey = settings.twelveDataApiKey;
  if (!apiKey || symbols.length === 0) return;

  const symbolList = symbols.map((s) => s.symbol);
  const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbolList.join(","))}&apikey=${encodeURIComponent(apiKey)}`;

  let json: unknown;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[market/prices] Twelve Data returned HTTP ${res.status}`);
      return;
    }
    json = await res.json();
  } catch (err) {
    console.error("[market/prices] fetch failed:", err);
    return;
  }

  // Twelve Data returns the quote object directly when a single symbol is
  // requested, but keys the response by symbol when multiple are requested.
  const quoteMap: Record<string, TwelveDataQuote> =
    symbolList.length === 1
      ? { [symbolList[0]]: json as TwelveDataQuote }
      : (json as Record<string, TwelveDataQuote>);

  const db = await getDb();
  const now = new Date().toISOString();

  await Promise.all(
    symbols.map(async (s) => {
      const quote = quoteMap[s.symbol];
      if (!quote || quote.status === "error" || quote.close === undefined) {
        if (quote?.status === "error") {
          console.error(`[market/prices] ${s.symbol}: ${quote.message ?? "unavailable"}`);
        }
        return;
      }

      await db
        .update(priceSymbols)
        .set({
          lastPrice: Number(quote.close),
          lastChangePercent: quote.percent_change !== undefined ? Number(quote.percent_change) : null,
          lastFetchedAt: now,
        })
        .where(eq(priceSymbols.id, s.id));
    }),
  );
}
