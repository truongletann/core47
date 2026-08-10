# core47 — Project Overview (for AI assistants)

> Read this file first if you're a new AI session (Claude, ChatGPT, Gemini,
> etc.) picking up work on this repo. It answers "what is this project and
> how is it built" so you don't have to re-derive it from scratch. For
> *rules* on how to make changes (deploy steps, secrets handling, security
> baseline, Workers bundle-size gotchas), see [`CONVENTIONS.md`](CONVENTIONS.md)
> — this file is the "what/where", that one is the "how/must".

## What core47 is

**[core47.xyz](https://core47.xyz)** is one person's personal hub of small
web tools and finance-tracking utilities. It is **one single Next.js app**
deployed as **one Cloudflare Worker**, served across many subdomains
(`tools.core47.xyz`, `focus.core47.xyz`, `shortlink.core47.xyz`, ...) plus a
couple of standalone domains (`to2.site`). There is no microservice split —
everything lives in this one repo/deploy.

The owner (git user `deanle`, Vietnamese-speaking) uses this as both a
working product (portfolio tracking, dev tools they use daily) and a
personal playground. Commit history shows an iterative, fast-moving style:
features get shipped, sometimes torn back out later (see "Removed/retired
features" below) — don't assume every subdomain or module ever mentioned in
old docs/commits still exists. **Trust the current repo tree over any
historical description, including this file if it goes stale.**

## Live modules (current, as of this writing)

Routing is host-based via [`middleware.ts`](middleware.ts): for most
subdomains, `<subdomain>.core47.xyz/*` is rewritten to `/tools/<subdomain>/*`
before Next.js routing runs. A request only resolves if a matching folder
exists under `app/tools/<subdomain>/`.

| Module | Where it lives | Subdomain | Description |
|---|---|---|---|
| **Dev Toolbox** | `app/tools/tools/` | `tools.core47.xyz` | 20 small dev utilities: JSON/SQL/XML/YAML formatters, JSON↔table, Base64 (text + image), URL/HTML encoders, JWT decoder, hash generator, UUID generator, QR code, cron parser, password generator, lorem ipsum, number base converter, date converter, gzip, X.509 certificate decoder. Per-tool config/favorites via `lib/toolbox/registry.ts`. |
| **Focus** | `app/tools/focus/` | `focus.core47.xyz` | Pomodoro/focus timer — tasks, sessions, ambient sound playlists/tracks, themes. |
| **Meal planner** | `app/tools/meal/` | `meal.core47.xyz` | Recipes with per-ingredient nutrition, food database, daily targets, daily menu/plan entries. Very actively iterated (bulk of the 100+ migrations are meal data seeding). |
| **Shortlink** | `app/tools/shortlink/` | `shortlink.core47.xyz`, `to2.site` | Link shortener with click tracking. `to2.site` is a standalone domain (see `STANDALONE_TOOL_DOMAINS` in `middleware.ts`) that only resolves short codes — the creation UI lives on `shortlink.core47.xyz`. |
| **Keyboard tester** | `app/tools/keyboard/` | `keyboard.core47.xyz` | Browser key-press/latency tester. |
| **Random tools** | `app/tools/random/` | `random.core47.xyz` | Random pickers/generators. |
| **Admin** | `app/tools/admin/` | `admin.core47.xyz` | Internal dashboard: manage users, tool registry/categories, market config (API keys, symbols, calendar sources), meal data, blog posts, bucket-list (`list100`). Every route behind `requireAdmin`. |
| **Market** | `app/market/` | reached at `core47.xyz/market/*` (nested under the root app, **not** subdomain-rewritten like the others) | Portfolio tracker, economic calendar, forex/crypto news, fxtin.com news mirror, live prices (Binance, OANDA, VN gold). |
| **Blog** | `app/blog/` | `core47.xyz/blog/*` | Markdown-based personal blog. Markdown → HTML via a **hand-rolled** sanitizer (`lib/blog/markdown.ts`) — not a library, see bundle-size note below. |
| **Bucket list** | `app/bucket-list/` | `core47.xyz/bucket-list` | Personal 100-item goal tracker (DB tables prefixed `list100_*`). Admin side supports drag-and-drop reordering. |
| **Auth / profile** | `app/login/`, `app/profile/` | `core47.xyz/login`, `/profile` | Session-based login, own-profile management (avatar upload to R2, password change). |

Everything else under `app/api/**` is the corresponding backend for the
module of the same name (e.g. `app/api/market/portfolio`,
`app/api/admin/meal`, `app/api/toolbox/favorites`).

## Removed / retired features (don't resurrect assumptions from old docs)

These existed at some point in git history and were later **fully torn
out** (source, DB tables, dependencies) — if you see them mentioned in old
memory/notes/READMEs, they are **not** currently live:

- **Bio** (`bio.core47.xyz`, link-in-bio pages) and **Downloader**
  (`yt.core47.xyz`, universal video downloader) — shipped, then removed
  ("tear down Bio and Downloader tools, drop dead placeholder subdomains").
- **PDF Toolkit** (`pdf.core47.xyz`) and **File Converter**
  (`file.core47.xyz`) — shipped client-side (pdf.js/pdf-lib/mammoth/docx),
  caused Worker bundle-size problems, later fully removed ("drop PDF
  Toolkit and File Converter (source, DB, deps)").
- **Books** (`books.core47.xyz`, open-upload PDF/EPUB library) — shipped
  with EPUB/PDF metadata auto-fill, not present in the current tree either.

If asked to "add X back" or reference one of these, confirm with the user
first rather than assuming old docs are current.

## Tech stack

- **Framework**: Next.js 16 (App Router). Note the repo uses
  `middleware.ts`, not the newer `proxy.ts` convention — intentional,
  because `proxy.ts` only runs Node.js runtime, and `@opennextjs/cloudflare`
  requires Edge Runtime.
- **Runtime**: Cloudflare Workers, built via OpenNext (`@opennextjs/cloudflare`).
- **Database**: Cloudflare D1 (SQLite) via Drizzle ORM. Schema:
  [`db/schema.ts`](db/schema.ts) (~30 tables — users/sessions, tools/categories/
  favorites, shortlinks, blog, bucket-list (`list100_*`), market (portfolio,
  news, calendar, prices, fxtin), focus (tasks/sessions/sounds/themes), meal
  (recipes/foods/targets/plan entries)). Migrations: `db/migrations/*.sql`,
  113+ numbered files applied in order — most of the volume is meal-data
  seeding, not schema churn.
- **Storage**: Cloudflare R2 for uploaded images/audio (avatars, thumbnails,
  sound tracks).
- **Styling**: Tailwind CSS v4, CSS-first config in `app/globals.css` (no
  `tailwind.config.*` file).
- **Auth**: Custom session-based auth, no third-party provider —
  PBKDF2-SHA256 password hashing (100k iterations, per-user salt),
  `crypto.randomUUID()` session IDs, `httpOnly + secure + sameSite=lax`
  cookies. See `lib/auth/service.ts`.
- **No `.env`**: runtime secrets live in D1 singleton-row tables, set via
  `wrangler d1 execute`, never committed.
- **No cron**: no Cloudflare Cron Trigger wired up. Data-freshness (prices,
  news, calendar) uses lazy on-page-load refresh (`shouldRefresh(...)`)
  instead of scheduled jobs.

## Repo layout

```
app/
  tools/<subdomain>/   one folder per subdomain module (see middleware.ts)
  market/              market module (root-domain nested route, not subdomain-rewritten)
  blog/, bucket-list/, login/, profile/   root-domain routes
  api/<feature>/       route handlers, mirrors the feature folders in lib/
components/            React components, grouped by feature (matches app/ groupings)
lib/
  <feature>/schema.ts    Zod validation
  <feature>/service.ts   DB queries (Drizzle) + domain logic
  toolbox/               dev-toolbox tool implementations (cron, jwt, qr, sqlFormat, x509, yaml, gzip, iconMap, registry)
  auth/, rateLimit.ts, cors.ts, storage/   cross-cutting infra
db/
  schema.ts            Drizzle table definitions (source of truth for the DB shape)
  migrations/           numbered .sql migrations, applied in order, never edited after landing
  seed.sql              initial data
middleware.ts           subdomain → /tools/<subdomain> rewrite; to2.site standalone-domain handling
```

## Architecture notes worth knowing before making changes

- **One Worker, many subdomains** via `middleware.ts` host-based rewrite —
  no per-tool infra or separate deploys.
- **Worker bundle size is a hard constraint**: Cloudflare free plan caps
  the deployed script at 3 MiB gzip; `npm run deploy` fails outright
  (error 10027) if exceeded. This has already burned the project twice
  (`sanitize-html`, and client-only PDF libs getting pulled into the
  server bundle despite `"use client"`) — see `CONVENTIONS.md` for the
  exact fixes/patterns (hand-rolled sanitizer, `next/dynamic(..., {ssr:false})`,
  curated `lib/toolbox/iconMap.ts` instead of `import * as Icons`).
- **Admin-editable config over redeploys**: external API keys, symbol
  lists, source URLs live in singleton-row D1 tables, editable from
  `admin.core47.xyz`, so they change without a code deploy.
- **fxtin.com integration** uses that site's undocumented internal
  endpoints with the owner's explicit authorization (their own prior
  project) — see `CONVENTIONS.md` for scope.

## Full details live in CONVENTIONS.md

This file is deliberately just the map. For the actual rules —
step-by-step deploy sequence, secrets pattern, security baseline
(session auth, rate limiting, XSS sanitization, per-user scoping),
responsive-design patterns, R2 orphan-cleanup rules, and the Worker
bundle-size gotchas in full — read [`CONVENTIONS.md`](CONVENTIONS.md)
before making non-trivial changes. [`README.md`](README.md) has the
getting-started / local-dev instructions.
