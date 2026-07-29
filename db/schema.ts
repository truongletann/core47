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

// NEW — item của List 100 ("100 điều muốn làm trước khi chết")
export const list100Items = sqliteTable("list100_items", {
  id: text("id").primaryKey(),
  rank: integer("rank").notNull(),
  title: text("title").notNull(),
  note: text("note"), // ghi chú ngắn hiện trong ngoặc, không bắt buộc
  link: text("link"), // link tham khảo/bài viết liên quan, không bắt buộc
  isDone: integer("is_done").notNull().default(0),
  completedAt: text("completed_at"), // tự set khi isDone chuyển sang true
  isPublic: integer("is_public").notNull().default(1), // ẩn khỏi trang public nếu = 0
  suggestedBy: text("suggested_by"), // tên người gợi ý (nếu tạo từ duyệt suggestion), chỉ admin thấy
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// NEW — góp ý item cho List 100 gửi từ trang public, admin duyệt thủ công
export const list100Suggestions = sqliteTable("list100_suggestions", {
  id: text("id").primaryKey(),
  name: text("name"), // tên người gợi ý, không bắt buộc
  content: text("content").notNull(),
  createdAt: text("created_at").notNull(),
});

// NEW — bài viết Blog, nội dung Markdown, quản lý qua admin CMS
export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(), // markdown
  coverImageKey: text("cover_image_key"), // key trong R2 bucket AVATARS, prefix blog-covers/
  tags: text("tags"), // comma-separated
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  publishedAt: text("published_at"), // tự set lần đầu chuyển sang published
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
