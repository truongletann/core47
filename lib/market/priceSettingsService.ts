import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { priceSettings } from "@/db/schema";
import { PriceSettingsSchema, type PriceSettingsInput } from "./priceSettingsSchema";

const SETTINGS_ID = "default";

export async function getPriceSettings() {
  const db = await getDb();
  const existing = await db.select().from(priceSettings).where(eq(priceSettings.id, SETTINGS_ID)).get();
  if (existing) return existing;

  const record = {
    id: SETTINGS_ID,
    twelveDataApiKey: null,
    oandaApiKey: null,
    oandaAccountId: null,
    oandaEnvironment: "practice" as const,
    updatedAt: new Date().toISOString(),
  };
  await db.insert(priceSettings).values(record);
  return record;
}

// Admin-only view — never expose the raw key value to non-admin callers.
export async function hasPriceApiKey(): Promise<boolean> {
  const settings = await getPriceSettings();
  return Boolean(settings.oandaApiKey && settings.oandaAccountId);
}

// Safe to send to the browser: never includes the raw key, only whether one is set + a masked preview.
export async function getPriceSettingsSafe() {
  const settings = await getPriceSettings();
  return {
    oandaAccountId: settings.oandaAccountId,
    oandaEnvironment: settings.oandaEnvironment,
    hasOandaApiKey: Boolean(settings.oandaApiKey),
    oandaApiKeyPreview: settings.oandaApiKey ? `••••${settings.oandaApiKey.slice(-4)}` : null,
  };
}

export function oandaApiHost(environment: string): string {
  return environment === "live" ? "https://api-fxtrade.oanda.com" : "https://api-fxpractice.oanda.com";
}

export function oandaStreamHost(environment: string): string {
  return environment === "live" ? "https://stream-fxtrade.oanda.com" : "https://stream-fxpractice.oanda.com";
}

export async function updatePriceSettings(raw: PriceSettingsInput) {
  const input = PriceSettingsSchema.parse(raw);
  const db = await getDb();

  await getPriceSettings(); // ensure the row exists before updating

  const patch: Partial<typeof priceSettings.$inferInsert> = {
    oandaAccountId: input.oandaAccountId,
    oandaEnvironment: input.oandaEnvironment,
    updatedAt: new Date().toISOString(),
  };
  if (input.clearOandaApiKey) {
    patch.oandaApiKey = null;
  } else if (input.oandaApiKey) {
    patch.oandaApiKey = input.oandaApiKey;
  }

  await db.update(priceSettings).set(patch).where(eq(priceSettings.id, SETTINGS_ID));
}
