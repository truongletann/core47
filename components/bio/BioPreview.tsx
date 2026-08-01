"use client";

import { resolveThemeConfig, buttonStyleClass, type BioTheme } from "@/lib/bio/themes";
import { BioPlatformIcon } from "./BioPlatformIcon";
import { Link2 } from "lucide-react";

export interface BioPreviewLink {
  id: string;
  kind: string;
  platform: string | null;
  title: string | null;
  url: string;
  icon: string | null;
  color?: string | null;
  subtitle?: string | null;
  thumbnailUrl?: string | null;
  isHeader?: boolean;
}

export function BioPreview({
  avatarUrl,
  bannerUrl,
  name,
  title,
  bio,
  theme,
  backgroundColor,
  buttonStyle,
  links,
  interactive = false,
}: {
  avatarUrl: string | null;
  bannerUrl?: string | null;
  name: string | null;
  title: string;
  bio: string;
  theme: BioTheme;
  backgroundColor?: string | null;
  buttonStyle: "solid" | "outline" | "soft";
  links: BioPreviewLink[];
  interactive?: boolean;
}) {
  const cfg = resolveThemeConfig(theme, backgroundColor);
  const socialLinks = links.filter((l) => l.kind === "social");
  const regularLinks = links.filter((l) => l.kind !== "social");

  function handleClick(id: string) {
    if (!interactive) return;
    fetch(`/api/bio/click/${id}`, { method: "POST" }).catch(() => {});
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center gap-5 pb-12" style={{ background: cfg.background, color: cfg.textColor }}>
      {bannerUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bannerUrl} alt="" className="h-32 w-full shrink-0 object-cover sm:h-40" />
      )}

      <div className={`flex w-full flex-col items-center gap-5 px-6 ${bannerUrl ? "-mt-14" : "pt-12"}`}>
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2"
          style={{ borderColor: cfg.accent, background: cfg.cardBg }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={name ?? "avatar"} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-2xl font-semibold">{(name || "?").charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="text-center">
          <p className="font-display text-lg font-semibold">{title || name || "Your name"}</p>
          {bio && (
            <p className="mt-1 max-w-xs text-sm" style={{ color: cfg.mutedTextColor }}>
              {bio}
            </p>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {socialLinks.map((l) => (
              <a
                key={l.id}
                href={interactive ? l.url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(l.id)}
                className="flex h-10 w-10 items-center justify-center rounded-full border transition-transform hover:scale-105"
                style={buttonStyleClass(buttonStyle, cfg, l.color)}
                title={l.title ?? l.platform ?? undefined}
              >
                <BioPlatformIcon platform={l.platform} size={18} />
              </a>
            ))}
          </div>
        )}

        <div className="flex w-full max-w-sm flex-col gap-3">
          {regularLinks.map((l) =>
            l.isHeader ? (
              <div key={l.id} className="mt-2 flex items-center gap-3 first:mt-0">
                <span className="h-px flex-1" style={{ background: cfg.mutedTextColor }} />
                <span className="font-display shrink-0 text-sm font-semibold">{l.title || "—"}</span>
                <span className="h-px flex-1" style={{ background: cfg.mutedTextColor }} />
              </div>
            ) : l.thumbnailUrl ? (
              <a
                key={l.id}
                href={interactive ? l.url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(l.id)}
                className="flex items-center gap-3 rounded-xl border p-2 text-left transition-transform hover:scale-[1.02]"
                style={buttonStyleClass(buttonStyle, cfg, l.color)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.thumbnailUrl} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{l.title || l.url}</p>
                  {l.subtitle && <p className="truncate text-xs opacity-80">{l.subtitle}</p>}
                </div>
              </a>
            ) : (
              <a
                key={l.id}
                href={interactive ? l.url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(l.id)}
                className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
                style={buttonStyleClass(buttonStyle, cfg, l.color)}
              >
                <Link2 size={16} className="shrink-0 opacity-70" />
                <span className="truncate">{l.title || l.url}</span>
              </a>
            ),
          )}
          {regularLinks.length === 0 && socialLinks.length === 0 && (
            <p className="text-center text-sm" style={{ color: cfg.mutedTextColor }}>
              No links yet
            </p>
          )}
        </div>

        <p className="mt-4 font-mono text-[10px] tracking-wide" style={{ color: cfg.mutedTextColor }}>
          made with core47.xyz/bio
        </p>
      </div>
    </div>
  );
}
