# Project conventions — read before doing any work here

This file is the accumulated set of rules, standards, and gotchas for the
`core47` repo (core47.xyz, Next.js App Router on Cloudflare Workers via
OpenNext, D1 database via Drizzle ORM). It exists so every new session
already knows how this specific user/repo wants things done, instead of
re-deriving it or re-asking. Keep it up to date: when a new durable
convention is established (the user corrects an approach, or a fix becomes
a pattern to repeat), add it here.

## Deploy workflow — a task isn't "done" until this full sequence runs

1. Write code, run `npx tsc --noEmit` (must be clean).
2. If the DB schema changed: add a new numbered migration in
   `db/migrations/`, apply it locally with
   `npx wrangler d1 execute core47-db --local --file=...`, and verify in the
   browser (`preview_start` + the browser tools) before touching production.
3. `git add` only the specific files for this change — never `-A`/`.`. This
   repo can have unrelated in-progress work sitting in the tree; don't sweep
   it into unrelated commits.
4. `git commit` with a message explaining *why*, not just what.
5. Apply the same migration to remote: `npx wrangler d1 execute core47-db --remote --file=...`.
6. `rm -rf .next .open-next && npm run deploy`. Stale `.next`/`.open-next`
   cause deploy issues, hence the clean. **On Windows, `npm run deploy`
   fails transiently and often** (Turbopack file-lock / ENOENT / "another
   build already running" errors) — this is not a real failure, just
   `rm -rf .next .open-next` and retry. If a build process gets stuck,
   check for and kill orphaned `node.exe` processes referencing the repo
   path before retrying.
7. Verify on production — `curl` the live URL for expected content, and/or
   point the browser tools at `https://core47.xyz/...`. A task is not
   complete until it's confirmed live, not just committed/deployed.

**Auto commit+deploy is pre-approved**: once verification (typecheck +
browser check) passes, go straight to `git commit` and `npm run deploy`
without asking first — the user gave blanket permission for this
(2026-07-31: "oke sau này cứ xong thì commit + deploy luôn nha"). Still
summarize what was committed/deployed afterward. Use judgment and confirm
anyway for unusually risky changes (auth, payments, destructive migrations).

## Secrets — never in git, D1-stored, admin-editable

- **Never** write a live API key/credential into anything git-tracked — not
  migrations, not source, not `.env` files.
- Pattern: store secrets in a dedicated singleton-row D1 table (e.g.
  `price_settings.oanda_api_key`), seed the row NULL in the migration
  (which *is* committed), then set the real value via a direct
  `wrangler d1 execute --command "UPDATE ..."` call (never saved in the
  repo) on both local and remote. An admin-only form behind `requireAdmin`
  then lets it be viewed/changed without touching git or redeploying.
- **Any admin GET endpoint that returns a DB row containing a secret column
  leaks it in the browser Network tab.** Never round-trip a raw secret to
  the client. Use a `getXSafe()` service function that returns
  `hasKey: boolean` + a masked last-4 preview, and make the PUT only
  overwrite the secret when a non-empty value is submitted (add an explicit
  `clearKey` boolean for intentional removal). Reference implementation:
  `lib/market/priceSettingsService.ts` (`getPriceSettingsSafe`).
- `.wrangler/` (Miniflare's local D1/R2 dev-mode state) is gitignored — it
  can contain real secrets/passwords entered during local `wrangler dev`
  testing. Never remove that gitignore entry. If a new local-dev-state
  directory pattern is ever introduced, gitignore it before running the dev
  server against real data.
- fxtin.com's undocumented internal endpoints (`calendarEvents`,
  `/page/finance/information`, the `wss://www.fxtin.com:39555/worker/`
  feed) are used with the user's explicit authorization (they stated
  "fxtin đồng ý công khai cho sử dụng" and it matches their prior project
  `scamlab`). This covers extending fxtin integration further (e.g. wiring
  up `getQuotation`/`quotationCharts`) without re-asking. A *different*
  undocumented third-party API would need its own authorization check.

## Responsive design (RWD) conventions

Tailwind v4 (CSS-first config in `app/globals.css`, no `tailwind.config.*`
file). Follow these established patterns for any new page/component rather
than inventing new ones:

- **Sidebars**: `w-full shrink-0 md:w-<n>` on the `<nav>`, a `md:hidden`
  toggle button driving a `mobileOpen` state, content wrapped in
  `${mobileOpen ? "block" : "hidden"} md:block`. See
  `components/toolbox/Sidebar.tsx` and `components/admin/AdminNav.tsx`.
- **Navbar**: inline links collapse behind a `sm:hidden` hamburger button +
  dropdown `<nav>` below the header bar; desktop nav is `hidden ... sm:flex`.
  See `components/layout/Navbar.tsx`.
- **Tables**: always wrap in `<div className="overflow-x-auto rounded-xl
  border ...">` — never `overflow-hidden`, which clips instead of scrolling.
- **Sidebar+content layouts**: `flex flex-col gap-6 px-4 py-8 md:flex-row
  md:gap-10 md:px-6 md:py-12` (stacks on mobile, row on desktop).
- Before shipping any RWD change, verify at the `mobile` preset (375×812) via
  the browser tools, not just by reading the Tailwind classes.

## Security baseline already in place — don't regress it

- Session-based auth (`lib/auth/service.ts`): PBKDF2-SHA256 100k-iteration
  password hashing with per-user random salt, `crypto.randomUUID()` session
  IDs, `httpOnly + secure + sameSite=lax` cookies.
- Disabling a user revokes their sessions immediately (`getUserBySessionId`
  re-checks `isDisabled` on every request, not just at login).
- Changing a password invalidates every other active session for that
  account (`deleteOtherSessions`).
- Every `app/api/admin/**/route.ts` handler must call `requireAdmin(req)`
  and bail on `null` — this is checked consistently today, keep it that way
  for any new admin route.
- Public-facing write endpoints prone to abuse (login, register, shortlink
  creation, bucket-list suggestions) go through
  `checkRateLimit(key, limit, windowMs)` from `lib/rateLimit.ts` (D1-backed
  fixed-window counter, table `rate_limits`). Apply the same to any new
  unauthenticated POST endpoint.
- Blog markdown → HTML is sanitized (`lib/blog/markdown.ts`,
  `sanitizeHtml()`) before ever reaching `dangerouslySetInnerHTML`. This is
  a **hand-rolled regex sanitizer, not a library** — see the Worker size
  note below for why. If you add another `dangerouslySetInnerHTML` site
  fed by user/admin-authored content, sanitize it the same way (or reuse
  this function).
- Baseline security headers (CSP, X-Content-Type-Options, X-Frame-Options,
  Referrer-Policy, Permissions-Policy) are set in `next.config.js`
  `headers()`. The CSP currently allows `'unsafe-inline'` for script/style
  (not nonce-based) — a deliberate tradeoff to avoid forcing every page
  into dynamic rendering; tighten it only with a full page-by-page
  verification pass.
- Drizzle's query builder is used everywhere — never hand-write
  string-concatenated SQL. The only raw `sql\`...\`` usages in the repo are
  parameterized column-increment expressions; keep it that way.
- Every user-owned resource query (portfolio, focus, shortlinks, etc.) must
  scope both lookup and mutation by `userId`
  (`and(eq(table.id, id), eq(table.userId, userId))`) — this is correct
  throughout today, don't introduce an ID-only lookup on a mutation route.

## Cloudflare Workers size limit — check dependency weight before adding

**The Workers free plan caps the deployed script at 3 MiB gzip** (paid plan:
10 MiB); `npm run deploy` fails outright (error 10027) if exceeded, it does
not degrade gracefully. `sanitize-html` alone pushed this repo over the
limit (it pulls in htmlparser2/deepmerge/a parser stack), which is why the
blog sanitizer is hand-rolled instead. **Before adding any new npm
dependency to code that runs in the Worker** (i.e. imported by `app/` or
`lib/`, not just devDependencies/build tooling), sanity-check its bundle
weight — prefer zero-dep or edge-runtime-native approaches, especially for
anything HTML/DOM-parsing-shaped.

**A `"use client"` directive does NOT keep a library out of the Worker
bundle.** Next.js still server-renders client components for the initial
HTML/hydration payload by default, so anything they import — even browser-only
libs like `pdfjs-dist`/`pdf-lib`/`mammoth`/`docx` (see pdf.core47.xyz,
file.core47.xyz) — gets pulled into the server bundle too. Confirmed this
pushed `handler.mjs` to 19.8MB uncompressed / over the 3MiB gzip cap. Fix:
put the heavy UI in its own component (e.g. `components/pdf/PdfToolkitClient.tsx`)
and load it from `page.tsx` via `next/dynamic(() => import(...), { ssr: false })`
— this is the only way to keep a dependency truly browser-only in this stack.
Always run a real `rm -rf .next .open-next && npm run deploy` (not just
`tsc --noEmit`) before declaring a heavy-client-lib feature done, since this
class of bug only shows up at deploy time.

**`import * as Icons from "lucide-react"` for dynamic icon-by-name lookups
defeats tree-shaking and pulls the whole ~1000-icon library into the Worker
bundle** — confirmed this alone added ~1.4MiB (duplicated across two
chunks) and was enough by itself to push the deploy over the 3MiB gzip cap
(error 10027) even with no other heavy deps. Any place that resolves an
icon component from a DB/string value (tool icons, category icons, admin
nav icons) must import from `lib/toolbox/iconMap.ts` instead — a curated
`Record<string, LucideIcon>` built from named imports of only the icon
names actually in use. When adding a new tool/category with a new icon
name, add that icon's named import to `iconMap.ts` too, or it'll silently
render nothing (`getIcon()` falls back to `Box`).

**pdf.js (`pdfjs-dist`) `page.render()` hangs forever if the tab is
backgrounded while rendering.** Its default screen-rendering path schedules
continuation via `requestAnimationFrame`, which browsers pause for
hidden/inactive tabs — the promise then never resolves, with no error. Fix:
pass `intent: "print"` to `page.render()` (see `lib/converters/pdfRender.ts`)
to force microtask-based scheduling instead. Apply this to any future
pdf.js render call in this repo.

## R2 image uploads — never leave orphaned objects behind

When a feature lets a user replace or remove an uploaded image (avatar,
bio banner, bio link thumbnail, blog cover, etc.), the old R2 object must
not just be forgotten:

- **Replacing an image** (re-upload): use a fixed, deterministic key (e.g.
  `avatars/<userId>`, `bio-banner/<userId>`, `bio-link-thumb/<linkId>`) so
  the new `bucket.put()` overwrites the old object in place instead of
  minting a new key — this is already the pattern for every image upload
  route in this repo, keep it that way for new ones.
- **Deleting the thing the image belongs to** (a bio link, a blog post,
  etc.): explicitly `bucket.delete(key)` the associated R2 object as part
  of that delete, before/alongside the D1 row delete. Don't just delete
  the DB row and leave the file behind — R2 storage isn't free and orphaned
  objects never get cleaned up on their own (no cron in this project, see
  below). Example: `deleteBioLink()` in `lib/bio/service.ts` deletes
  `bio-link-thumb/<id>` before deleting the row.
- **Explicit "remove image" actions** (e.g. the bio banner's remove
  button): the DELETE route must call `bucket.delete()`, not just clear
  the DB column.

## Architecture pattern: no cron, lazy on-demand refresh

There is no Cloudflare Cron Trigger in this OpenNext build (would require
patching `.open-next/worker.js` post-build — too risky). Every
data-freshness feature instead uses: check `shouldRefresh(thresholdMinutes)`
on page load, refetch if stale, cache in D1. Admin-editable config (URLs,
API keys, symbol lists) lives in dedicated singleton-row tables so sources
can change without a code deploy. Follow this pattern for any new
external-data feature rather than introducing a scheduled job.
