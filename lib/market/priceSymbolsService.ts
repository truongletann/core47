import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { priceSymbols } from "@/db/schema";
import { PriceSymbolSchema, type PriceSymbolInput } from "./priceSymbolsSchema";

export async function listSymbolsAdmin() {
  const db = await getDb();
  const rows = await db.select().from(priceSymbols).orderBy(asc(priceSymbols.sortOrder));
  return rows.map((r) => ({ ...r, enabled: Boolean(r.enabled) }));
}

export async function listEnabledSymbols() {
  const db = await getDb();
  return db.select().from(priceSymbols).where(eq(priceSymbols.enabled, 1)).orderBy(asc(priceSymbols.sortOrder));
}

export async function createSymbol(raw: PriceSymbolInput) {
  const input = PriceSymbolSchema.parse(raw);
  const db = await getDb();

  const existing = await db.select().from(priceSymbols).where(eq(priceSymbols.symbol, input.symbol)).get();
  if (existing) throw new Error("SYMBOL_TAKEN");

  const record = {
    id: crypto.randomUUID(),
    symbol: input.symbol,
    label: input.label,
    unit: input.unit,
    enabled: input.enabled ? 1 : 0,
    sortOrder: input.sortOrder,
    lastPrice: null,
    lastChangePercent: null,
    lastFetchedAt: null,
    createdAt: new Date().toISOString(),
  };
  await db.insert(priceSymbols).values(record);
  return record;
}

export async function updateSymbol(id: string, raw: PriceSymbolInput) {
  const input = PriceSymbolSchema.parse(raw);
  const db = await getDb();

  const existing = await db.select().from(priceSymbols).where(eq(priceSymbols.symbol, input.symbol)).get();
  if (existing && existing.id !== id) throw new Error("SYMBOL_TAKEN");

  await db
    .update(priceSymbols)
    .set({
      symbol: input.symbol,
      label: input.label,
      unit: input.unit,
      enabled: input.enabled ? 1 : 0,
      sortOrder: input.sortOrder,
    })
    .where(eq(priceSymbols.id, id));
}

export async function deleteSymbol(id: string) {
  const db = await getDb();
  await db.delete(priceSymbols).where(eq(priceSymbols.id, id));
}
