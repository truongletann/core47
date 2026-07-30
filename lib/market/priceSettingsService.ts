import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { priceSettings } from "@/db/schema";
import { PriceSettingsSchema, type PriceSettingsInput } from "./priceSettingsSchema";

const SETTINGS_ID = "default";

export async function getPriceSettings() {
  const db = await getDb();
  const existing = await db.select().from(priceSettings).where(eq(priceSettings.id, SETTINGS_ID)).get();
  if (existing) return existing;

  const record = { id: SETTINGS_ID, twelveDataApiKey: null, updatedAt: new Date().toISOString() };
  await db.insert(priceSettings).values(record);
  return record;
}

// Admin-only view — never expose the raw key value to non-admin callers.
export async function hasPriceApiKey(): Promise<boolean> {
  const settings = await getPriceSettings();
  return Boolean(settings.twelveDataApiKey);
}

export async function updatePriceSettings(raw: PriceSettingsInput) {
  const input = PriceSettingsSchema.parse(raw);
  const db = await getDb();

  await getPriceSettings(); // ensure the row exists before updating
  await db
    .update(priceSettings)
    .set({ twelveDataApiKey: input.twelveDataApiKey, updatedAt: new Date().toISOString() })
    .where(eq(priceSettings.id, SETTINGS_ID));
}
