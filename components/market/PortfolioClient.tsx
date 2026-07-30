"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { PortfolioOverview } from "./PortfolioOverview";
import {
  computeAssetPosition,
  computeAssetSummary,
  computePortfolioOverview,
  type AssetSummary,
} from "@/lib/market/portfolioCalc";

type AssetType = "gold" | "silver" | "forex" | "coffee" | "pepper" | "custom";

interface Asset {
  id: string;
  assetType: AssetType;
  customName: string | null;
  unit: string;
  currentPrice: number;
}

interface Transaction {
  id: string;
  assetId: string;
  type: "buy" | "sell";
  quantity: number;
  pricePerUnit: number;
  note: string | null;
  txDate: string;
}

interface ApiResult {
  success: boolean;
  error?: string;
  issues?: { path: string; message: string }[];
  message?: string;
}

const ASSET_TYPE_LABEL: Record<AssetType, string> = {
  gold: "Vàng",
  silver: "Bạc",
  forex: "Forex",
  coffee: "Cà phê",
  pepper: "Hồ tiêu",
  custom: "Khác",
};

const emptyAssetForm = { assetType: "gold" as AssetType, customName: "", unit: "", currentPrice: "0" };
type AssetFormState = typeof emptyAssetForm;

const emptyTxForm = {
  type: "buy" as "buy" | "sell",
  quantity: "",
  pricePerUnit: "",
  txDate: new Date().toISOString().slice(0, 10),
  note: "",
};
type TxFormState = typeof emptyTxForm;

function errorMessage(json: ApiResult) {
  if (json.error === "INVALID_INPUT" && json.issues?.length) {
    return json.issues.map((i) => `${i.path}: ${i.message}`).join(" · ");
  }
  if (json.error === "SERVER_ERROR" && json.message) return `Server error: ${json.message}`;
  return "Something went wrong.";
}

function AssetForm({ form, setForm }: { form: AssetFormState; setForm: (f: AssetFormState) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Loại tài sản</span>
        <select
          value={form.assetType}
          onChange={(e) => setForm({ ...form, assetType: e.target.value as AssetType })}
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        >
          {Object.entries(ASSET_TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {form.assetType === "custom" && (
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Tên tài sản</span>
          <input
            value={form.customName}
            onChange={(e) => setForm({ ...form, customName: e.target.value })}
            placeholder="vd: Bất động sản"
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
      )}
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Đơn vị</span>
          <input
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            placeholder="lượng, ounce, kg..."
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Giá hiện tại</span>
          <input
            type="number"
            value={form.currentPrice}
            onChange={(e) => setForm({ ...form, currentPrice: e.target.value })}
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>
    </div>
  );
}

function TransactionForm({ form, setForm }: { form: TxFormState; setForm: (f: TxFormState) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Loại</span>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as "buy" | "sell" })}
            className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          >
            <option value="buy">Mua</option>
            <option value="sell">Bán</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Ngày</span>
          <input
            type="date"
            value={form.txDate}
            onChange={(e) => setForm({ ...form, txDate: e.target.value })}
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Số lượng</span>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[rgb(var(--muted))]">Giá / đơn vị</span>
          <input
            type="number"
            value={form.pricePerUnit}
            onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
            className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Ghi chú (tuỳ chọn)</span>
        <input
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
    </div>
  );
}

export function PortfolioClient() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [txByAsset, setTxByAsset] = useState<Record<string, Transaction[]>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [creatingAsset, setCreatingAsset] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);
  const [assetForm, setAssetForm] = useState<AssetFormState>(emptyAssetForm);
  const [txForm, setTxForm] = useState<TxFormState>(emptyTxForm);
  const [addingTxFor, setAddingTxFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingPriceFor, setEditingPriceFor] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/market/portfolio/assets", { credentials: "include" });
      const json = (await res.json()) as { data?: { assets?: Asset[] } };
      const list = json?.data?.assets ?? [];
      setAssets(list);

      const entries = await Promise.all(
        list.map(async (a) => {
          const r = await fetch(`/api/market/portfolio/assets/${a.id}/transactions`, {
            credentials: "include",
          });
          const j = (await r.json()) as { data?: { transactions?: Transaction[] } };
          return [a.id, j?.data?.transactions ?? []] as const;
        }),
      );
      setTxByAsset(Object.fromEntries(entries));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreateAsset() {
    setAssetForm(emptyAssetForm);
    setError(null);
    setCreatingAsset(true);
  }

  function openEditAsset(a: Asset) {
    setAssetForm({
      assetType: a.assetType,
      customName: a.customName ?? "",
      unit: a.unit,
      currentPrice: String(a.currentPrice),
    });
    setError(null);
    setEditingAsset(a);
  }

  async function handleCreateAsset() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/market/portfolio/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetForm),
        credentials: "include",
      });
      const json = (await res.json()) as ApiResult;
      if (!json.success) {
        setError(errorMessage(json));
        return;
      }
      setCreatingAsset(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateAsset() {
    if (!editingAsset) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/market/portfolio/assets/${editingAsset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetForm),
        credentials: "include",
      });
      const json = (await res.json()) as ApiResult;
      if (!json.success) {
        setError(errorMessage(json));
        return;
      }
      setEditingAsset(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAsset() {
    if (!deleteTarget) return;
    await fetch(`/api/market/portfolio/assets/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleteTarget(null);
    load();
  }

  function openAddTx(assetId: string) {
    setTxForm({ ...emptyTxForm, txDate: new Date().toISOString().slice(0, 10) });
    setError(null);
    setAddingTxFor(assetId);
  }

  async function handleCreateTx() {
    if (!addingTxFor) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/market/portfolio/assets/${addingTxFor}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txForm),
        credentials: "include",
      });
      const json = (await res.json()) as ApiResult;
      if (!json.success) {
        setError(errorMessage(json));
        return;
      }
      setAddingTxFor(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTx(id: string) {
    await fetch(`/api/market/portfolio/transactions/${id}`, { method: "DELETE", credentials: "include" });
    load();
  }

  function openEditPrice(a: Asset) {
    setEditingPriceFor(a.id);
    setPriceDraft(String(a.currentPrice));
  }

  async function handleSavePrice(assetId: string) {
    await fetch(`/api/market/portfolio/assets/${assetId}/price`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPrice: priceDraft }),
      credentials: "include",
    });
    setEditingPriceFor(null);
    load();
  }

  const summaries: Record<string, AssetSummary> = {};
  for (const a of assets) {
    const position = computeAssetPosition(txByAsset[a.id] ?? []);
    summaries[a.id] = computeAssetSummary(a.currentPrice, position);
  }
  const overview = computePortfolioOverview(Object.values(summaries));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Portfolio</h1>
        <button
          onClick={openCreateAsset}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add asset
        </button>
      </div>

      {!loading && assets.length > 0 && <PortfolioOverview overview={overview} />}

      <div className="mt-6 flex flex-col gap-3">
        {loading ? (
          <p className="text-sm text-[rgb(var(--muted))]">Loading...</p>
        ) : assets.length === 0 ? (
          <p className="text-sm text-[rgb(var(--muted))]">
            Chưa có tài sản nào. Bấm &quot;+ Add asset&quot; để bắt đầu.
          </p>
        ) : (
          assets.map((a) => {
            const s = summaries[a.id];
            const isProfit = s.totalPnl >= 0;
            return (
              <div key={a.id} className="rounded-xl border border-[rgb(var(--border))]">
                <button
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {a.assetType === "custom" ? a.customName : ASSET_TYPE_LABEL[a.assetType]}
                    </p>
                    <p className="font-data text-xs text-[rgb(var(--muted))]">
                      {s.qty} {a.unit} · avg cost {s.avgCost.toLocaleString()} · giá hiện tại{" "}
                      {a.currentPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-data text-sm font-semibold ${
                        isProfit ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {isProfit ? "+" : ""}
                      {s.totalPnl.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[rgb(var(--muted))]">
                      unrealized {s.unrealizedPnl.toLocaleString()} · realized {s.realizedPnl.toLocaleString()}
                    </p>
                  </div>
                </button>

                {expanded === a.id && (
                  <div className="border-t border-[rgb(var(--border))] px-4 py-3">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {editingPriceFor === a.id ? (
                        <>
                          <input
                            type="number"
                            value={priceDraft}
                            onChange={(e) => setPriceDraft(e.target.value)}
                            className="font-data w-32 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-1 text-xs outline-none"
                          />
                          <button
                            onClick={() => handleSavePrice(a.id)}
                            className="rounded-md bg-[rgb(var(--accent))] px-2 py-1 text-xs font-semibold text-white"
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openEditPrice(a)}
                          className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                        >
                          Update current price
                        </button>
                      )}
                      <button
                        onClick={() => openAddTx(a.id)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                      >
                        + Add transaction
                      </button>
                      <button
                        onClick={() => openEditAsset(a)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(a)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>

                    {(txByAsset[a.id] ?? []).length === 0 ? (
                      <p className="text-xs text-[rgb(var(--muted))]">Chưa có giao dịch nào.</p>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[rgb(var(--muted))]">
                            <th className="py-1 pr-2">Ngày</th>
                            <th className="py-1 pr-2">Loại</th>
                            <th className="py-1 pr-2">SL</th>
                            <th className="py-1 pr-2">Giá</th>
                            <th className="py-1 pr-2">Ghi chú</th>
                            <th className="py-1 pr-2" />
                          </tr>
                        </thead>
                        <tbody>
                          {(txByAsset[a.id] ?? []).map((t) => (
                            <tr key={t.id} className="border-t border-[rgb(var(--border))]">
                              <td className="font-data py-1.5 pr-2">{t.txDate}</td>
                              <td className="py-1.5 pr-2">{t.type === "buy" ? "Mua" : "Bán"}</td>
                              <td className="font-data py-1.5 pr-2">{t.quantity}</td>
                              <td className="font-data py-1.5 pr-2">{t.pricePerUnit.toLocaleString()}</td>
                              <td className="py-1.5 pr-2 text-[rgb(var(--muted))]">{t.note ?? "—"}</td>
                              <td className="py-1.5">
                                <button onClick={() => handleDeleteTx(t.id)} className="text-red-600 hover:opacity-80">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {creatingAsset && (
        <Modal title="Add asset" onClose={() => setCreatingAsset(false)}>
          <AssetForm form={assetForm} setForm={setAssetForm} />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleCreateAsset}
            disabled={saving || !assetForm.unit}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </Modal>
      )}

      {editingAsset && (
        <Modal title="Edit asset" onClose={() => setEditingAsset(null)}>
          <AssetForm form={assetForm} setForm={setAssetForm} />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleUpdateAsset}
            disabled={saving}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </Modal>
      )}

      {addingTxFor && (
        <Modal title="Add transaction" onClose={() => setAddingTxFor(null)}>
          <TransactionForm form={txForm} setForm={setTxForm} />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleCreateTx}
            disabled={saving || !txForm.quantity || !txForm.pricePerUnit}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add"}
          </button>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete asset" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Delete{" "}
            <strong>
              {deleteTarget.assetType === "custom"
                ? deleteTarget.customName
                : ASSET_TYPE_LABEL[deleteTarget.assetType]}
            </strong>
            ? Toàn bộ giao dịch của tài sản này cũng sẽ bị xoá. Không thể hoàn tác.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-sm hover:bg-[rgb(var(--border)/0.5)]"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAsset}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
