import { eq, and, asc, desc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { portfolioAssets, portfolioTransactions, users } from "@/db/schema";
import {
  PortfolioAssetSchema,
  UpdateCurrentPriceSchema,
  TransactionSchema,
  type PortfolioAssetInput,
  type UpdateCurrentPriceInput,
  type TransactionInput,
} from "./portfolioSchema";

function toAsset(r: typeof portfolioAssets.$inferSelect) {
  return { ...r };
}

function toTransaction(r: typeof portfolioTransactions.$inferSelect) {
  return { ...r };
}

export async function listAssets(userId: string) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(portfolioAssets)
    .where(eq(portfolioAssets.userId, userId))
    .orderBy(desc(portfolioAssets.createdAt));
  return rows.map(toAsset);
}

export async function getAsset(userId: string, id: string) {
  const db = await getDb();
  const row = await db
    .select()
    .from(portfolioAssets)
    .where(and(eq(portfolioAssets.id, id), eq(portfolioAssets.userId, userId)))
    .get();
  return row ? toAsset(row) : null;
}

export async function createAsset(userId: string, raw: PortfolioAssetInput) {
  const input = PortfolioAssetSchema.parse(raw);
  const db = await getDb();

  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    userId,
    assetType: input.assetType,
    customName: input.customName,
    unit: input.unit,
    currentPrice: input.currentPrice,
    currentPriceUpdatedAt: now,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(portfolioAssets).values(record);
  return record;
}

export async function updateAsset(userId: string, id: string, raw: PortfolioAssetInput) {
  const input = PortfolioAssetSchema.parse(raw);
  const db = await getDb();

  const existing = await getAsset(userId, id);
  if (!existing) throw new Error("ASSET_NOT_FOUND");

  await db
    .update(portfolioAssets)
    .set({
      assetType: input.assetType,
      customName: input.customName,
      unit: input.unit,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(portfolioAssets.id, id), eq(portfolioAssets.userId, userId)));
}

export async function updateCurrentPrice(userId: string, id: string, raw: UpdateCurrentPriceInput) {
  const input = UpdateCurrentPriceSchema.parse(raw);
  const db = await getDb();

  const existing = await getAsset(userId, id);
  if (!existing) throw new Error("ASSET_NOT_FOUND");

  await db
    .update(portfolioAssets)
    .set({ currentPrice: input.currentPrice, currentPriceUpdatedAt: new Date().toISOString() })
    .where(and(eq(portfolioAssets.id, id), eq(portfolioAssets.userId, userId)));
}

export async function deleteAsset(userId: string, id: string) {
  const db = await getDb();

  const existing = await getAsset(userId, id);
  if (!existing) throw new Error("ASSET_NOT_FOUND");

  await db
    .delete(portfolioTransactions)
    .where(and(eq(portfolioTransactions.assetId, id), eq(portfolioTransactions.userId, userId)));
  await db.delete(portfolioAssets).where(and(eq(portfolioAssets.id, id), eq(portfolioAssets.userId, userId)));
}

export async function listTransactions(userId: string, assetId: string) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(portfolioTransactions)
    .where(and(eq(portfolioTransactions.assetId, assetId), eq(portfolioTransactions.userId, userId)))
    .orderBy(asc(portfolioTransactions.txDate));
  return rows.map(toTransaction);
}

export async function createTransaction(userId: string, assetId: string, raw: TransactionInput) {
  const input = TransactionSchema.parse(raw);
  const db = await getDb();

  const asset = await getAsset(userId, assetId);
  if (!asset) throw new Error("ASSET_NOT_FOUND");

  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    assetId,
    userId,
    type: input.type,
    quantity: input.quantity,
    pricePerUnit: input.pricePerUnit,
    note: input.note,
    txDate: input.txDate,
    createdAt: now,
  };
  await db.insert(portfolioTransactions).values(record);
  return record;
}

export async function deleteTransaction(userId: string, id: string) {
  const db = await getDb();
  await db
    .delete(portfolioTransactions)
    .where(and(eq(portfolioTransactions.id, id), eq(portfolioTransactions.userId, userId)));
}

// Admin read-only: every asset across every user, joined with the owner's
// name/email so the admin table can show whose portfolio it is.
export async function listAllAssetsAdmin() {
  const db = await getDb();
  const rows = await db
    .select({
      asset: portfolioAssets,
      ownerName: users.name,
      ownerEmail: users.email,
    })
    .from(portfolioAssets)
    .leftJoin(users, eq(portfolioAssets.userId, users.id))
    .orderBy(desc(portfolioAssets.createdAt));

  return rows.map((r) => ({ ...toAsset(r.asset), ownerName: r.ownerName, ownerEmail: r.ownerEmail }));
}

export async function listTransactionsForAssetAdmin(assetId: string) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(portfolioTransactions)
    .where(eq(portfolioTransactions.assetId, assetId))
    .orderBy(asc(portfolioTransactions.txDate));
  return rows.map(toTransaction);
}

// Every transaction across every user — small dataset, used by the
// admin read-only portfolios view to compute each asset's DCA/PnL in bulk
// instead of one query per asset.
export async function listAllTransactionsAdmin() {
  const db = await getDb();
  const rows = await db.select().from(portfolioTransactions).orderBy(asc(portfolioTransactions.txDate));
  return rows.map(toTransaction);
}
