"use client";

import { useEffect, useState } from "react";
import type { Playlist } from "@/lib/focus/types";

export function MusicModal({
  activePlaylist,
  onSelect,
}: {
  activePlaylist: Playlist | null;
  onSelect: (playlist: Playlist) => void;
}) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/focus/playlists")
      .then((r) => r.json() as Promise<{ data?: { playlists?: Playlist[] } }>)
      .then((json) => setPlaylists(json?.data?.playlists ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-white/50">Đang tải...</p>;
  if (playlists.length === 0) return <p className="text-sm text-white/50">Chưa có playlist nào.</p>;

  const featured = activePlaylist ?? playlists[0];

  return (
    <div className="flex flex-col gap-4">
      {featured && (
        <button
          onClick={() => onSelect(featured)}
          className="relative block h-40 w-full overflow-hidden rounded-xl text-left sm:h-48"
        >
          {featured.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={featured.thumbnailUrl} alt="" className="h-full w-full scale-110 object-cover blur-[1px]" />
          ) : (
            <div className="h-full w-full bg-white/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <div className="absolute bottom-3 left-4">
            <p className="text-[10px] uppercase tracking-wide text-white/60">Đang phát</p>
            <p className="font-display text-lg font-semibold text-white">{featured.name}</p>
          </div>
        </button>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {playlists.map((p) => {
          const isActive = activePlaylist?.id === p.id;
          return (
            <button key={p.id} onClick={() => onSelect(p)} className="text-left">
              <div
                className={`aspect-square w-full overflow-hidden rounded-xl border-2 bg-white/10 ${
                  isActive ? "border-white" : "border-transparent"
                }`}
              >
                {p.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnailUrl} alt="" className="h-full w-full object-cover" />
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
    </div>
  );
}
