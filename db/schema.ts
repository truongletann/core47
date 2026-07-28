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
  // NEW — theo dõi ai/từ đâu tạo link
  userId: text("user_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

// NEW — bảng người dùng
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  isAdmin: integer("is_admin").notNull().default(0),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  createdAt: text("created_at").notNull(),
});

// NEW — bảng phiên đăng nhập
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
});
