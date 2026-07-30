"use client";

import { useEffect, useRef, useState } from "react";
import { searchBinanceInstruments } from "@/lib/market/binanceClient";

type Source = "oanda" | "binance";

interface PriceItem {
  id: string;
  symbol: string;
  source: Source;
  label: string;
  unit: string;
  lastPrice: number | null;
  lastChangePercent: number | null;
}

interface ExtraSymbol {
  symbol: string;
  source: Source;
  label: string;
}

interface Instrument {
  symbol: string;
  displayName: string;
  type: string;
  source: Source;
}

interface OandaStreamTick {
  type?: string;
  instrument?: string;
  closeoutBid?: string;
  closeoutAsk?: string;
}

interface BinanceStreamMessage {
  data?: { s?: string; c?: string; P?: string };
}

const MAX_EXTRA_SYMBOLS = 10;
const EXTRA_SYMBOLS_KEY = "market:prices:extraSymbols";

function formatPrice(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: value < 10 ? 4 : 2 });
}

function AddSymbolBox({
  existingSymbols,
  onAdd,
  disabled,
}: {
  existingSymbols: string[];
  onAdd: (s: ExtraSymbol) => void;
  disabled: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Instrument[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const q = query.trim();
      Promise.all([
        fetch(`/api/market/instruments?q=${encodeURIComponent(q)}`)
          .then((r) => r.json() as Promise<{ data?: { instruments?: Instrument[] } }>)
          .then((json) => json?.data?.instruments ?? [])
          .catch(() => []),
        searchBinanceInstruments(q).then((list) =>
          list.map((i) => ({ ...i, type: "CRYPTO", source: "binance" as const })),
        ),
      ]).then(([oanda, binance]) => {
        setResults([...oanda, ...binance]);
        setOpen(true);
      });
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleSelect(instrument: Instrument) {
    onAdd({ symbol: instrument.symbol, source: instrument.source, label: instrument.displayName });
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="relative max-w-xs">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        disabled={disabled}
        placeholder="Tìm mã (VD: silver, btc, USD_CAD...)"
        className="font-data w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none disabled:opacity-50"
      />
      {open && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-lg">
          {results.map((r) => (
            <button
              key={`${r.source}-${r.symbol}`}
              type="button"
              onMouseDown={() => handleSelect(r)}
              disabled={existingSymbols.includes(r.symbol)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-[rgb(var(--border)/0.4)] disabled:opacity-40"
            >
              <span className="font-data">{r.symbol}</span>
              <span className="text-xs text-[rgb(var(--muted))]">
                {r.displayName} · {r.source === "binance" ? "Binance" : "OANDA"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LivePrices({ initial }: { initial: PriceItem[] }) {
  const [extra, setExtra] = useState<ExtraSymbol[]>([]);
  const [prices, setPrices] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(initial.map((p) => [p.symbol, p.lastPrice])),
  );
  const [changePercents, setChangePercents] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(initial.map((p) => [p.symbol, p.lastChangePercent])),
  );
  const [oandaLive, setOandaLive] = useState(false);
  const [binanceLive, setBinanceLive] = useState(false);

  // Session-only: survives a refresh but never written to the server, so it
  // disappears for good once the tab/browser storage is gone.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(EXTRA_SYMBOLS_KEY);
      if (raw) setExtra(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(EXTRA_SYMBOLS_KEY, JSON.stringify(extra));
    } catch {
      // ignore
    }
  }, [extra]);

  const allItems = [
    ...initial.map((p) => ({ symbol: p.symbol, source: p.source })),
    ...extra.map((e) => ({ symbol: e.symbol, source: e.source })),
  ];
  const allSymbols = allItems.map((i) => i.symbol);
  const oandaSymbols = allItems.filter((i) => i.source === "oanda").map((i) => i.symbol);
  const binanceSymbols = allItems.filter((i) => i.source === "binance").map((i) => i.symbol);
  const oandaKey = oandaSymbols.join(",");
  const binanceKey = binanceSymbols.join(",");

  useEffect(() => {
    if (oandaSymbols.length === 0) {
      setOandaLive(false);
      return;
    }

    const es = new EventSource(`/api/market/prices/stream?instruments=${encodeURIComponent(oandaKey)}`);
    es.onopen = () => setOandaLive(true);
    es.onerror = () => setOandaLive(false);
    es.onmessage = (ev) => {
      try {
        const tick = JSON.parse(ev.data) as OandaStreamTick;
        if (tick.type !== "PRICE" || !tick.instrument || !tick.closeoutBid || !tick.closeoutAsk) return;
        const mid = (Number(tick.closeoutBid) + Number(tick.closeoutAsk)) / 2;
        setPrices((prev) => ({ ...prev, [tick.instrument!]: mid }));
      } catch {
        // ignore malformed/heartbeat lines
      }
    };

    return () => es.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oandaKey]);

  useEffect(() => {
    if (binanceSymbols.length === 0) {
      setBinanceLive(false);
      return;
    }

    // Binance's public market-data stream — no key needed, connected
    // directly from the browser (no server proxy involved).
    const streams = binanceSymbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
    ws.onopen = () => setBinanceLive(true);
    ws.onerror = () => setBinanceLive(false);
    ws.onclose = () => setBinanceLive(false);
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as BinanceStreamMessage;
        const symbol = msg.data?.s;
        if (!symbol || !msg.data?.c) return;
        setPrices((prev) => ({ ...prev, [symbol]: Number(msg.data!.c) }));
        if (msg.data?.P) {
          setChangePercents((prev) => ({ ...prev, [symbol]: Number(msg.data!.P) }));
        }
      } catch {
        // ignore malformed messages
      }
    };

    return () => ws.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [binanceKey]);

  function handleAdd(s: ExtraSymbol) {
    setExtra((prev) => (prev.some((p) => p.symbol === s.symbol) ? prev : [...prev, s].slice(0, MAX_EXTRA_SYMBOLS)));
  }

  function handleRemove(symbol: string) {
    setExtra((prev) => prev.filter((p) => p.symbol !== symbol));
    setPrices((prev) => {
      const next = { ...prev };
      delete next[symbol];
      return next;
    });
    setChangePercents((prev) => {
      const next = { ...prev };
      delete next[symbol];
      return next;
    });
  }

  const items: (PriceItem & { removable?: boolean })[] = [
    ...initial,
    ...extra.map((e) => ({
      id: `extra-${e.symbol}`,
      symbol: e.symbol,
      source: e.source,
      label: e.label,
      unit: "",
      lastPrice: null,
      lastChangePercent: null,
      removable: true,
    })),
  ];

  const liveLabels: string[] = [];
  if (oandaSymbols.length > 0) liveLabels.push(oandaLive ? "● Live (OANDA)" : "○ Đang kết nối OANDA...");
  if (binanceSymbols.length > 0) liveLabels.push(binanceLive ? "● Live (Binance)" : "○ Đang kết nối Binance...");

  return (
    <div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <p className="font-data text-xs text-[rgb(var(--muted))]">{liveLabels.join(" · ")}</p>
        <AddSymbolBox
          existingSymbols={allSymbols}
          onAdd={handleAdd}
          disabled={extra.length >= MAX_EXTRA_SYMBOLS}
        />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const price = prices[p.symbol];
          const changePct = changePercents[p.symbol] ?? null;
          const isUp = changePct !== null && changePct >= 0;
          return (
            <div key={p.id} className="relative rounded-xl border border-[rgb(var(--border))] p-4">
              {p.removable && (
                <button
                  type="button"
                  onClick={() => handleRemove(p.symbol)}
                  aria-label={`Bỏ theo dõi ${p.symbol}`}
                  className="absolute right-2 top-2 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                >
                  ✕
                </button>
              )}
              <div className="flex items-center justify-between">
                <span className="font-data text-xs text-[rgb(var(--muted))]">{p.symbol}</span>
                {changePct !== null && (
                  <span
                    className={`font-data text-xs font-semibold ${isUp ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {isUp ? "+" : ""}
                    {changePct.toFixed(2)}%
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-medium">{p.label}</p>
              <p className="font-data mt-1 text-lg font-semibold">
                {price !== null && price !== undefined ? formatPrice(price) : "—"}
              </p>
              {p.unit && <p className="text-xs text-[rgb(var(--muted))]">{p.unit}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
