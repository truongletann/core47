"use client";

import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Play } from "lucide-react";
import type { Theme } from "@/lib/focus/types";
import { SCENE_GRADIENTS, DEFAULT_GRADIENT } from "@/components/focus/SceneBackground";

type Tab = "static" | "live";

function isStatic(t: Theme) {
  return t.kind === "canvas" || t.kind === "image";
}

export function ThemePickerModal({
  activeTheme,
  onSelect,
}: {
  activeTheme: Theme | null;
  onSelect: (theme: Theme) => void;
}) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [tab, setTab] = useState<Tab>("static");
  const [category, setCategory] = useState<string>("Tất cả");

  useEffect(() => {
    fetch("/api/focus/themes")
      .then((r) => r.json() as Promise<{ data?: { themes?: Theme[] } }>)
      .then((json) => setThemes(json?.data?.themes ?? []));
  }, []);

  const tabThemes = useMemo(() => themes.filter((t) => (tab === "static" ? isStatic(t) : t.kind === "youtube")), [themes, tab]);
  const categories = useMemo(() => ["Tất cả", ...Array.from(new Set(tabThemes.map((t) => t.category)))], [tabThemes]);
  const visible = category === "Tất cả" ? tabThemes : tabThemes.filter((t) => t.category === category);

  function switchTab(next: Tab) {
    setTab(next);
    setCategory("Tất cả");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-1 rounded-xl bg-white/5 p-1">
        <button
          onClick={() => switchTab("static")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
            tab === "static" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
          }`}
        >
          <ImagePlus size={14} />
          Ảnh / Hoạt ảnh tĩnh
        </button>
        <button
          onClick={() => switchTab("live")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
            tab === "live" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
          }`}
        >
          <Play size={14} />
          Video YouTube
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              category === c
                ? "border-white bg-white/15 text-white"
                : "border-white/15 text-white/60 hover:border-white/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visible.map((t) => {
          const isActive = activeTheme?.id === t.id;
          const preview =
            t.kind === "canvas" ? (SCENE_GRADIENTS[t.urlOrKey] ?? DEFAULT_GRADIENT) : undefined;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className={`overflow-hidden rounded-xl border-2 text-left transition-colors ${
                isActive ? "border-white" : "border-transparent hover:border-white/30"
              }`}
            >
              <div className="aspect-video w-full bg-white/10" style={preview ? { background: preview } : undefined}>
                {t.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <p className="bg-black/40 px-2 py-1.5 text-xs text-white">{t.name}</p>
            </button>
          );
        })}
        {visible.length === 0 && <p className="col-span-full text-xs text-white/50">Chưa có theme nào.</p>}
      </div>
    </div>
  );
}
