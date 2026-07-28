"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export function ToolShell({
  slug,
  title,
  description,
  children,
}: {
  slug: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me", { credentials: "include" }).then(
        (r) => r.json() as Promise<{ data?: { user?: { id: string } | null } }>,
      ),
      fetch("/api/toolbox/favorites", { credentials: "include" }).then(
        (r) => r.json() as Promise<{ data?: { slugs?: string[] } }>,
      ),
    ])
      .then(([me, favs]) => {
        setLoggedIn(Boolean(me?.data?.user));
        setIsFavorite((favs?.data?.slugs ?? []).includes(slug));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  async function toggleFavorite() {
    if (!loggedIn) {
      const returnTo = encodeURIComponent(window.location.href);
      window.location.href = `https://core47.xyz/login?returnTo=${returnTo}`;
      return;
    }

    if (isFavorite) {
      await fetch(`/api/toolbox/favorites/${slug}`, { method: "DELETE", credentials: "include" });
      setIsFavorite(false);
    } else {
      await fetch("/api/toolbox/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
        credentials: "include",
      });
      setIsFavorite(true);
    }
    window.dispatchEvent(new CustomEvent("core47:favorites-updated"));
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">{description}</p>
        </div>
        {!loading && (
          <button
            onClick={toggleFavorite}
            className="flex shrink-0 items-center gap-1.5 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))]"
          >
            <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </button>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
