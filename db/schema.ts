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
  // NEW — theo dõi ai/từ đâu tạo link
  userId: text("user_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

// NEW — bảng người dùng
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

// NEW — bảng phiên đăng nhập
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
});

// NEW — tool yêu thích của user trong toolbox
export const toolFavorites = sqliteTable("tool_favorites", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  toolSlug: text("tool_slug").notNull(),
  createdAt: text("created_at").notNull(),
});

// NEW — item của List 100 (top 100 công cụ/website được xếp hạng)
export const list100Items = sqliteTable("list100_items", {
  id: text("id").primaryKey(),
  rank: integer("rank").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  category: text("category"),
  tags: text("tags"), // comma-separated
  score: real("score"),
  status: text("status", { enum: ["published", "draft"] })
    .notNull()
    .default("draft"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
