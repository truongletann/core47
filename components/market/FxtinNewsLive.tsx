"use client";

import { useEffect, useRef, useState } from "react";
import { FxtinNewsRow } from "./FxtinNewsRow";

export interface LiveArticle {
  informationId: string;
  content: string;
  time: string | null;
  important: boolean;
}

// Same endpoint/protocol as the fxtin project this was ported from —
// used by permission of the author. Connects straight from the browser
// (not through our server), so it works fine on a serverless deployment
// with no persistent server-side connections.
const WS_URL = "wss://www.fxtin.com:39555/worker/";
const HEARTBEAT_INTERVAL = 40000;

interface WsPayloadItem {
  information_id?: string;
  translate?: string;
  time?: string;
  important?: number | string;
}

export function FxtinNewsLive({ initialArticles }: { initialArticles: LiveArticle[] }) {
  const [articles, setArticles] = useState<LiveArticle[]>(initialArticles);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      ws.send("保持心跳");
      heartbeatRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send("保持心跳");
      }, HEARTBEAT_INTERVAL);
    };

    ws.onmessage = (e) => {
      try {
        const res = JSON.parse(e.data) as { type?: number; data?: WsPayloadItem | WsPayloadItem[] };
        if (res.type !== 1 || !res.data) return;
        const incoming = Array.isArray(res.data) ? res.data : [res.data];

        setArticles((prev) => {
          const map = new Map(prev.map((a) => [a.informationId, a]));
          for (const item of incoming) {
            const informationId = item.information_id;
            const content = item.translate;
            if (!informationId || !content) continue;
            map.set(informationId, {
              informationId,
              content,
              time: item.time ?? null,
              important: item.important === 1 || item.important === "1",
            });
          }
          return Array.from(map.values()).sort((a, b) => (b.time ?? "").localeCompare(a.time ?? ""));
        });
      } catch {
        // ignore malformed push messages
      }
    };

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      ws.close();
    };
  }, []);

  if (articles.length === 0) {
    return <p className="mt-8 text-sm text-[rgb(var(--muted))]">Chưa tải được tin — thử tải lại trang.</p>;
  }

  return (
    <div className="mt-6 divide-y divide-[rgb(var(--border))] rounded-xl border border-[rgb(var(--border))]">
      {articles.map((a) => (
        <FxtinNewsRow key={a.informationId} article={a} />
      ))}
    </div>
  );
}
