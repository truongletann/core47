"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { searchBinanceInstruments } from "@/lib/market/binanceClient";

type Source = "oanda" | "binance";

interface PriceSymbol {
  id: string;
  symbol: string;
  source: Source;
  label: string;
  unit: string;
  enabled: boolean;
  sortOrder: number;
  lastPrice: number | null;
  lastChangePercent: number | null;
}

interface Instrument {
  symbol: string;
  displayName: string;
  type: string;
  source: Source;
}

const emptyForm = { symbol: "", source: "oanda" as Source, label: "", unit: "", enabled: true, sortOrder: "0" };
type FormState = typeof emptyForm;

function SymbolForm({
  form,
  setForm,
  instruments,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  instruments: Instrument[];
}) {
  function handleSymbolChange(value: string) {
    const match = instruments.find((i) => i.symbol === value);
    setForm({
      ...form,
      symbol: value,
      source: match?.source ?? form.source,
      label: match && !form.label ? match.displayName : form.label,
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Symbol (OANDA hoặc Binance format)</span>
        <input
          value={form.symbol}
          onChange={(e) => handleSymbolChange(e.target.value)}
          placeholder="XAU_USD hoặc BTCUSDT"
          list="market-instruments"
          className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
        <datalist id="market-instruments">
          {instruments.map((i) => (
            <option key={`${i.source}-${i.symbol}`} value={i.symbol}>
              {i.displayName} ({i.source})
            </option>
          ))}
        </datalist>
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Nguồn</span>
        <select
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value as Source })}
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        >
          <option value="oanda">OANDA (forex/kim loại/hàng hóa)</option>
          <option value="binance">Binance (crypto)</option>
        </select>
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Label</span>
        <input
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="Gold"
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-[rgb(var(--muted))]">Unit (optional)</span>
        <input
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          placeholder="USD/oz"
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
        />
        <span>Enabled</span>
      </label>
    </div>
  );
}

export default function AdminMarketPriceSymbolsPage() {
  const [symbols, setSymbols] = useState<PriceSymbol[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<PriceSymbol | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PriceSymbol | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  function load() {
    setLoading(true);
    fetch("/api/admin/market/price-symbols", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { symbols?: PriceSymbol[] } }>)
      .then((json) => setSymbols(json?.data?.symbols ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    Promise.all([
      fetch("/api/market/instruments")
        .then((r) => r.json() as Promise<{ data?: { instruments?: Instrument[] } }>)
        .then((json) => json?.data?.instruments ?? [])
        .catch(() => []),
      searchBinanceInstruments().then((list) =>
        list.map((i) => ({ ...i, type: "CRYPTO", source: "binance" as const })),
      ),
    ]).then(([oanda, binance]) => setInstruments([...oanda, ...binance]));
  }, []);

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    const nextOrder = symbols.length > 0 ? Math.max(...symbols.map((s) => s.sortOrder)) + 1 : 0;
    setForm({ ...emptyForm, sortOrder: String(nextOrder) });
    setError(null);
    setCreating(true);
  }

  function openEdit(s: PriceSymbol) {
    setForm({
      symbol: s.symbol,
      source: s.source,
      label: s.label,
      unit: s.unit,
      enabled: s.enabled,
      sortOrder: String(s.sortOrder),
    });
    setError(null);
    setEditing(s);
  }

  function errorMessage(json: {
    error?: string;
    issues?: { path: string; message: string }[];
    message?: string;
  }) {
    if (json.error === "SYMBOL_TAKEN") return "This symbol is already added.";
    if (json.error === "INVALID_INPUT" && json.issues?.length) {
      return json.issues.map((i) => `${i.path}: ${i.message}`).join(" · ");
    }
    if (json.error === "SERVER_ERROR" && json.message) return `Server error: ${json.message}`;
    return "Something went wrong.";
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/market/price-symbols", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        issues?: { path: string; message: string }[];
        message?: string;
      };
      if (!json.success) {
        setError(errorMessage(json));
        return;
      }
      setCreating(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/market/price-symbols/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        issues?: { path: string; message: string }[];
        message?: string;
      };
      if (!json.success) {
        setError(errorMessage(json));
        return;
      }
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleEnabled(s: PriceSymbol) {
    setTogglingId(s.id);
    try {
      await fetch(`/api/admin/market/price-symbols/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: s.symbol,
          source: s.source,
          label: s.label,
          unit: s.unit,
          enabled: !s.enabled,
          sortOrder: s.sortOrder,
        }),
        credentials: "include",
      });
      setSymbols((prev) => prev.map((x) => (x.id === s.id ? { ...x, enabled: !x.enabled } : x)));
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/admin/market/price-symbols/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Market: Price Symbols</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add symbol
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Source</th>
              <th className="px-4 py-2">Label</th>
              <th className="px-4 py-2">Unit</th>
              <th className="px-4 py-2">Last price</th>
              <th className="px-4 py-2">Enabled</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  Loading...
                </td>
              </tr>
            ) : symbols.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[rgb(var(--muted))]">
                  No symbols yet.
                </td>
              </tr>
            ) : (
              symbols.map((s) => (
                <tr key={s.id} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="font-data px-4 py-2">{s.symbol}</td>
                  <td className="px-4 py-2 text-xs">{s.source}</td>
                  <td className="px-4 py-2 text-xs">{s.label}</td>
                  <td className="px-4 py-2 text-xs">{s.unit || "—"}</td>
                  <td className="font-data px-4 py-2 text-xs">
                    {s.lastPrice !== null ? s.lastPrice.toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleToggleEnabled(s)}
                      disabled={togglingId === s.id}
                      className={`relative h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${
                        s.enabled ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--border))]"
                      }`}
                      aria-label={s.enabled ? "Disable symbol" : "Enable symbol"}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                          s.enabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs hover:bg-[rgb(var(--border)/0.5)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="rounded-md border border-[rgb(var(--border))] px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {creating && (
        <Modal title="Add symbol" onClose={() => setCreating(false)}>
          <SymbolForm form={form} setForm={setForm} instruments={instruments} />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={saving || !form.symbol || !form.label}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit: ${editing.label}`} onClose={() => setEditing(null)}>
          <SymbolForm form={form} setForm={setForm} instruments={instruments} />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="mt-3 w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete symbol" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm">
            Delete <strong>{deleteTarget.label}</strong> ({deleteTarget.symbol})?
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-md border border-[rgb(var(--border))] px-3 py-1.5 text-sm hover:bg-[rgb(var(--border)/0.5)]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
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
