import { z } from "zod";

export const PriceSymbolSchema = z.object({
  symbol: z.string().trim().min(1).max(20), // "XAU_USD" (OANDA) or "BTCUSDT" (Binance)
  source: z.enum(["oanda", "binance"]).default("oanda"),
  label: z.string().trim().min(1).max(40),
  unit: z.string().trim().max(20).optional().default(""), // e.g. "USD/oz", "" for plain FX pairs
  enabled: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
});

export type PriceSymbolInput = z.infer<typeof PriceSymbolSchema>;
