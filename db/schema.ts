import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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
