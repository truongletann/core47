"use client";

import { useEffect } from "react";

const ROOT_DOMAIN = "core47.xyz";

// Friendly per-subdomain tab titles ("Core47 <Tool>") so every tool reads as
// part of the same family instead of every tab saying "Core47 Labs". Falls
// back to a capitalized version of the subdomain for anything not listed
// here, so a new subdomain never regresses to a blank/generic title.
const SUBDOMAIN_TITLES: Record<string, string> = {
  genqr: "Core47 QR",
  beautysql: "Core47 BeautySQL",
  shortlink: "Core47 Shortlink",
  focus: "Core47 Focus",
  random: "Core47 Random",
  keyboard: "Core47 Keyboard",
  tools: "Core47 Tools",
  admin: "Core47 Admin",
};

function titleForHostname(hostname: string): string {
  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}` || hostname === "localhost") {
    return "Core47 Labs";
  }
  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) return "Core47 Labs";

  const subdomain = hostname.slice(0, -(`.${ROOT_DOMAIN}`.length));
  if (SUBDOMAIN_TITLES[subdomain]) return SUBDOMAIN_TITLES[subdomain];
  return `Core47 ${subdomain.charAt(0).toUpperCase()}${subdomain.slice(1)}`;
}

// The server-rendered <title> always says "Core47 Labs" (see app/layout.tsx)
// because generateMetadata's headers()-based host lookup isn't reliable on
// this Cloudflare Workers/OpenNext deployment. window.location.hostname is
// always correct, so set the real tab title here once the page hydrates.
//
// Next streams its own <title> element in asynchronously (the
// "Next.MetadataOutlet" Suspense boundary), which can patch document.title
// back to "Core47 Labs" a moment AFTER this effect's first run — a plain
// one-shot `document.title = ...` loses that race. A MutationObserver on
// the <title> node re-asserts our value any time something else changes it.
export function SubdomainTitle() {
  useEffect(() => {
    const desired = titleForHostname(window.location.hostname);
    document.title = desired;

    const titleEl = document.querySelector("title");
    if (!titleEl) return;

    const observer = new MutationObserver(() => {
      if (document.title !== desired) document.title = desired;
    });
    observer.observe(titleEl, { childList: true, characterData: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
