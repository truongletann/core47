import { z } from "zod";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : null);
const nullableString = (max: number) =>
  z.string().trim().max(max).nullable().optional().transform(emptyToNull);

export const PortfolioAssetSchema = z
  .object({
    assetType: z.enum(["gold", "silver", "forex", "coffee", "pepper", "custom"]),
    customName: nullableString(80),
    unit: z.string().trim().min(1).max(40),
    currentPrice: z.coerce.number().nonnegative(),
  })
  .refine((v) => v.assetType !== "custom" || (v.customName && v.customName.length > 0), {
    message: "Custom asset name is required",
    path: ["customName"],
  });

export const UpdateCurrentPriceSchema = z.object({
  currentPrice: z.coerce.number().nonnegative(),
});

export const TransactionSchema = z.object({
  type: z.enum(["buy", "sell"]),
  quantity: z.coerce.number().positive(),
  pricePerUnit: z.coerce.number().nonnegative(),
  note: nullableString(300),
  txDate: z.string().trim().min(1).max(20),
});

export type PortfolioAssetInput = z.infer<typeof PortfolioAssetSchema>;
export type UpdateCurrentPriceInput = z.infer<typeof UpdateCurrentPriceSchema>;
export type TransactionInput = z.infer<typeof TransactionSchema>;
