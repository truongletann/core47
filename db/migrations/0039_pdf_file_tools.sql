-- Migration: 0039_pdf_file_tools
-- Register the PDF Toolkit and File Converter subdomains in the site's tool
-- listing as "coming soon" placeholders (same pattern as 0036).

INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order, created_at, updated_at)
VALUES (
  'tool-pdf',
  'pdf',
  'PDF Toolkit',
  'Gộp PDF, Cắt trang PDF, Chuyển PDF sang Word/JPG và ngược lại.',
  'pdf.core47.xyz',
  'FileText',
  'text',
  'soon',
  15,
  datetime('now'),
  datetime('now')
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order, created_at, updated_at)
VALUES (
  'tool-file',
  'file',
  'File Converter',
  'Chuyển đổi linh hoạt giữa các định dạng tệp tin ảnh, video và tài liệu thường...',
  'file.core47.xyz',
  'ArrowRightLeft',
  'utility',
  'soon',
  16,
  datetime('now'),
  datetime('now')
)
ON CONFLICT (slug) DO NOTHING;
