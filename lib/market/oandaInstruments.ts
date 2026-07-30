import { getPriceSettings, oandaApiHost } from "./priceSettingsService";

export interface OandaInstrument {
  symbol: string;
  displayName: string;
  type: string;
}

interface OandaInstrumentRaw {
  name: string;
  displayName?: string;
  type?: string;
}

// Some OANDA accounts (this practice one included) return only currency
// pairs from /v3/accounts/{id}/instruments even though metals/commodities
// still work fine on the pricing and stream endpoints. Merge in the common
// ones so search/autocomplete can still find them.
const FALLBACK_INSTRUMENTS: OandaInstrument[] = [
  { symbol: "XAU_USD", displayName: "Gold", type: "METAL" },
  { symbol: "XAG_USD", displayName: "Silver", type: "METAL" },
  { symbol: "XPT_USD", displayName: "Platinum", type: "METAL" },
  { symbol: "XPD_USD", displayName: "Palladium", type: "METAL" },
  { symbol: "XAU_EUR", displayName: "Gold (EUR)", type: "METAL" },
  { symbol: "XAU_GBP", displayName: "Gold (GBP)", type: "METAL" },
  { symbol: "BCO_USD", displayName: "Brent Crude Oil", type: "COMMODITY" },
  { symbol: "WTICO_USD", displayName: "West Texas Oil", type: "COMMODITY" },
  { symbol: "NATGAS_USD", displayName: "Natural Gas", type: "COMMODITY" },
];

// OANDA's own instrument list for the configured account — used to power
// symbol search/autocomplete in the admin form and the public "add symbol"
// box.
export async function fetchOandaInstruments(): Promise<OandaInstrument[]> {
  const settings = await getPriceSettings();
  const apiKey = settings.oandaApiKey;
  const accountId = settings.oandaAccountId;
  if (!apiKey || !accountId) return [];

  const host = oandaApiHost(settings.oandaEnvironment);
  let accountInstruments: OandaInstrument[] = [];
  try {
    const res = await fetch(`${host}/v3/accounts/${encodeURIComponent(accountId)}/instruments`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      console.error(`[market/oandaInstruments] OANDA returned HTTP ${res.status}`);
    } else {
      const json = (await res.json()) as { instruments?: OandaInstrumentRaw[] };
      accountInstruments = (json.instruments ?? []).map((i) => ({
        symbol: i.name,
        displayName: i.displayName ?? i.name,
        type: i.type ?? "",
      }));
    }
  } catch (err) {
    console.error("[market/oandaInstruments] fetch failed:", err);
  }

  const known = new Set(accountInstruments.map((i) => i.symbol));
  const merged = [...accountInstruments, ...FALLBACK_INSTRUMENTS.filter((i) => !known.has(i.symbol))];
  return merged;
}
