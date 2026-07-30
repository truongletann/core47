"use client";

import { useEffect, useState } from "react";
import type { Playlist } from "@/lib/focus/types";

export function MusicModal() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/focus/playlists")
      .then((r) => r.json() as Promise<{ data?: { playlists?: (Playlist & { thumbnailUrl?: string | null })[] } }>)
      .then((json) => setPlaylists(json?.data?.playlists ?? []))
      .finally(() => setLoading(false));
  }, []);

  const active = playlists.find((p) => p.id === activeId) as (Playlist & { thumbnailUrl?: string | null }) | undefined;

  if (loading) return <p className="text-sm text-white/50">Đang tải...</p>;
  if (playlists.length === 0) return <p className="text-sm text-white/50">Chưa có playlist nào.</p>;

  if (active) {
    return (
      <div>
        <button onClick={() => setActiveId(null)} className="mb-3 text-xs text-white/60 hover:text-white">
          ← Danh sách playlist
        </button>
        <iframe
          key={active.id}
          src={active.spotifyEmbedUrl}
          width="100%"
          height="352"
          style={{ borderRadius: 12 }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {playlists.map((p) => {
        const thumb = (p as Playlist & { thumbnailUrl?: string | null }).thumbnailUrl;
        return (
          <button key={p.id} onClick={() => setActiveId(p.id)} className="text-left">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-white/10">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/30">♪</div>
              )}
            </div>
            <p className="mt-1.5 truncate text-xs font-medium text-white">{p.name}</p>
            {p.category && <p className="truncate text-[11px] text-white/50">{p.category}</p>}
          </button>
        );
      })}
    </div>
  );
}
