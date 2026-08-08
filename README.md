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

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Since routing is
host-based, visiting a tool's own experience locally means setting the
`Host` header or editing `/etc/hosts` to point e.g. `market.localhost` at
`127.0.0.1` — otherwise `localhost` always serves the root hub page.

### Database

Schema and seed data live in [`db/`](db), managed with Drizzle. Apply
migrations locally with Wrangler:

```bash
npx wrangler d1 execute core47-db --local --file=db/migrations/<file>.sql
```

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production Next.js build |
| `npm run lint` | ESLint |
| `npm run preview` | Build + preview the Cloudflare Workers bundle locally |
| `npm run deploy` | Build + deploy to Cloudflare Workers |
| `npm run cf-typegen` | Regenerate `cloudflare-env.d.ts` from `wrangler.jsonc` bindings |

## Project conventions

Repo-specific rules, gotchas, and established patterns (deploy workflow,
secrets handling, Workers bundle-size limits, RWD patterns, R2 cleanup
rules, security baseline) are documented in [`CONVENTIONS.md`](CONVENTIONS.md).
Read it before making non-trivial changes.

## Contributing

This is a personal project, but see [`CONTRIBUTING.md`](CONTRIBUTING.md) if
you'd like to report a bug or suggest a change.

## License

All rights reserved. This source is public for transparency; no license is
granted to copy, modify, or redistribute it.
