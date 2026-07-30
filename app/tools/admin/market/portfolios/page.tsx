import { listAllAssetsAdmin, listAllTransactionsAdmin } from "@/lib/market/portfolioService";
import { computeAssetPosition, computeAssetSummary } from "@/lib/market/portfolioCalc";

const ASSET_TYPE_LABEL: Record<string, string> = {
  gold: "Vàng",
  silver: "Bạc",
  forex: "Forex",
  coffee: "Cà phê",
  pepper: "Hồ tiêu",
  custom: "Khác",
};

export default async function AdminMarketPortfoliosPage() {
  const [assets, transactions] = await Promise.all([listAllAssetsAdmin(), listAllTransactionsAdmin()]);

  const txByAsset = new Map<string, typeof transactions>();
  for (const t of transactions) {
    const list = txByAsset.get(t.assetId) ?? [];
    list.push(t);
    txByAsset.set(t.assetId, list);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Market: Portfolios</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        Chỉ xem — {assets.length} asset(s) trên toàn bộ user. Không có quyền sửa/xoá thay người dùng.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Asset</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Avg cost</th>
              <th className="px-4 py-2">Current price</th>
              <th className="px-4 py-2">PnL</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  No portfolios yet.
                </td>
              </tr>
            ) : (
              assets.map((a) => {
                const position = computeAssetPosition(txByAsset.get(a.id) ?? []);
                const summary = computeAssetSummary(a.currentPrice, position);
                const isProfit = summary.totalPnl >= 0;
                return (
                  <tr key={a.id} className="border-b border-[rgb(var(--border))] last:border-0">
                    <td className="px-4 py-2 text-xs">{a.ownerName ?? a.ownerEmail ?? a.userId.slice(0, 8)}</td>
                    <td className="px-4 py-2">{a.assetType === "custom" ? a.customName : ASSET_TYPE_LABEL[a.assetType]}</td>
                    <td className="font-data px-4 py-2 text-xs">
                      {summary.qty} {a.unit}
                    </td>
                    <td className="font-data px-4 py-2 text-xs">{summary.avgCost.toLocaleString()}</td>
                    <td className="font-data px-4 py-2 text-xs">{a.currentPrice.toLocaleString()}</td>
                    <td
                      className={`font-data px-4 py-2 text-xs font-semibold ${
                        isProfit ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {isProfit ? "+" : ""}
                      {summary.totalPnl.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
