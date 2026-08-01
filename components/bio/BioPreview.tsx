"use client";

import { BIO_THEME_CONFIG, buttonStyleClass, type BioTheme } from "@/lib/bio/themes";
import { BioPlatformIcon } from "./BioPlatformIcon";
import { Link2 } from "lucide-react";

export interface BioPreviewLink {
  id: string;
  kind: string;
  platform: string | null;
  title: string | null;
  url: string;
  icon: string | null;
}

export function BioPreview({
  avatarUrl,
  name,
  title,
  bio,
  theme,
  buttonStyle,
  links,
  interactive = false,
}: {
  avatarUrl: string | null;
  name: string | null;
  title: string;
  bio: string;
  theme: BioTheme;
  buttonStyle: "solid" | "outline" | "soft";
  links: BioPreviewLink[];
  interactive?: boolean;
}) {
  const cfg = BIO_THEME_CONFIG[theme] ?? BIO_THEME_CONFIG.sunset;
  const socialLinks = links.filter((l) => l.kind === "social");
  const regularLinks = links.filter((l) => l.kind !== "social");

  function handleClick(id: string) {
    if (!interactive) return;
    fetch(`/api/bio/click/${id}`, { method: "POST" }).catch(() => {});
  }

  return (
    <div
      className="flex min-h-full w-full flex-col items-center gap-5 px-6 py-12"
      style={{ background: cfg.background, color: cfg.textColor }}
    >
      <div
        className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2"
        style={{ borderColor: cfg.accent, background: cfg.cardBg }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name ?? "avatar"} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-2xl font-semibold">
            {(name || "?").charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="text-center">
        <p className="font-display text-lg font-semibold">{title || name || "Your name"}</p>
        {bio && <p className="mt-1 max-w-xs text-sm" style={{ color: cfg.mutedTextColor }}>{bio}</p>}
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
              style={buttonStyleClass(buttonStyle, cfg)}
              title={l.title ?? l.platform ?? undefined}
            >
              <BioPlatformIcon platform={l.platform} size={18} />
            </a>
          ))}
        </div>
      )}

      <div className="flex w-full max-w-sm flex-col gap-3">
        {regularLinks.map((l) => (
          <a
            key={l.id}
            href={interactive ? l.url : undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(l.id)}
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
            style={buttonStyleClass(buttonStyle, cfg)}
          >
            <Link2 size={16} className="shrink-0 opacity-70" />
            <span className="truncate">{l.title || l.url}</span>
          </a>
        ))}
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
  );
}
