import { NextRequest, NextResponse } from "next/server";
import { getPriceSettings, oandaStreamHost } from "@/lib/market/priceSettingsService";
import { listEnabledSymbols } from "@/lib/market/priceSymbolsService";

export const dynamic = "force-dynamic";

// Caps how many instruments a single tab can subscribe to (admin symbols +
// any ad-hoc ones added client-side on the public price page).
const MAX_INSTRUMENTS = 20;

// OANDA instrument codes are BASE_QUOTE (e.g. XAU_USD, EUR_USD). This is a
// format check only — deliberately not validated against
// /v3/accounts/{id}/instruments, because that list is the account's
// *tradeable* set and can be narrower than what the pricing/stream
// endpoints will actually serve (e.g. metals were missing from it here
// even though the stream returns quotes for them fine).
const INSTRUMENT_PATTERN = /^[A-Z0-9]{2,10}_[A-Z0-9]{2,10}$/;

// Proxies OANDA's pricing stream as Server-Sent Events, one upstream
// connection per connected browser tab. The connection only exists while a
// client is reading — no background/always-on process.
export async function GET(req: NextRequest) {
  const [settings, symbols] = await Promise.all([getPriceSettings(), listEnabledSymbols()]);
  const apiKey = settings.oandaApiKey;
  const accountId = settings.oandaAccountId;
  if (!apiKey || !accountId || symbols.length === 0) {
    return NextResponse.json({ success: false, error: "NOT_CONFIGURED" }, { status: 503 });
  }

  const baseInstruments = symbols.map((s) => s.symbol);
  const requestedParam = req.nextUrl.searchParams.get("instruments");
  let instrumentList = baseInstruments;

  if (requestedParam) {
    const requested = requestedParam
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    const valid = requested.filter((s) => INSTRUMENT_PATTERN.test(s));
    instrumentList = valid.length > 0 ? valid.slice(0, MAX_INSTRUMENTS) : baseInstruments;
  }

  const instruments = instrumentList.join(",");
  const host = oandaStreamHost(settings.oandaEnvironment);
  const url = `${host}/v3/accounts/${encodeURIComponent(accountId)}/pricing/stream?instruments=${encodeURIComponent(instruments)}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: req.signal,
    });
  } catch (err) {
    console.error("[market/prices/stream] upstream fetch failed:", err);
    return NextResponse.json({ success: false, error: "UPSTREAM_ERROR" }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    console.error(`[market/prices/stream] OANDA returned HTTP ${upstream.status}`);
    return NextResponse.json({ success: false, error: "UPSTREAM_ERROR" }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            // OANDA sends one JSON object per line (PRICE ticks and HEARTBEATs) —
            // re-wrap as SSE so the browser can consume it with EventSource.
            controller.enqueue(encoder.encode(`data: ${trimmed}\n\n`));
          }
        }
      } catch (err) {
        console.error("[market/prices/stream] stream error:", err);
      } finally {
        controller.close();
      }
    },
    cancel() {
      upstream.body?.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
