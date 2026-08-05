-- Books (books.core47.xyz) removed entirely — source, DB, and the LIBRARY
-- R2 binding were pulled to shrink the Worker bundle back under Cloudflare's
-- 3 MiB free-plan gzip limit. This drops the schema and the tools-listing
-- row; it does NOT touch the actual uploaded files sitting in the
-- "core47-library" R2 bucket — that bucket itself needs to be deleted (or
-- kept) manually via the Cloudflare dashboard if no longer wanted.

DROP TABLE IF EXISTS library_books;

DELETE FROM tools WHERE slug = 'books';
