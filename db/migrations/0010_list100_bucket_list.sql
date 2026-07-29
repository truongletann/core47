-- Migration: 0010_list100_bucket_list
-- List 100 đổi hướng thành bucket-list cá nhân ("100 điều muốn làm trước khi chết"),
-- không phải bảng xếp hạng công cụ/website. Bảng cũ (0009) chưa có dữ liệu nên
-- drop và tạo lại thay vì ALTER nhiều cột.

DROP TABLE IF EXISTS list100_items;

CREATE TABLE list100_items (
  id             TEXT PRIMARY KEY,           -- uuid
  rank           INTEGER NOT NULL,           -- vị trí trong danh sách (1-100)
  title          TEXT NOT NULL,              -- điều muốn làm
  description    TEXT NOT NULL,              -- mô tả ngắn / vì sao muốn làm
  category       TEXT,                       -- vd: Travel, Career, Health, Adventure...
  tags           TEXT,                       -- comma-separated
  image_url      TEXT,                       -- ảnh minh hoạ / ảnh khi hoàn thành
  link           TEXT,                       -- link tham khảo (không bắt buộc)
  status         TEXT NOT NULL DEFAULT 'not_started'
                 CHECK (status IN ('not_started','in_progress','done')),
  target_date    TEXT,                       -- mốc thời gian dự định
  completed_at   TEXT,                       -- ngày thực sự hoàn thành
  note           TEXT,                       -- cảm nghĩ/câu chuyện khi hoàn thành
  is_public      INTEGER NOT NULL DEFAULT 1, -- ẩn khỏi trang public nếu = 0
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_list100_rank      ON list100_items(rank);
CREATE INDEX IF NOT EXISTS idx_list100_status    ON list100_items(status);
CREATE INDEX IF NOT EXISTS idx_list100_category  ON list100_items(category);
CREATE INDEX IF NOT EXISTS idx_list100_is_public ON list100_items(is_public);
