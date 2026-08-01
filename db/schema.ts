import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const tools = sqliteTable("tools", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  icon: text("icon").notNull(),
  categoryId: text("category_id").notNull(),
  status: text("status", { enum: ["active", "beta", "soon"] })
    .notNull()
    .default("active"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const shortLinks = sqliteTable("short_links", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  targetUrl: text("target_url").notNull(),
  clicks: integer("clicks").notNull().default(0),
  createdAt: text("created_at").notNull(),
  // NEW — tracks who created the link and from where
  userId: text("user_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

// NEW — users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").unique(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  isAdmin: integer("is_admin").notNull().default(0),
  isDisabled: integer("is_disabled").notNull().default(0),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  lastLoginAt: text("last_login_at"),
  createdAt: text("created_at").notNull(),
});

// NEW — session table
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
});

// Fixed-window request counters, e.g. "login:203.0.113.4" — used to throttle
// abuse-prone public endpoints (login, register, shortlink creation, ...).
export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: text("window_start").notNull(),
});

// NEW — user's favorite tools in the toolbox
export const toolFavorites = sqliteTable("tool_favorites", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  toolSlug: text("tool_slug").notNull(),
  createdAt: text("created_at").notNull(),
});

// NEW — Bucket List item ("things to do before I die", no fixed count)
export const list100Items = sqliteTable("list100_items", {
  id: text("id").primaryKey(),
  rank: integer("rank").notNull(),
  title: text("title").notNull(),
  note: text("note"), // short note shown in parentheses, optional
  link: text("link"), // reference link/article, optional
  isDone: integer("is_done").notNull().default(0),
  completedAt: text("completed_at"), // auto-set when isDone flips to true
  progressCurrent: integer("progress_current"), // e.g. books read so far, optional
  progressTarget: integer("progress_target"), // e.g. 1000 books goal, optional
  isPinnedEnd: integer("is_pinned_end").notNull().default(0), // always sorts after non-pinned items, regardless of rank
  isPublic: integer("is_public").notNull().default(1), // hidden from the public page if = 0
  suggestedBy: text("suggested_by"), // suggester's name (if created from an approved suggestion), admin-only
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// NEW — Bucket List item suggestions submitted from the public page, admin approves manually
export const list100Suggestions = sqliteTable("list100_suggestions", {
  id: text("id").primaryKey(),
  name: text("name"), // suggester's name, optional
  content: text("content").notNull(),
  createdAt: text("created_at").notNull(),
});

// NEW — Blog posts, Markdown content, managed via the admin CMS
export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(), // markdown
  coverImageKey: text("cover_image_key"), // key in the AVATARS R2 bucket, blog-covers/ prefix
  tags: text("tags"), // comma-separated
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  publishedAt: text("published_at"), // auto-set the first time it switches to published
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// NEW — Market: portfolio assets a user tracks for DCA/PnL. currentPrice is
// manually entered by the user until a live price feed is wired up later.
export const portfolioAssets = sqliteTable("portfolio_assets", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  assetType: text("asset_type", {
    enum: ["gold", "silver", "forex", "coffee", "pepper", "custom"],
  }).notNull(),
  customName: text("custom_name"), // required when assetType = "custom"
  unit: text("unit").notNull(), // e.g. "lượng", "ounce", "kg", "USD"
  currentPrice: real("current_price").notNull().default(0),
  currentPriceUpdatedAt: text("current_price_updated_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// NEW — Market: buy/sell transactions against a portfolio asset
export const portfolioTransactions = sqliteTable("portfolio_transactions", {
  id: text("id").primaryKey(),
  assetId: text("asset_id").notNull(),
  userId: text("user_id").notNull(), // denormalized for admin cross-user queries
  type: text("type", { enum: ["buy", "sell"] }).notNull(),
  quantity: real("quantity").notNull(),
  pricePerUnit: real("price_per_unit").notNull(),
  note: text("note"),
  txDate: text("tx_date").notNull(),
  createdAt: text("created_at").notNull(),
});

// NEW — Market: RSS feed sources, admin-managed
export const rssSources = sqliteTable("rss_sources", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  category: text("category"), // free text, e.g. "forex", "macro", "crypto"
  enabled: integer("enabled").notNull().default(1),
  createdAt: text("created_at").notNull(),
});

// NEW — Market: aggregated news articles fetched from rss_sources
export const newsArticles = sqliteTable("news_articles", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull(),
  title: text("title").notNull(),
  link: text("link").notNull().unique(), // dedup key
  summary: text("summary"),
  imageUrl: text("image_url"),
  publishedAt: text("published_at").notNull(),
  fetchedAt: text("fetched_at").notNull(),
});

// NEW — Market: economic calendar events, mirrored from fxtin.com's
// calendarEvents endpoint (per-day, so a full week is 7 requests).
// Refreshed wholesale (delete + reinsert) since it's always a rolling week
// snapshot, not a historical log.
export const calendarEvents = sqliteTable("calendar_events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  country: text("country").notNull(), // currency code, e.g. USD, EUR, JPY
  eventDate: text("event_date").notNull(), // ISO date, e.g. 2026-07-27
  eventTime: text("event_time"), // raw "HH:MM", already Asia/Bangkok (= VN time)
  impact: text("impact", { enum: ["holiday", "low", "medium", "high"] })
    .notNull()
    .default("low"), // derived from star: >=4 high, ==3 medium, else low
  forecast: text("forecast"),
  previous: text("previous"),
  actual: text("actual"),
  sourceUrl: text("source_url"), // unused by fxtin (no per-event article link)
  sortOrder: integer("sort_order").notNull().default(0), // preserves the feed's original ordering
  fetchedAt: text("fetched_at").notNull(),
  star: integer("star").notNull().default(0), // fxtin's raw 0-5 importance rating
  influence: integer("influence"), // fxtin's bull/bear/neutral marker, nullable
  flagUrl: text("flag_url"), // country flag image URL
  eventKind: text("event_kind", { enum: ["economic", "speech"] }).notNull().default("economic"),
});

// NEW — Market: singleton row holding the calendar API base URL, editable
// from the admin CMS so the source can change without a code deploy.
export const calendarSettings = sqliteTable("calendar_settings", {
  id: text("id").primaryKey(), // fixed to "default", single row
  todayFeedUrl: text("today_feed_url"), // unused, kept for schema compat
  thisWeekFeedUrl: text("thisweek_feed_url").notNull(), // fxtin calendarEvents base URL
  fieldMapping: text("field_mapping"), // unused, kept for schema compat
  updatedAt: text("updated_at").notNull(),
});

// NEW — Market: fxtin.com's real-time flash news ("Latest Stories"),
// distinct from the RSS-aggregated News tab. Polled via lazy refresh
// (no server-side WebSocket in this serverless deployment).
export const fxtinNews = sqliteTable("fxtin_news", {
  id: text("id").primaryKey(),
  informationId: text("information_id").notNull().unique(), // fxtin's own id, dedup key
  content: text("content").notNull(), // Vietnamese-translated text
  time: text("time"), // raw "HH:MM:SS", Asia/Bangkok
  important: integer("important").notNull().default(0),
  publishedAt: text("published_at").notNull(), // "YYYY-MM-DD HH:MM:SS", Asia/Bangkok
  fetchedAt: text("fetched_at").notNull(),
});

// NEW — Market: singleton row holding the OANDA credentials, editable
// from the admin CMS. Never committed to git — set directly via SQL or the
// admin form, same secret-handling convention as any other credential.
// twelveDataApiKey is a leftover column from the retired Twelve Data
// integration; no code reads/writes it anymore.
export const priceSettings = sqliteTable("price_settings", {
  id: text("id").primaryKey(), // fixed to "default", single row
  twelveDataApiKey: text("twelve_data_api_key"),
  oandaApiKey: text("oanda_api_key"),
  oandaAccountId: text("oanda_account_id"),
  oandaEnvironment: text("oanda_environment").notNull().default("practice"), // "practice" | "live"
  updatedAt: text("updated_at").notNull(),
});

// NEW — Focus: Pomodoro tasks. Anonymous data lives only in localStorage
// and never reaches these tables until the user logs in and imports it.
export const focusTasks = sqliteTable("focus_tasks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  estimatedPomodoros: integer("estimated_pomodoros").notNull().default(1),
  completedPomodoros: integer("completed_pomodoros").notNull().default(0),
  isDone: integer("is_done").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

// NEW — Focus: a completed Pomodoro work/break session, logged for stats.
export const focusSessions = sqliteTable("focus_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  taskId: text("task_id"),
  type: text("type", { enum: ["work", "break"] }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  completedAt: text("completed_at").notNull(),
  createdAt: text("created_at").notNull(),
});

// NEW — Focus: user-defined habits (separate from Pomodoro tasks)
export const focusHabits = sqliteTable("focus_habits", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

// NEW — Focus: one check-in per habit per day
export const focusHabitLogs = sqliteTable("focus_habit_logs", {
  id: text("id").primaryKey(),
  habitId: text("habit_id").notNull(),
  logDate: text("log_date").notNull(), // "YYYY-MM-DD"
  createdAt: text("created_at").notNull(),
});

// NEW — Focus: saved sound+scene+duration combos for one-tap reuse
export const focusPresets = sqliteTable("focus_presets", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  soundIds: text("sound_ids").notNull(), // JSON array of {id, volume}
  sceneKey: text("scene_key").notNull(),
  workMinutes: integer("work_minutes").notNull().default(25),
  breakMinutes: integer("break_minutes").notNull().default(5),
  createdAt: text("created_at").notNull(),
});

// NEW — Focus: singleton row of default timer durations, admin-editable
export const focusSettings = sqliteTable("focus_settings", {
  id: text("id").primaryKey(), // fixed to "default", single row
  workMinutes: integer("work_minutes").notNull().default(25),
  breakMinutes: integer("break_minutes").notNull().default(5),
  longBreakMinutes: integer("long_break_minutes").notNull().default(15),
  sessionsBeforeLongBreak: integer("sessions_before_long_break").notNull().default(4),
  updatedAt: text("updated_at").notNull(),
});

// NEW — Focus: ambient sound library, admin-managed. "bundled" tracks ship
// as static files in public/sounds/, "r2" tracks are uploaded to the
// FOCUS_SOUNDS bucket, "external" tracks point straight at a CDN URL.
export const focusSoundTracks = sqliteTable("focus_sound_tracks", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // free text, e.g. "rain", "thunder", "nature"
  source: text("source", { enum: ["bundled", "r2", "external"] }).notNull(),
  urlOrKey: text("url_or_key").notNull(), // public path, R2 key, or external URL
  isEnabled: integer("is_enabled").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

// NEW — Focus: curated Spotify playlist embeds, admin-managed
export const focusPlaylists = sqliteTable("focus_playlists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  spotifyEmbedUrl: text("spotify_embed_url").notNull(),
  category: text("category"), // free text, e.g. "lofi", "jazz", "chill"
  isEnabled: integer("is_enabled").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  // Cover art fetched lazily from Spotify's public oEmbed endpoint (official
  // metadata meant for embedding, not scraped) and cached here.
  thumbnailUrl: text("thumbnail_url"),
});

// NEW — Focus: unified Ambience theme catalog (replaces the old separate
// focus_scenes + focus_scene_backgrounds pair). Each row is one pickable
// background: "canvas" kinds render one of the built-in lightweight
// procedural animations (near-zero server cost), "image" kinds are a
// static photo (R2 or external URL), "youtube" kinds embed a video —
// deliberately no raw R2-hosted video anymore, since serving large video
// files through the Worker was pushing requests over the CPU-time limit
// on the Workers Free plan.
export const focusThemes = sqliteTable("focus_themes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // free text, e.g. "Lofi", "City", "Nature", "Study"
  kind: text("kind", { enum: ["canvas", "image", "youtube"] }).notNull(),
  source: text("source", { enum: ["canvas", "r2", "external", "youtube"] }).notNull(),
  urlOrKey: text("url_or_key").notNull(), // canvas scene key / R2 key / external URL / YouTube video ID
  thumbnailUrl: text("thumbnail_url"), // grid preview — auto-derived for youtube, same as urlOrKey for images
  startSeconds: integer("start_seconds"), // youtube only — loop window start
  endSeconds: integer("end_seconds"), // youtube only — loop window end
  isEnabled: integer("is_enabled").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

// NEW — Market: World prices (OANDA + Binance instruments) shown on
// /market/prices. Admin manages which symbols are tracked ("+ Add symbol");
// the fetch job writes the latest quote directly onto each row (small
// dataset, no need for a separate quotes table).
export const priceSymbols = sqliteTable("price_symbols", {
  id: text("id").primaryKey(),
  symbol: text("symbol").notNull().unique(), // "XAU_USD" (OANDA) or "BTCUSDT" (Binance)
  source: text("source").notNull().default("oanda"), // "oanda" | "binance"
  label: text("label").notNull(), // display name, e.g. "Gold"
  unit: text("unit").notNull(), // e.g. "USD/oz", "VND"
  enabled: integer("enabled").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  lastPrice: real("last_price"),
  lastChangePercent: real("last_change_percent"),
  lastFetchedAt: text("last_fetched_at"),
  createdAt: text("created_at").notNull(),
});

// NEW — Market: Vietnam domestic gold (SJC/DOJI/PNJ), shown on
// /market/prices. Uses vang.today's public aggregator API (free, no key,
// CORS-open, and — unlike SJC's own endpoint or Binance — not blocked from
// this Worker's network), so this follows the normal lazy-refresh + D1
// cache pattern instead of the client-side workaround needed for those.
export const vnGoldPrices = sqliteTable("vn_gold_prices", {
  id: text("id").primaryKey(),
  typeCode: text("type_code").notNull(), // vang.today's own code, e.g. "SJL1L10"
  label: text("label").notNull(),
  unit: text("unit").notNull().default("đ/lượng"),
  buyPrice: real("buy_price"),
  sellPrice: real("sell_price"),
  changePercent: real("change_percent"),
  sortOrder: integer("sort_order").notNull().default(0),
  lastFetchedAt: text("last_fetched_at"),
});

// NEW — Bio: one link-in-bio page per user, published at bio.core47.xyz/<username>
// (reuses users.username as the public slug — no separate slug column needed).
export const bioPages = sqliteTable("bio_pages", {
  userId: text("user_id").primaryKey(),
  title: text("title").notNull().default(""),
  bio: text("bio").notNull().default(""),
  theme: text("theme").notNull().default("sunset"),
  buttonStyle: text("button_style", { enum: ["solid", "outline", "soft"] })
    .notNull()
    .default("solid"),
  isPublished: integer("is_published").notNull().default(1),
  // The to2.site short code minted the first time the owner asks to share
  // the page — reused on subsequent shares instead of minting a new one.
  shortCode: text("short_code"),
  bannerKey: text("banner_key"), // R2 key in AVATARS bucket, bio-banner/ prefix — optional wide cover image
  backgroundColor: text("background_color"), // hex — used when theme = "custom"
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// NEW — Bio: individual links/social icons/section-headers on a bio page
export const bioLinks = sqliteTable("bio_links", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  kind: text("kind", { enum: ["link", "social"] }).notNull().default("link"),
  platform: text("platform"), // social kind only — "github" | "instagram" | "tiktok" | "facebook" | "youtube" | "twitter" | "telegram" | "zalo" | "email" | "website"
  title: text("title"),
  url: text("url").notNull(),
  icon: text("icon"), // link kind only — lucide-react icon name override
  isEnabled: integer("is_enabled").notNull().default(1),
  clicks: integer("clicks").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  color: text("color"), // hex — per-link button color override, null = theme default
  subtitle: text("subtitle"), // small text line under the title (card-style rendering)
  thumbnailKey: text("thumbnail_key"), // R2 key in AVATARS bucket, bio-link-thumb/ prefix
  isHeader: integer("is_header").notNull().default(0), // renders as a plain section label, no button (url unused, kept "#")
  createdAt: text("created_at").notNull(),
});

// NEW — Downloader (yt.core47.xyz): singleton row holding the configurable
// media-resolver backend. Cloudflare Workers can't run yt-dlp/ffmpeg, so
// this proxies to an external Cobalt-API-compatible instance (self-hosted
// or third-party) that the admin points at — same "external config,
// no redeploy" pattern as calendarSettings/priceSettings.
export const downloaderSettings = sqliteTable("downloader_settings", {
  id: text("id").primaryKey(), // fixed to "default", single row
  apiBaseUrl: text("api_base_url"),
  apiKey: text("api_key"),
  updatedAt: text("updated_at").notNull(),
});
