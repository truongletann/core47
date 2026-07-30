export interface Transaction {
  type: "buy" | "sell";
  quantity: number;
  pricePerUnit: number;
  txDate: string;
}

export interface AssetPosition {
  qty: number;
  avgCost: number;
  realizedPnl: number;
}

// Weighted-average cost basis: buys pull the average cost toward the buy
// price; sells realize PnL against the current average but never move it.
export function computeAssetPosition(transactions: Transaction[]): AssetPosition {
  const sorted = [...transactions].sort((a, b) => a.txDate.localeCompare(b.txDate));

  let qty = 0;
  let avgCost = 0;
  let realizedPnl = 0;

  for (const tx of sorted) {
    if (tx.type === "buy") {
      const newQty = qty + tx.quantity;
      avgCost = newQty > 0 ? (qty * avgCost + tx.quantity * tx.pricePerUnit) / newQty : 0;
      qty = newQty;
    } else {
      realizedPnl += tx.quantity * (tx.pricePerUnit - avgCost);
      qty -= tx.quantity;
    }
  }

  return { qty, avgCost, realizedPnl };
}

export interface AssetSummary {
  qty: number;
  avgCost: number;
  costBasis: number;
  currentValue: number;
  realizedPnl: number;
  unrealizedPnl: number;
  totalPnl: number;
}

export function computeAssetSummary(currentPrice: number, position: AssetPosition): AssetSummary {
  const costBasis = position.qty * position.avgCost;
  const currentValue = position.qty * currentPrice;
  const unrealizedPnl = currentValue - costBasis;
  return {
    qty: position.qty,
    avgCost: position.avgCost,
    costBasis,
    currentValue,
    realizedPnl: position.realizedPnl,
    unrealizedPnl,
    totalPnl: unrealizedPnl + position.realizedPnl,
  };
}

export interface PortfolioOverview {
  totalCostBasis: number;
  totalCurrentValue: number;
  totalRealizedPnl: number;
  totalUnrealizedPnl: number;
  totalPnl: number;
  winningAssets: number;
  losingAssets: number;
}

export function computePortfolioOverview(summaries: AssetSummary[]): PortfolioOverview {
  let totalCostBasis = 0;
  let totalCurrentValue = 0;
  let totalRealizedPnl = 0;
  let totalUnrealizedPnl = 0;
  let winningAssets = 0;
  let losingAssets = 0;

  for (const s of summaries) {
    totalCostBasis += s.costBasis;
    totalCurrentValue += s.currentValue;
    totalRealizedPnl += s.realizedPnl;
    totalUnrealizedPnl += s.unrealizedPnl;
    if (s.totalPnl > 0) winningAssets++;
    else if (s.totalPnl < 0) losingAssets++;
  }

  return {
    totalCostBasis,
    totalCurrentValue,
    totalRealizedPnl,
    totalUnrealizedPnl,
    totalPnl: totalUnrealizedPnl + totalRealizedPnl,
    winningAssets,
    losingAssets,
  };
}
