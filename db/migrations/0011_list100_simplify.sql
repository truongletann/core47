-- Migration: 0011_list100_simplify
-- Rút gọn List 100 tối đa theo yêu cầu: bỏ category/tags/imageUrl/targetDate
-- và trạng thái 3 mức, chỉ còn done/chưa done. Bảng chưa có dữ liệu (bug UI
-- chặn việc thêm item) nên drop & tạo lại thay vì ALTER nhiều cột.

DROP TABLE IF EXISTS list100_items;

CREATE TABLE list100_items (
  id             TEXT PRIMARY KEY,           -- uuid
  rank           INTEGER NOT NULL,           -- vị trí trong danh sách (1-100)
  title          TEXT NOT NULL,              -- điều muốn làm
  note           TEXT,                       -- ghi chú ngắn hiện trong ngoặc
  link           TEXT,                       -- link tham khảo (không bắt buộc)
  is_done        INTEGER NOT NULL DEFAULT 0,
  completed_at   TEXT,                       -- tự set khi is_done = 1
  is_public      INTEGER NOT NULL DEFAULT 1, -- ẩn khỏi trang public nếu = 0
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_list100_rank      ON list100_items(rank);
CREATE INDEX IF NOT EXISTS idx_list100_is_public ON list100_items(is_public);
