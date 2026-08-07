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
  contentHtml: text("content_html"), // rendered HTML, computed once on create/update — see 0050_blog_content_html
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

// NEW — Focus: singleton row of default timer durations, admin-editable
export const focusSettings = sqliteTable("focus_settings", {
  id: text("id").primaryKey(), // fixed to "default", single row
  workMinutes: integer("work_minutes").notNull().default(25),
  breakMinutes: integer("break_minutes").notNull().default(5),
  longBreakMinutes: integer("long_break_minutes").notNull().default(15),
  sessionsBeforeLongBreak: integer("sessions_before_long_break").notNull().default(4),
  updatedAt: text("updated_at").notNull(),
});

// NEW — Focus: ambient sound library, admin-managed. "r2" tracks are
// uploaded to the FOCUS_SOUNDS bucket, "external" tracks point straight at
// a CDN URL. "bundled" (static files under public/sounds/) is no longer
// used — the last two bundled tracks were moved to R2 to keep audio out of
// the deploy bundle; kept as an enum value only for old-row compatibility.
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
  dayOpen: real("day_open"), // today's (incomplete) daily candle open
  dayHigh: real("day_high"), // today's running high
  dayLow: real("day_low"), // today's running low
  prevClose: real("prev_close"), // previous complete day's close
  lastFetchedAt: text("last_fetched_at"),
  createdAt: text("created_at").notNull(),
});

// NEW — Meal: recipes, admin-authored. caloriesPerServing/proteinG/fatG/carbG
// are the recipe's own totals — either typed in directly, or auto-summed in
// the admin UI from linked meal_foods ingredient nutrition (see
// meal_recipe_ingredients.foodId below) and saved as a snapshot, so a later
// edit to a food's nutrition doesn't silently change already-saved recipes.
export const mealRecipes = sqliteTable("meal_recipes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  instructions: text("instructions").notNull(), // one step per line
  servings: integer("servings").notNull().default(1),
  caloriesPerServing: real("calories_per_serving").notNull().default(0),
  proteinG: real("protein_g").notNull().default(0),
  fatG: real("fat_g").notNull().default(0),
  carbG: real("carb_g").notNull().default(0),
  goalTags: text("goal_tags"), // comma-separated: lose_weight,maintain,gain_weight,gain_muscle
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// NEW — Meal: ingredient lines for a recipe, used to build shopping lists.
// foodId optionally links this line to a meal_foods nutrition entry — when
// set, quantity is interpreted in grams and the line's own calo/protein/fat/
// carb contribution can be computed (quantity / 100 * food's per-100g
// values), which is what powers the "search recipes by ingredient" and
// per-ingredient macro breakdown features. foodId is nullable because not
// every ingredient (spices, "gia vị vừa đủ", ...) has — or needs — a
// nutrition entry.
export const mealRecipeIngredients = sqliteTable("meal_recipe_ingredients", {
  id: text("id").primaryKey(),
  recipeId: text("recipe_id").notNull(),
  foodId: text("food_id"),
  name: text("name").notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// NEW — Meal: per-100g nutrition reference for ingredients, admin-managed.
// Small curated table (not a full USDA-scale database) — enough for the
// ingredients actually used across recipes. Searched by name to power
// ingredient search/autocomplete in the recipe editor and the "find recipes
// containing X" feature.
export const mealFoods = sqliteTable("meal_foods", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  // Drives the "Nguyên liệu" filter group on the recipe library page —
  // recipes are grouped by which category their linked ingredients fall
  // into, same shape as a typical recipe-site ingredient filter.
  category: text("category", {
    enum: ["thit", "hai_san", "rau_cu_qua", "tinh_bot", "khac"],
  })
    .notNull()
    .default("khac"),
  caloriesPer100g: real("calories_per_100g").notNull().default(0),
  proteinPer100g: real("protein_per_100g").notNull().default(0),
  fatPer100g: real("fat_per_100g").notNull().default(0),
  carbPer100g: real("carb_per_100g").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// NEW — Meal: per-user daily calorie/macro targets, one row per user
export const mealTargets = sqliteTable("meal_targets", {
  userId: text("user_id").primaryKey(),
  goal: text("goal", {
    enum: ["lose_weight", "maintain", "gain_weight", "gain_muscle"],
  })
    .notNull()
    .default("maintain"),
  targetCalories: real("target_calories").notNull(),
  targetProteinG: real("target_protein_g").notNull().default(0),
  targetFatG: real("target_fat_g").notNull().default(0),
  targetCarbG: real("target_carb_g").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

// NEW — Meal: one recipe placed into a user's plan for a given day/slot
export const mealPlanEntries = sqliteTable("meal_plan_entries", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: text("date").notNull(), // ISO date, e.g. 2026-08-10
  mealSlot: text("meal_slot", {
    enum: ["breakfast", "lunch", "dinner", "snack"],
  }).notNull(),
  recipeId: text("recipe_id").notNull(),
  servings: real("servings").notNull().default(1),
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

