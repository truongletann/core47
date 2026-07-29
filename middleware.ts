import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = "core47.xyz";

// Standalone domain per tool (not a core47.xyz subdomain).
// Add a tool with its own domain by declaring one more line here.
const STANDALONE_TOOL_DOMAINS: Record<string, string> = {
  "to2.site": "shortlink",
  "www.to2.site": "shortlink",
};

// NOTE: using the "middleware.ts" convention (not "proxy.ts") is intentional —
// Next.js 16's proxy.ts only runs the Node.js runtime, which doesn't support
// Edge Runtime, while @opennextjs/cloudflare requires Edge Runtime. Keep
// middleware.ts as-is.
export function middleware(req: NextRequest) {
  const hostHeader = req.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0]; // strip the port when running locally (e.g. localhost:3000)
  const url = req.nextUrl.clone();

  // Standalone domain (e.g. to2.site) — ONLY used to redirect short codes,
  // does not show the link-creation form (that lives at shortlink.core47.xyz).
  if (hostname in STANDALONE_TOOL_DOMAINS) {
    const toolSlug = STANDALONE_TOOL_DOMAINS[hostname];

    // Hitting the root domain directly (no code) → send to the real creation page
    if (url.pathname === "/") {
      return NextResponse.redirect(`https://${toolSlug}.${ROOT_DOMAIN}/`, 307);
    }

    // Has a code after it (e.g. /a782) → rewrite into the redirect-handling route
    url.pathname = `/tools/${toolSlug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Root domain / localhost — no rewrite, serve the normal hub homepage
  if (
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    hostname === "localhost"
  ) {
    return NextResponse.next();
  }

  // Only handle the *.core47.xyz shape — leave unknown hosts untouched
  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    return NextResponse.next();
  }

  const subdomain = hostname.slice(0, -(`.${ROOT_DOMAIN}`.length));

  // Strict validation — only lowercase letters/digits/hyphens allowed, reject
  // anything else before using it to build an internal pathname (avoids path
  // traversal).
  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    return NextResponse.next();
  }

  const suffix = url.pathname === "/" ? "" : url.pathname;
  url.pathname = `/tools/${subdomain}${suffix}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
