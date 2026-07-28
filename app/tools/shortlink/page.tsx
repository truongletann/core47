"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check, Zap, ShieldCheck, BarChart3 } from "lucide-react";
import { SHORT_DOMAIN } from "@/lib/shortlink/config";

interface HistoryLink {
  code: string;
  targetUrl: string;
  clicks: number;
  createdAt: string;
  creatorEmail: string | null;
}

// Mock data — DECORATIVE ONLY, not wired to real analytics yet.
const CHART_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CLICKS_SERIES = [18, 24, 20, 22, 30, 26, 21];
const UNIQUE_SERIES = [12, 15, 13, 18, 22, 20, 16];

function toPoints(series: number[], width: number, height: number, max: number) {
  return series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * width;
      const y = height - (v / max) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function ShortlinkPage() {
  const [url, setUrl] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [result, setResult] = useState<{ shortUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [historyLinks, setHistoryLinks] = useState<HistoryLink[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/shortlink/my", { credentials: "include" })
      .then(
        (r) =>
          r.json() as Promise<{
            data?: { loggedIn?: boolean; isAdmin?: boolean; links?: HistoryLink[] };
          }>,
      )
      .then((json) => {
        setLoggedIn(Boolean(json?.data?.loggedIn));
        setIsAdmin(Boolean(json?.data?.isAdmin));
        setHistoryLinks(json?.data?.links ?? []);
      })
      .catch(() => {});
  }, []);

  async function refreshHistory() {
    const res = await fetch("/api/shortlink/my", { credentials: "include" });
    const json = (await res.json()) as { data?: { links?: HistoryLink[] } };
    setHistoryLinks(json?.data?.links ?? []);
  }

  async function handleSubmit() {
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/shortlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, customCode: customCode || undefined }),
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        data?: { shortUrl: string };
      };

      if (!json.success) {
        setError(
          json.error === "CODE_TAKEN"
            ? "That code is already taken, try another one."
            : "Couldn't create the link, check your URL.",
        );
        return;
      }
      if (json.data) {
        setResult({ shortUrl: json.data.shortUrl });
        refreshHistory();
      }
    } catch {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(result.shortUrl);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = result.shortUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {}
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const maxVal = Math.max(...CLICKS_SERIES, ...UNIQUE_SERIES) + 6;

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
      {/* Left column — content + form */}
      <div className="text-left">
        <span className="font-data inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted))]">
          <span className="led-dot bg-[rgb(var(--accent))]" />
          Short links people trust
        </span>

        <h1 className="font-display mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Shorten links,{" "}
          <span className="relative inline-block text-[rgb(var(--accent))]">
            redirect instantly
            <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-[rgb(var(--accent)/0.35)]" />
          </span>
        </h1>

        <p className="mt-4 max-w-md text-[rgb(var(--muted))]">
          Paste a long link, get a short one ready to use — unlimited, no sign-up required.
        </p>

        <div className="mt-8 flex flex-col gap-2 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-2 shadow-sm sm:flex-row sm:items-center">
          <span className="font-data hidden shrink-0 rounded-lg bg-[rgb(var(--accent))] px-3 py-2 text-xs font-semibold text-white sm:inline-block">
            {SHORT_DOMAIN}
          </span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL here..."
            maxLength={2048}
            className="font-data flex-1 rounded-lg bg-transparent px-3 py-2 text-sm text-[rgb(var(--fg))] outline-none placeholder:text-[rgb(var(--muted))]"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="shrink-0 rounded-lg bg-[rgb(var(--accent))] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Shortening..." : "Shorten link"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowCustom((v) => !v)}
          className="font-data mt-3 text-xs text-[rgb(var(--muted))] underline underline-offset-2 hover:text-[rgb(var(--accent))]"
        >
          {showCustom ? "Hide custom alias" : "Want a custom alias?"}
        </button>

        {showCustom && (
          <input
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="Custom alias (2-20 characters)"
            maxLength={20}
            className="font-data mt-3 block w-full max-w-xs rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
          />
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {result && (
          <div className="mt-5 max-w-md rounded-lg border border-[rgb(var(--accent)/0.4)] bg-[rgb(var(--card))] p-4">
            <div className="flex items-center gap-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(result.shortUrl)}`}
                alt="QR code"
                width={90}
                height={90}
                className="shrink-0 rounded-md border border-[rgb(var(--border))]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[rgb(var(--fg))]">
                  Your link has been successfully shortened.
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2">
                  <span className="font-data flex-1 truncate text-sm text-[rgb(var(--accent))]">
                    {result.shortUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    aria-label="Copy link"
                    className="shrink-0 text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="font-data mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[rgb(var(--muted))]">
          <span className="flex items-center gap-1.5">
            <Zap size={13} className="text-[rgb(var(--accent))]" /> Free &amp; unlimited
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[rgb(var(--accent))]" /> Instant redirect
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart3 size={13} className="text-[rgb(var(--accent))]" /> Click analytics
          </span>
          <Link href="/history" className="underline underline-offset-2 hover:text-[rgb(var(--accent))]">
            View your links →
          </Link>
        </div>
      </div>

      {/* Right column — analytics mockup, hardcoded values (decorative only) */}
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-xl">
        <div className="mb-4 flex items-center gap-1.5 border-b border-[rgb(var(--border))] pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--border))]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--border))]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--accent))]" />
          <span className="font-data ml-2 text-[11px] text-[rgb(var(--muted))]">
            Analytics · Last 7 days
          </span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3">
          {[
            { label: "Clicks", value: "2.4k" },
            { label: "CTR", value: "6.2%" },
            { label: "Unique", value: "1.7k" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-[rgb(var(--border))] p-3">
              <p className="font-data text-[10px] text-[rgb(var(--muted))]">{stat.label}</p>
              <p className="font-display mt-1 text-lg font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <svg viewBox="0 0 300 140" className="w-full">
          <polyline
            points={toPoints(CLICKS_SERIES, 300, 100, maxVal)}
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth={2}
          />
          <polyline
            points={toPoints(UNIQUE_SERIES, 300, 100, maxVal)}
            fill="none"
            stroke="rgb(var(--cat-media))"
            strokeWidth={2}
          />
          {CHART_DAYS.map((d, i) => (
            <text
              key={d}
              x={(i / (CHART_DAYS.length - 1)) * 300}
              y={122}
              textAnchor="middle"
              className="font-data"
              fontSize="9"
              fill="rgb(var(--muted))"
            >
              {d}
            </text>
          ))}
        </svg>

        <div className="font-data mb-4 flex items-center gap-4 text-[10px] text-[rgb(var(--muted))]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[rgb(var(--accent))]" /> Clicks
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[rgb(var(--cat-media))]" /> Unique visitors
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[rgb(var(--border))] p-3">
            <p className="font-data text-[10px] text-[rgb(var(--muted))]">Top link</p>
            <p className="font-data mt-1 truncate text-xs text-[rgb(var(--fg))]">
              {SHORT_DOMAIN}/x9k2
            </p>
          </div>
          <div className="rounded-lg border border-[rgb(var(--border))] p-3">
            <p className="font-data text-[10px] text-[rgb(var(--muted))]">Top country</p>
            <p className="font-data mt-1 text-xs text-[rgb(var(--fg))]">Vietnam (68%)</p>
          </div>
        </div>
      </div>

      {/* History inline — chỉ hiện khi đã đăng nhập */}
      {loggedIn && (
        <div className="lg:col-span-2">
          <h2 className="font-display mb-3 text-lg font-semibold">
            {isAdmin ? "All links (admin view)" : "Your links"}
          </h2>
          <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))]">
            {historyLinks.length === 0 ? (
              <p className="p-6 text-center text-sm text-[rgb(var(--muted))]">
                No links yet — create one above.
              </p>
            ) : (
              historyLinks.map((link) => (
                <div
                  key={link.code}
                  className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-data text-sm text-[rgb(var(--accent))]">
                      {SHORT_DOMAIN}/{link.code}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[rgb(var(--muted))]">
                      {link.targetUrl}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[rgb(var(--muted))]">
                      By {link.creatorEmail ?? "guest"} ·{" "}
                      {new Date(link.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="font-data shrink-0 text-xs text-[rgb(var(--muted))]">
                    {link.clicks} clicks
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}
