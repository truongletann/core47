INSERT INTO categories (id, name, sort_order) VALUES
  ('media',   'Media & Ảnh',    1),
  ('text',    'Văn bản & Chữ',  2),
  ('utility', 'Tiện ích',       3);

INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order) VALUES
  ('t1', 'genqr',     'QR Codes',       'Tạo mã QR tùy chỉnh cho liên kết, wifi, danh thiếp.', 'genqr.core47.xyz',     'QrCode',     'utility', 'active', 1),
  ('t2', 'beautysql', 'BeautySQL',      'Format & làm đẹp câu lệnh SQL của bạn.',               'beautysql.core47.xyz', 'Code2',      'utility', 'active', 2),
  ('t3', 'shortlink', 'Rút gọn link',   'Công cụ rút gọn link miễn phí.',                       'shortlink.core47.xyz', 'Link',       'utility', 'active', 3);