"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CloudRain,
  Waves,
  Coffee,
  Plane,
  Train,
  BookOpen,
  Flame,
  Building2,
  Wind,
  Snowflake,
  CloudLightning,
  Music2,
  Play,
  Pause,
  RotateCcw,
  Trash2,
} from "lucide-react";
import type { SoundTrack, Playlist } from "@/lib/focus/types";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  rain: CloudRain,
  thunderstorm: CloudLightning,
  ocean: Waves,
  wind: Wind,
  snow: Snowflake,
  snowfall: Snowflake,
  coffee: Coffee,
  café: Coffee,
  cafe: Coffee,
  airplane: Plane,
  train: Train,
  library: BookOpen,
  fire: Flame,
  campfire: Flame,
  fireplace: Flame,
  office: Building2,
};

function iconFor(name: string) {
  const key = Object.keys(ICONS).find((k) => name.toLowerCase().includes(k));
  return key ? ICONS[key] : Music2;
}

interface SoundsTabProps {
  tracks: SoundTrack[];
  volumes: Record<string, number>;
  onToggle: (track: SoundTrack) => void;
  onSetVolume: (track: SoundTrack, volume: number) => void;
  onPauseAll: () => void;
  onResumeAll: () => void;
  onResetAll: () => void;
}

// Several tracks can be active at once — each tile toggles independently
// and, once active, exposes its own volume slider. Playback itself lives in
// useAmbientSounds (owned by page.tsx) so it survives the panel closing.
function SoundsTab({ tracks, volumes, onToggle, onSetVolume, onPauseAll, onResumeAll, onResetAll }: SoundsTabProps) {
  const [category, setCategory] = useState("All");
  const [allPaused, setAllPaused] = useState(false);

  const categories = useMemo(() => ["All", ...Array.from(new Set(tracks.map((t) => t.category)))], [tracks]);
  const visible = category === "All" ? tracks : tracks.filter((t) => t.category === category);
  const anyActive = Object.values(volumes).some((v) => v > 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => {
            if (allPaused) onResumeAll();
            else onPauseAll();
            setAllPaused((p) => !p);
          }}
          disabled={!anyActive}
          className="text-white/60 hover:text-white disabled:opacity-30"
          aria-label={allPaused ? "Phát lại tất cả" : "Tạm dừng tất cả"}
        >
          {allPaused ? <Play size={15} /> : <Pause size={15} />}
        </button>
        <button
          onClick={() => {
            onResetAll();
            setAllPaused(false);
          }}
          disabled={!anyActive}
          className="text-white/60 hover:text-white disabled:opacity-30"
          aria-label="Tắt hết"
        >
          <RotateCcw size={14} />
        </button>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-white outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c} className="text-black">
              {c}
            </option>
          ))}
        </select>
      </div>
      {tracks.length === 0 && <p className="text-xs text-white/50">Đang tải âm thanh...</p>}
      <div className="grid grid-cols-4 gap-3">
        {visible.map((t) => {
          const Icon = iconFor(t.name);
          const volume = volumes[t.id] ?? 0;
          const active = volume > 0;
          return (
            <div
              key={t.id}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors ${
                active ? "border-violet-500 bg-violet-500/15 text-white" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              <button onClick={() => onToggle(t)} className="flex flex-col items-center gap-1.5">
                <Icon size={20} />
                <span className="text-[11px] leading-tight">{t.name}</span>
              </button>
              {active && (
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => onSetVolume(t, Number(e.target.value))}
                  className="mt-0.5 w-full accent-violet-500"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface CustomPlaylist {
  id: string;
  name: string;
  url: string;
  embedUrl: string;
  kind: "spotify" | "youtube";
}

const MY_MUSIC_KEY = "focus_my_music_v1";

function toEmbedUrl(raw: string): CustomPlaylist | null {
  try {
    const url = new URL(raw.trim());
    if (url.hostname.includes("spotify.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length < 2) return null;
      return {
        id: `${parts[1]}-${Date.now()}`,
        name: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
        url: raw,
        embedUrl: `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`,
        kind: "spotify",
      };
    }
    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
      const listId = url.searchParams.get("list");
      const videoId = url.hostname.includes("youtu.be") ? url.pathname.slice(1) : url.searchParams.get("v");
      const embedUrl = listId
        ? `https://www.youtube.com/embed/videoseries?list=${listId}`
        : videoId
          ? `https://www.youtube.com/embed/${videoId}`
          : null;
      if (!embedUrl) return null;
      return { id: `${videoId ?? listId}-${Date.now()}`, name: "YouTube", url: raw, embedUrl, kind: "youtube" };
    }
    return null;
  } catch {
    return null;
  }
}

function MyMusicTab({
  current,
  onSelectCurrent,
  attachSlot,
}: {
  current: CustomPlaylist | null;
  onSelectCurrent: (playlist: CustomPlaylist | null) => void;
  attachSlot: (slot: HTMLDivElement | null) => void;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<CustomPlaylist[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MY_MUSIC_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  function persist(next: CustomPlaylist[]) {
    setFavorites(next);
    window.localStorage.setItem(MY_MUSIC_KEY, JSON.stringify(next));
  }

  function load() {
    const parsed = toEmbedUrl(input);
    if (!parsed) {
      setError("Chỉ hỗ trợ link Spotify hoặc YouTube.");
      return;
    }
    setError(null);
    onSelectCurrent(parsed);
  }

  function saveToFavorites() {
    if (!current) return;
    if (favorites.some((f) => f.embedUrl === current.embedUrl)) return;
    persist([current, ...favorites].slice(0, 5));
  }

  function removeFavorite(id: string) {
    persist(favorites.filter((f) => f.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold text-white">Custom Playlists</p>
        <p className="mb-2 text-[11px] text-white/50">
          Dán link playlist Spotify hoặc YouTube. Lưu tối đa 5 playlist yêu thích.
        </p>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Paste playlist or video URL here"
            className="flex-1 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none"
          />
        </div>
        <div className="mt-2 flex gap-2">
          <button onClick={load} className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500">
            Load
          </button>
          <button
            onClick={saveToFavorites}
            disabled={!current}
            className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 disabled:opacity-40"
          >
            Save to Favorites
          </button>
        </div>
        {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
      </div>

      {current && (
        // Empty placeholder — the real iframe lives in page.tsx, positioned
        // exactly over this box (see MyMusicTab's comment in page.tsx),
        // so it keeps playing across panel open/close.
        <div ref={attachSlot} className="h-[200px] w-full overflow-hidden rounded-lg" />
      )}

      {favorites.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-white/40">Yêu thích</p>
          <ul className="flex flex-col gap-1.5">
            {favorites.map((f) => (
              <li key={f.id} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-1.5 text-xs">
                <button onClick={() => onSelectCurrent(f)} className="flex items-center gap-2 text-white/80 hover:text-white">
                  <Play size={12} />
                  {f.name}
                </button>
                <button onClick={() => removeFavorite(f.id)} className="text-white/30 hover:text-red-400">
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PlaylistLibraryTab({
  activePlaylist,
  onSelect,
  attachPlayerSlot,
}: {
  activePlaylist: Playlist | null;
  onSelect: (playlist: Playlist) => void;
  attachPlayerSlot: (slot: HTMLDivElement | null) => void;
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
  const isPlaying = activePlaylist?.id === featured.id;

  return (
    <div className="flex flex-col gap-4">
      {isPlaying ? (
        // Empty placeholder — the real iframe lives in page.tsx and is
        // positioned exactly over this box via getBoundingClientRect, so
        // it plays right here without ever being reparented (see page.tsx).
        <div ref={attachPlayerSlot} className="h-[352px] w-full overflow-hidden rounded-lg" />
      ) : (
        <button onClick={() => onSelect(featured)} className="flex flex-col gap-1.5 text-left">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-white/10">
            {featured.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featured.thumbnailUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/30">
                <Music2 size={32} />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100">
              <Play size={28} className="text-white" />
            </div>
          </div>
          <p className="truncate text-sm font-semibold text-white">{featured.name}</p>
        </button>
      )}

      <div className="grid grid-cols-4 gap-2.5">
        {playlists.map((p) => {
          const isActive = activePlaylist?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition-colors ${
                isActive ? "border-violet-500 bg-violet-500/15 text-white" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              <Music2 size={18} />
              <span className="text-[11px] leading-tight">{p.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const SOUNDS_PANEL_TABS = [
  { key: "sounds", label: "Sounds" },
  { key: "mymusic", label: "My Music" },
  { key: "library", label: "Playlist Library" },
];

export function SoundsPanel({
  tab,
  activePlaylist,
  onSelectPlaylist,
  attachPlayerSlot,
  customPlaylist,
  onSelectCustomPlaylist,
  attachMyMusicSlot,
  sounds,
}: {
  tab: "sounds" | "mymusic" | "library";
  activePlaylist: Playlist | null;
  onSelectPlaylist: (playlist: Playlist) => void;
  attachPlayerSlot: (slot: HTMLDivElement | null) => void;
  customPlaylist: CustomPlaylist | null;
  onSelectCustomPlaylist: (playlist: CustomPlaylist | null) => void;
  attachMyMusicSlot: (slot: HTMLDivElement | null) => void;
  sounds: SoundsTabProps;
}) {
  return (
    <>
      {tab === "sounds" && <SoundsTab {...sounds} />}
      {tab === "mymusic" && (
        <MyMusicTab current={customPlaylist} onSelectCurrent={onSelectCustomPlaylist} attachSlot={attachMyMusicSlot} />
      )}
      {tab === "library" && (
        <PlaylistLibraryTab activePlaylist={activePlaylist} onSelect={onSelectPlaylist} attachPlayerSlot={attachPlayerSlot} />
      )}
    </>
  );
}
