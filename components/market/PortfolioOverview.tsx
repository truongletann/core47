import type { PortfolioOverview as PortfolioOverviewData } from "@/lib/market/portfolioCalc";

export function PortfolioOverview({ overview }: { overview: PortfolioOverviewData }) {
  const isProfit = overview.totalPnl >= 0;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-xl border border-[rgb(var(--border))] p-4">
        <p className="text-xs text-[rgb(var(--muted))]">Đã đầu tư</p>
        <p className="font-data mt-1 text-lg font-semibold">{overview.totalCostBasis.toLocaleString()}</p>
      </div>
      <div className="rounded-xl border border-[rgb(var(--border))] p-4">
        <p className="text-xs text-[rgb(var(--muted))]">Giá trị hiện tại</p>
        <p className="font-data mt-1 text-lg font-semibold">{overview.totalCurrentValue.toLocaleString()}</p>
      </div>
      <div className="rounded-xl border border-[rgb(var(--border))] p-4">
        <p className="text-xs text-[rgb(var(--muted))]">Lời/Lỗ tổng</p>
        <p className={`font-data mt-1 text-lg font-semibold ${isProfit ? "text-emerald-600" : "text-red-600"}`}>
          {isProfit ? "+" : ""}
          {overview.totalPnl.toLocaleString()}
        </p>
      </div>
      <div className="rounded-xl border border-[rgb(var(--border))] p-4">
        <p className="text-xs text-[rgb(var(--muted))]">Thắng / Thua</p>
        <p className="font-data mt-1 text-lg font-semibold">
          <span className="text-emerald-600">{overview.winningAssets}</span>
          {" / "}
          <span className="text-red-600">{overview.losingAssets}</span>
        </p>
      </div>
    </div>
  );
}
