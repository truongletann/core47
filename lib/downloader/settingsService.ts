import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { downloaderSettings } from "@/db/schema";
import { DownloaderSettingsSchema, type DownloaderSettingsInput } from "./settingsSchema";

const SETTINGS_ID = "default";

export async function getDownloaderSettings() {
  const db = await getDb();
  const existing = await db
    .select()
    .from(downloaderSettings)
    .where(eq(downloaderSettings.id, SETTINGS_ID))
    .get();
  if (existing) return existing;

  const record = { id: SETTINGS_ID, apiBaseUrl: null, apiKey: null, updatedAt: new Date().toISOString() };
  await db.insert(downloaderSettings).values(record);
  return record;
}

export async function isDownloaderConfigured(): Promise<boolean> {
  const settings = await getDownloaderSettings();
  return Boolean(settings.apiBaseUrl);
}

// Safe to send to the browser: never includes the raw key.
export async function getDownloaderSettingsSafe() {
  const settings = await getDownloaderSettings();
  return {
    apiBaseUrl: settings.apiBaseUrl,
    hasApiKey: Boolean(settings.apiKey),
    apiKeyPreview: settings.apiKey ? `••••${settings.apiKey.slice(-4)}` : null,
  };
}

export async function updateDownloaderSettings(raw: DownloaderSettingsInput) {
  const input = DownloaderSettingsSchema.parse(raw);
  const db = await getDb();

  await getDownloaderSettings(); // ensure the row exists

  const patch: Partial<typeof downloaderSettings.$inferInsert> = {
    apiBaseUrl: input.apiBaseUrl || null,
    updatedAt: new Date().toISOString(),
  };
  if (input.clearApiKey) {
    patch.apiKey = null;
  } else if (input.apiKey) {
    patch.apiKey = input.apiKey;
  }

  await db.update(downloaderSettings).set(patch).where(eq(downloaderSettings.id, SETTINGS_ID));
}
