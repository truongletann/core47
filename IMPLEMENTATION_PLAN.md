# CORE47 MOBILE — Implementation Plan

Status: **planning only, no app code written yet**, per the product spec's
explicit instruction to inspect the repo first. This document is the
required output of that inspection. Implementation starts only after this
plan is reviewed.

Source spec: `CORE47 MOBILE — PRODUCT & DEVELOPMENT SPEC.md` (user-provided).

---

## 1. What already exists (inspected, 2026-08-10)

- **Stack**: Next.js 16 App Router, Cloudflare Workers via OpenNext, D1 +
  Drizzle, R2, Tailwind v4, custom session auth. One repo, one Worker, no
  microservices. See `PROJECT_OVERVIEW.md` / `CONVENTIONS.md` (already
  read, both remain authoritative).
- **Auth** (`lib/auth/*`): PBKDF2-SHA256 sessions in D1 `sessions` table,
  delivered to browsers as an `httpOnly; secure; sameSite=lax;
  domain=.core47.xyz` cookie (`lib/auth/cookies.ts`). `requireUser(req)`
  (`lib/auth/guard.ts`) only ever reads the cookie. **No bearer/token path
  exists today** — a native mobile app cannot use this as-is.
- **Reusable modules and their current API surface**:
  - **Market**: `portfolioAssets`/`portfolioTransactions` (full CRUD under
    `/api/market/portfolio/**`), `priceSymbols` (OANDA + Binance
    *current* quote + today's OHLC only — **no historical candle
    storage**), `calendarEvents` (rolling-week economic calendar, wiped
    and reinserted, no per-user alerting), `newsArticles`/`rssSources`
    (`/api/market/news`), `fxtinNews` (flash headlines), a live OANDA
    pricing **SSE** proxy (`/api/market/prices/stream`, one upstream
    connection per open tab — not viable for a backgrounded mobile app).
  - **Focus**: `focusTasks`, `focusSessions`, `focusSettings`,
    sounds/playlists/themes — full CRUD under `/api/focus/**`, directly
    reusable as-is for Tasks/Pomodoro/Statistics.
  - **Bucket list / Goals**: `list100_items` — flat ranked list with
    `isDone`, `progressCurrent/Target`, no goal→milestone→task hierarchy.
  - **Meal**: full recipe/target/plan-entry system, P2 per spec, not
    touched in MVP.
  - Every user-owned table is scoped by `userId` on both read and write —
    confirmed consistent, must keep this pattern for every new table/query.
- **What does not exist at all**: watchlists, market/economic alerts, push
  tokens, any notification table, daily-priority/score/summary tables,
  trade journal/checklist, historical candle storage, and any background
  job runner.
- **Hard constraint already documented in `CONVENTIONS.md`**: *"There is no
  Cloudflare Cron Trigger in this OpenNext build (would require patching
  `.open-next/worker.js` post-build — too risky)."* This directly affects
  the push/alert architecture (see §5).
- **Worker bundle size** is capped at 3 MiB gzip (free plan) and has been
  broken twice before by careless dependencies — irrelevant to a separate
  mobile app's own bundle, but relevant if any *shared* code gets imported
  into `lib/`/`app/` (keep shared code dependency-free).

---

## 2. Tech choice: Expo / React Native

Per spec §65, evaluated against the two options:

- **Reuses TypeScript, Zod schemas, and the existing `types/` directly** —
  `lib/*/schema.ts` files can be imported by the mobile app if it lives in
  the same repo/workspace.
- **Expo push notification service** removes the need to stand up APNs/FCM
  certs for MVP (send one Expo push token, Expo fans it out to both
  platforms) — fits the "no infra we don't need" constraint and pairs with
  the `PushNotificationProvider` abstraction in §5.
- Flutter has no code-reuse benefit here and no stated reason to prefer it.

**Recommendation: Expo (React Native) with EAS Build**, TypeScript, no
justification found for Flutter.

---

## 3. Repository structure

New top-level `mobile/` folder, its own `package.json`/Expo project —
**not** part of the Next.js `app/`/Worker bundle, so it can add
React-Native-only dependencies freely without touching the 3 MiB gzip cap.

```
core47/
├── app/, components/, lib/, db/        (unchanged, web stays untouched)
├── mobile/
│   ├── app/            Expo Router screens (Home, Market, Focus, News, More)
│   ├── components/
│   ├── lib/
│   │   ├── api/          typed fetch client for core47's existing API
│   │   └── schema/        re-exports of shared lib/*/schema.ts Zod types
│   ├── hooks/
│   ├── services/         push registration, background fetch, offline cache
│   ├── app.json, eas.json
│   └── package.json      separate deps, separate lockfile
└── ...
```

This satisfies §66/68: no rewrite of existing modules, no second database,
no second auth system — the mobile app is a client of the same backend.

---

## 4. Auth: mobile bearer-token layer on the existing session system

Do **not** duplicate `users`/`sessions`. Extend them minimally:

- **Migration**: add nullable `platform` (`"web" | "ios" | "android"`) and
  `device_name` columns to `sessions` (op: `ALTER TABLE sessions ADD
  COLUMN ...`, defaults NULL for existing rows — no backfill needed).
- **New endpoint** `POST /api/mobile/auth/login` — same credential check as
  `loginUser()` (`lib/auth/service.ts`, unchanged), but returns the
  `sessionId` **in the JSON body** instead of only setting a cookie
  (native apps store it in `expo-secure-store`, never `AsyncStorage` —
  satisfies spec §41/§56 "no sensitive credentials in localStorage").
  Records `platform`/`deviceName` on the session row.
- **New guard** `lib/auth/mobileGuard.ts` → `requireUserBearer(req)`: reads
  `Authorization: Bearer <sessionId>`, otherwise identical logic to
  `getUserBySessionId` (same expiry/disabled checks — no new code path for
  the security-sensitive parts, just a different transport).
- Every new mobile-facing route calls `requireUserBearer` the same way
  every admin route calls `requireAdmin` today — same enforcement
  discipline, new function.
- `POST /api/mobile/auth/logout` deletes that one session row
  (`deleteSession`, already exists). "Logout all devices" already exists
  (`deleteAllSessionsForUser`) and now also kills mobile sessions for free,
  since they live in the same table.
- Rate-limit `/api/mobile/auth/login` with the existing `checkRateLimit`
  helper, same as the web login route.

No changes to the web cookie flow. No JWT, no second secret to manage.

---

## 5. Push notifications & background evaluation

### Abstraction (spec §54)

`lib/push/provider.ts`:

```ts
interface PushNotificationProvider {
  send(tokens: string[], payload: { title: string; body: string; data?: Record<string, unknown> }): Promise<void>;
}
```

`lib/push/expoProvider.ts` implements it via Expo's push HTTP API (no SDK
needed — plain `fetch` to `exp.host/--/api/v2/push/send`, one call, no new
dependency in the Worker bundle). Swapping to raw FCM/APNs later only
means adding a second implementation.

### New tables (migration, see §7)

- `push_tokens`: `id, user_id, token, platform, created_at, last_seen_at` —
  upsert on register (`ON CONFLICT(token) DO UPDATE`), deleted on
  `/api/mobile/push/unregister` and on account disable/logout-all.
- `notification_preferences`: one row per user, boolean per category
  (market/news/focus/tasks/goals/calendar) + quiet-hours start/end.

### The cron problem (must resolve before building alerts)

`CONVENTIONS.md` is explicit that this OpenNext build has **no Cloudflare
Cron Trigger** and getting one requires patching `.open-next/worker.js`
post-build, which the project has deliberately avoided as too risky. Market
alerts, movement/volatility detection, and time-based economic-event
reminders all conceptually want a server-side clock — that infra doesn't
exist yet.

**MVP approach (recommended, zero new infra risk)**: extend the repo's
existing "lazy on-demand refresh" pattern (`shouldRefresh(thresholdMinutes)`
in `lib/market/priceService.ts` / `newsService.ts`) to double as the alert
evaluator, and let the **mobile app's own background fetch** be the
trigger instead of a page load:

```
Expo BackgroundFetch/TaskManager (~15 min min interval, OS-throttled)
   → GET /api/mobile/tick
        → refreshes prices/calendar/news if stale (existing pattern)
        → evaluates active market_alerts + economic reminders against fresh data
        → sends push via PushNotificationProvider for anything newly triggered
```

This reuses 100% of the existing refresh code path and adds no scheduler.
**Trade-off, stated plainly**: iOS/Android background fetch intervals are
OS-controlled and not guaranteed (can be 15 min to several hours, or
suppressed if the app is force-quit) — acceptable for MVP price/movement
alerts, **not** acceptable for a "notify me exactly 30 min before CPI"
guarantee.

**P1 upgrade path**: if exact-time economic-event reminders become a hard
requirement, do a dedicated spike on adding a real Cloudflare Cron Trigger
(`wrangler.toml [triggers] crons` + a `scheduled()` export, verifying it
survives an OpenNext build/deploy) — flagged as research, not assumed to
work, per spec §55/§68 ("không giả định cron đã tồn tại").

This is a real architecture decision, not a detail — flagging it now rather
than discovering it mid-build.

---

## 6. New API surface

Prefer extending existing feature-first routes over forcing a `/mobile`
prefix (spec §53), except where the mobile client genuinely needs
something web doesn't:

| Endpoint | Reuses | Notes |
|---|---|---|
| `POST /api/mobile/auth/login` | `loginUser()` | new — bearer response |
| `POST /api/mobile/auth/logout` | `deleteSession()` | new |
| `GET /api/auth/me` | as-is | works once guard accepts bearer too |
| `GET /api/mobile/dashboard` | portfolio/price/calendar/news/focus/list100 services | **new, single aggregator** for Home — one round trip, partial-failure-tolerant per module (spec §43/§58: one module erroring returns `null`/`unavailable` for that section, not a 500) |
| `GET/POST/DELETE /api/market/watchlist` | new table | new |
| `GET/POST/PATCH/DELETE /api/market/alerts` | new table | new |
| `GET /api/market/instruments/[symbol]/candles?range=` | OANDA/Binance historical endpoints | new — see §6.1 |
| `GET /api/market/portfolio/**` | existing | unchanged |
| `GET /api/market/news`, `/api/market/calendar` (new) | existing `newsService`/`calendarService` | calendar needs a thin new route, service logic exists |
| `GET/POST/PATCH/DELETE /api/focus/tasks`, `/api/focus/sessions`, `/api/focus/settings` | existing | unchanged, just called with bearer auth |
| `GET/PATCH /api/list100` (goals) | existing `list100/service.ts` | unchanged |
| `GET/PUT /api/mobile/daily/priority` | new table | new |
| `POST /api/mobile/push/register`, `DELETE /api/mobile/push/unregister` | new table | new |
| `GET/PUT /api/mobile/notifications/preferences` | new table | new |
| `GET /api/mobile/tick` | see §5 | new — background-fetch trigger endpoint |

### 6.1 Market Detail chart data — a real gap

`priceSymbols` only stores the *current* quote and *today's* OHLC. There is
no historical candle storage anywhere in the repo. For the 1H/4H/1D/1W/1M/1Y
chart ranges (spec §7), the MVP will **proxy live to the upstream API on
each request** (OANDA `/v3/instruments/{name}/candles` for OANDA symbols,
Binance `/api/v3/klines` for Binance symbols — both already have client
libs in `lib/market/binanceClient.ts` / `lib/market/oandaInstruments.ts` to
extend) rather than building a new time-series table. Cache each
`(symbol, range)` response in D1 for a short TTL (e.g. 1–5 min depending on
range) using the same lazy-refresh pattern, to avoid hammering upstream on
every pull-to-refresh. Building real OHLC storage is a P2 concern if proxy
latency/rate-limits become a problem in practice — not assumed necessary
up front.

---

## 7. New tables (single migration `0109_mobile.sql`)

Only what P0 actually needs; everything the spec marks P1/P2 (trade
journal/checklist, daily score/summary, notification center, economic
alert preferences) is deliberately **not** created yet — added in a later
migration when that milestone starts, per spec §52 ("chỉ tạo thêm khi
cần").

```sql
ALTER TABLE sessions ADD COLUMN platform TEXT;
ALTER TABLE sessions ADD COLUMN device_name TEXT;

CREATE TABLE watchlist_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  source TEXT NOT NULL,        -- 'oanda' | 'binance' | 'vn_gold'
  label TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE market_alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  source TEXT NOT NULL,
  alert_type TEXT NOT NULL,    -- 'price_above' | 'price_below' | 'percent_change' | 'movement'
  threshold_value REAL NOT NULL,
  window_minutes INTEGER,      -- movement alerts only
  is_recurring INTEGER NOT NULL DEFAULT 0,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  last_triggered_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE push_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL,      -- 'ios' | 'android'
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL
);

CREATE TABLE notification_preferences (
  user_id TEXT PRIMARY KEY,
  market INTEGER NOT NULL DEFAULT 1,
  news INTEGER NOT NULL DEFAULT 1,
  focus INTEGER NOT NULL DEFAULT 1,
  tasks INTEGER NOT NULL DEFAULT 1,
  goals INTEGER NOT NULL DEFAULT 1,
  calendar INTEGER NOT NULL DEFAULT 1,
  quiet_hours_start TEXT,
  quiet_hours_end TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE daily_priorities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,          -- ISO date, one active row per user per day
  title TEXT NOT NULL,
  source_type TEXT NOT NULL,   -- 'manual' | 'task' | 'goal'
  task_id TEXT,
  goal_id TEXT,
  duration_minutes INTEGER,
  is_done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
```

Applied local → verify in browser tools (Expo web preview or a REST client
against `localhost`) → applied remote, per the deploy workflow already in
`CONVENTIONS.md`. Never edits an already-applied migration.

---

## 8. Security (spec §56, matches existing baseline — no regressions)

- Every new route: `requireUserBearer()`, bail on `null`, scope every
  query by `userId` (`and(eq(table.id, id), eq(table.userId, userId))`) —
  identical discipline to every existing user-owned-resource route.
- Zod schema per new input type, same as every `lib/*/schema.ts` today.
- `push_tokens.token` never returned to any client in a list response
  (write-only from the client's perspective) — same "don't round-trip
  secrets" principle CONVENTIONS.md already enforces for API keys.
- No API keys shipped in the mobile bundle — OANDA/Binance calls stay
  server-side behind the existing routes, mobile only ever talks to
  core47's own API.
- Session token stored via `expo-secure-store` (Keychain/Keystore-backed),
  never `AsyncStorage`.
- `/api/mobile/auth/login` and `/api/mobile/push/register` behind
  `checkRateLimit`, same as every other public/write endpoint.

---

## 9. MVP milestones — reordered around the 3 signature features (2026-08-10)

User picked a different priority than the spec's default P0 list: instead
of building Market/News/Focus screens breadth-first, lead with the three
features most likely to make someone open the app daily —
**① Smart Alerts → ② Daily Briefing → ③ Daily Command Center (Home)** —
then fill in the rest of P0 breadth after. Milestones below reflect that.

Daily Briefing is **data-only for MVP, no AI**: a straight aggregation of
existing numbers (price/%, count of important news, count of calendar
events) per spec §14's own example — no AI provider, no new secret, no
scope increase. AI News Digest (spec §18) stays P2, unchanged, revisited
only if/when an AI provider is actually wanted.

1. **Auth**: migration (session columns), `requireUserBearer`, mobile
   login/logout routes, Expo app shell + secure-store token storage.
   *DoD: login, session persists, logout, expired/disabled session rejected.*
2. **① Smart Alerts**: `market_alerts` + `push_tokens` +
   `notification_preferences` tables (§7), `PushNotificationProvider` /
   `ExpoProvider` (§5), `/api/market/alerts` CRUD, `/api/mobile/push/*`,
   `/api/mobile/tick` background-fetch endpoint that refreshes prices and
   evaluates alerts (§5's lazy-refresh-as-evaluator approach). Ships before
   Watchlist UI — alerts can target a symbol directly, watchlist is just a
   convenience list on top, not a dependency.
   *DoD: user creates a price alert, receives a push for it (spec §70.6).*
3. **② Daily Briefing**: a `GET /api/mobile/daily/briefing` endpoint —
   pure aggregation query (no new table) over `priceSymbols`/`vnGoldPrices`
   (direction per symbol), `calendarEvents` (today's count + high-impact
   count), `newsArticles` (today's "important"-flagged count — see note
   below on what "important" means without AI). Rendered as the spec §14
   example: Gold/USD/Crypto direction + event/news counts, readable in
   ~30s.
   *Note*: spec's news items have no `important` flag today (only fxtin
   news does, `fxtinNews.important`). For Daily Briefing's "3 important
   stories" count, MVP uses **fxtin flash news' existing `important` flag**
   rather than inventing a scoring rule for RSS articles — real data,
   zero new logic. A proper "important" concept for RSS-sourced articles
   is P1/P2 (ties into News Deduplication, spec §17, also not built yet).
4. **③ Daily Command Center (Home)**: `/api/mobile/dashboard` aggregator
   combining Smart Alerts state + Daily Briefing + today's Focus stats
   (`focusSessions`) + Goals progress (`list100_items`) + `daily_priorities`
   (add this table now, from §7, since Home's "Today's Priority" card
   needs it) — one round trip, partial-failure-tolerant per section (spec
   §43/§58). Home screen with skeleton loading + pull-to-refresh.
   *DoD: Home loads in reasonable time, shows market snapshot, doesn't
   crash if one module errors (spec §70.2-3).*
5. **Market breadth**: watchlist table + routes, asset detail + candle
   proxy (§6.1), portfolio screens on existing API.
6. **Focus breadth**: screens on existing `/api/focus/**`, background
   timer behavior verified (spec §69 "Background behavior").
7. **News breadth**: feed/categories/article/save on existing
   `/api/market/news` (add a `saved_articles(user_id, article_id)` table —
   existing schema has no per-user save state).
8. **Goals breadth**: read-only Goals summary + list on existing
   `/api/list100`.
9. **Offline basics**: local cache for Focus/Tasks/watchlist/saved-news per
   spec §42, simple last-write-wins sync (explicit conflict handling is a
   P1 refinement, not blocking MVP per DoD §70 item 18 "xử lý offline cơ
   bản").

### Deferred features from the user's "đáng làm" list — where they land

These were all in the original spec already; confirming they're not
dropped, just sequenced after the MVP trio above, each with its own
migration when its milestone starts (not pre-built now, per spec §52):

| Feature | Spec § | Priority | New table needed later |
|---|---|---|---|
| Economic Calendar event alerts (exact-time, e.g. "CPI in 30 min") | §13 | P1 | `economic_alert_preferences`; **needs the real-cron spike from §5**, background-fetch timing isn't precise enough for this one |
| Market Alarm / volatility ("BTC volume tăng đột biến") | §6 | P1 | none new — extends `market_alerts.alert_type` with a `volatility` kind once a baseline/stddev calc exists |
| AI News Digest | §18 | P2 | none new — output cached alongside `newsArticles`; blocked on choosing an AI provider (must follow the existing admin-editable-secret pattern, never hard-coded) |
| Portfolio Journal (entry/exit thesis, emotion, screenshot) | §10 | P1 | `trade_journal` (+ R2 key for screenshot, cleaned up on delete per the R2-orphan convention) |
| Trading Checklist | §11 | P1 | `trade_checklist_templates` (+ per-trade answers, likely folded into `trade_journal`) |
| Focus + Market notification mode ("Critical only" while focusing) | §25 | P1 | none new — a field on `notification_preferences` (already created in milestone 2) plus a check in the push-send path |
| While You Were Away | §19 | P1 | none new — same aggregation style as Daily Briefing, keyed off "since last app open" instead of "today" |
| Core47 Score | §29 | P1 | `daily_scores` — needs Task/Focus/Goal completion formulas defined first (spec explicitly says no AI needed) |
| Goal → Milestone → Task → Focus hierarchy | §27 | P1 | requires reshaping `list100_items` (flat ranked list today) into a real goal/milestone/task tree — a real schema change, not additive; worth its own design pass, not a quick add-on |
| "One thing today" | §28 | folded into Home | already covered — this *is* `daily_priorities` + the Home priority card in milestone 4, not a separate feature |

Everything else in the spec (§61 P1, §62 P2 generally) stays deferred as
originally planned.
