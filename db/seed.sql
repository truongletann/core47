INSERT INTO categories (id, name, sort_order) VALUES
  ('media',   'Media & Images', 1),
  ('text',    'Text & Writing', 2),
  ('utility', 'Utilities',      3);

INSERT INTO tools (id, slug, name, description, subdomain, icon, category_id, status, sort_order) VALUES
  ('t1', 'genqr',     'QR Codes',       'Generate custom QR codes for links, wifi, business cards.', 'genqr.core47.xyz',     'QrCode',     'utility', 'active', 1),
  ('t2', 'beautysql', 'BeautySQL',      'Format and beautify your SQL queries.',                     'beautysql.core47.xyz', 'Code2',      'utility', 'active', 2),
  ('t3', 'shortlink', 'Link Shortener', 'Free link shortener tool.',                                 'shortlink.core47.xyz', 'Link',       'utility', 'active', 3);
