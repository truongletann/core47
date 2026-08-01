-- Migration: 0043_expense_tool_placeholder
-- Target: Cloudflare D1 (SQLite)
-- Registers the upcoming Expense Tracker subdomain as a "coming soon"
-- placeholder under the Productivity & Money category.

INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order, created_at, updated_at)
VALUES (
  'tool-expense',
  'expense',
  'Expense Tracker',
  'Sổ chi tiêu cá nhân — ghi lại thu chi hàng ngày, theo dõi ngân sách theo danh mục.',
  'expense.core47.xyz',
  'Wallet',
  'productivity',
  'soon',
  13,
  datetime('now'),
  datetime('now')
)
ON CONFLICT (subdomain) DO NOTHING;
