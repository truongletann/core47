# core47

[![core47.xyz](https://img.shields.io/badge/live-core47.xyz-0ea5e9)](https://core47.xyz)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Cloudflare Workers](https://img.shields.io/badge/deployed%20on-Cloudflare%20Workers-f38020?logo=cloudflare)](https://workers.cloudflare.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

**[core47.xyz](https://core47.xyz)** is a personal hub of small web tools and
finance-tracking utilities, built as a single Next.js app and served across
multiple subdomains (`market.core47.xyz`, `tools.core47.xyz`,
`shortlink.core47.xyz`, `blog.core47.xyz`, ...) from one Cloudflare Workers
deployment.

## What's in here

| Module | Subdomain | Description |
|---|---|---|
| **Market** | `market.core47.xyz` | Personal portfolio tracker, economic calendar, forex/crypto news, live prices (Binance, OANDA, VN gold) |
| **Toolbox** | `tools.core47.xyz` | Small dev utilities — JSON/SQL/XML formatters, Base64/URL/JWT encoders, hash & UUID generators, QR codes, cron parser |
| **Shortlink** | `shortlink.core47.xyz`, `to2.site` | Link shortener with click analytics |
| **Blog** | `blog.core47.xyz` | Markdown-based personal blog |
| **Focus** | `focus.core47.xyz` | Pomodoro/focus timer with ambient sounds |
| **Meal planner** | `meal.core47.xyz` | Recipes, per-ingredient calorie calculation, daily menu planning |
| **Bucket list** | `core47.xyz/bucket-list` | Personal goal tracker |
| **Keyboard tester** | `keyboard.core47.xyz` | Browser-based keyboard/key-press tester |
| **Random tools** | `random.core47.xyz` | Random pickers / generators |
| **Admin** | `admin.core47.xyz` | Internal dashboard for managing the above (API keys, symbols, tool config) |

Routing between these is handled by a single [`middleware.ts`](middleware.ts)
that rewrites `<subdomain>.core47.xyz/*` to `/tools/<subdomain>/*` — no
per-tool deployment needed.

## Tech stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com), built via [OpenNext](https://opennext.js.org/cloudflare)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) via [Drizzle ORM](https://orm.drizzle.team)
- **Storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/) for uploaded images/audio
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config)
- **Auth**: Custom session-based auth — PBKDF2-SHA256 password hashing, `httpOnly` cookies, no third-party auth provider

## Getting started

Requires **Node.js >= 20.9**.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Since routing is
host-based, visiting a tool's own experience locally means setting the
`Host` header or editing `/etc/hosts` to point e.g. `market.localhost` at
`127.0.0.1` — otherwise `localhost` always serves the root hub page.

D1 and R2 bindings work out of the box under `next dev` — no separate
`wrangler dev` process needed — thanks to `initOpenNextCloudflareForDev()`
in [`next.config.js`](next.config.js), which points them at Wrangler's
local emulated state (`.wrangler/`, gitignored).

### Database

Schema and migrations live in [`db/migrations`](db/migrations), managed
with Drizzle. On a fresh clone, apply every migration in order to build
the local D1 database:

```bash
for f in db/migrations/*.sql; do
  npx wrangler d1 execute core47-db --local --file="$f"
done
```

When adding a schema change, add the next numbered migration file and
apply just that one locally the same way (see
[`CONVENTIONS.md`](CONVENTIONS.md) for the full deploy workflow, including
applying it to the remote database).

### Secrets

There's no `.env` — runtime secrets (API keys, etc.) live in D1 tables and
are set directly via `wrangler d1 execute`, never committed. See the
**Secrets** section in [`CONVENTIONS.md`](CONVENTIONS.md).

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production Next.js build |
| `npm run lint` | ESLint |
| `npm run preview` | Build + preview the Cloudflare Workers bundle locally |
| `npm run deploy` | Build + deploy to Cloudflare Workers |
| `npm run cf-typegen` | Regenerate `cloudflare-env.d.ts` from `wrangler.jsonc` bindings |

## Project structure

```
app/            Next.js App Router routes
  tools/<slug>/   one folder per subdomain (see middleware.ts rewrite)
  api/            route handlers
  market/         market module pages (nested under app/, not app/tools)
components/     React components, grouped by feature
lib/            business logic / services, grouped by feature
  <feature>/schema.ts    Zod validation
  <feature>/service.ts   DB queries (Drizzle) + domain logic
db/
  schema.ts       Drizzle table definitions
  migrations/     numbered .sql migrations, applied in order
  seed.sql        initial data
middleware.ts   subdomain → /tools/<subdomain> rewrite (see below)
```

## Architecture notes

- **One Worker, many subdomains.** [`middleware.ts`](middleware.ts) rewrites
  `<subdomain>.core47.xyz/*` to `/tools/<subdomain>/*` before Next.js
  routing runs, so every tool ships as part of the same deploy — no
  per-tool infra.
- **No cron.** Cloudflare Cron Triggers aren't wired into this OpenNext
  build. Instead, data-freshness features (prices, news, calendar) check
  `shouldRefresh(thresholdMinutes)` on page load and refetch lazily,
  caching the result in D1.
- **Admin-editable config over redeploys.** External API keys, symbol
  lists, and source URLs live in singleton-row D1 tables editable from
  `admin.core47.xyz`, so they can change without touching code or
  redeploying.
- **Worker bundle size is a hard constraint.** Cloudflare's free plan caps
  the deployed script at 3 MiB gzip. This ruled out `sanitize-html` (the
  blog markdown sanitizer is hand-rolled instead) and shapes how
  browser-only libraries and icon sets get imported — see
  [`CONVENTIONS.md`](CONVENTIONS.md) for the specifics and why.

## Project conventions

Repo-specific rules, gotchas, and established patterns (deploy workflow,
secrets handling, Workers bundle-size limits, RWD patterns, R2 cleanup
rules, security baseline) are documented in [`CONVENTIONS.md`](CONVENTIONS.md).
Read it before making non-trivial changes.

## Contributing

This is a personal project, but see [`CONTRIBUTING.md`](CONTRIBUTING.md) if
you'd like to report a bug or suggest a change. Found a security issue?
See [`SECURITY.md`](SECURITY.md) instead of opening a public issue.

## License

All rights reserved. This source is public for transparency; no license is
granted to copy, modify, or redistribute it.
