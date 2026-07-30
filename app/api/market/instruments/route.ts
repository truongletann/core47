import { NextRequest, NextResponse } from "next/server";
import { fetchOandaInstruments } from "@/lib/market/oandaInstruments";

const MAX_RESULTS_QUERY = 30;

// Public, read-only search over OANDA's instrument list (symbol names only,
// no credentials exposed) — powers the OANDA half of symbol autocomplete in
// the admin form and the public "add symbol" box on /market/prices. Binance
// symbols are searched client-side (see lib/market/binanceClient.ts) —
// Binance's API blocks requests from this Worker's network.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const all = await fetchOandaInstruments();

  const filtered = q
    ? all.filter((i) => i.symbol.toLowerCase().includes(q) || i.displayName.toLowerCase().includes(q))
    : all;

  const instruments = (q ? filtered.slice(0, MAX_RESULTS_QUERY) : filtered).map((i) => ({
    ...i,
    source: "oanda" as const,
  }));

  return NextResponse.json({ success: true, data: { instruments } });
}
