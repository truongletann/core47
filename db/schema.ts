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

// NEW — user's favorite tools in the toolbox
export const toolFavorites = sqliteTable("tool_favorites", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  toolSlug: text("tool_slug").notNull(),
  createdAt: text("created_at").notNull(),
});

// NEW — List 100 item ("100 things to do before I die")
export const list100Items = sqliteTable("list100_items", {
  id: text("id").primaryKey(),
  rank: integer("rank").notNull(),
  title: text("title").notNull(),
  note: text("note"), // short note shown in parentheses, optional
  link: text("link"), // reference link/article, optional
  isDone: integer("is_done").notNull().default(0),
  completedAt: text("completed_at"), // auto-set when isDone flips to true
  isPublic: integer("is_public").notNull().default(1), // hidden from the public page if = 0
  suggestedBy: text("suggested_by"), // suggester's name (if created from an approved suggestion), admin-only
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// NEW — List 100 item suggestions submitted from the public page, admin approves manually
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
