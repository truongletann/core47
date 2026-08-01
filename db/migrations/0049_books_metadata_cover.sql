-- Migration: 0049_books_metadata_cover
-- Target: Cloudflare D1 (SQLite)
-- Adds cover image + genre to library_books so the upload form can
-- auto-fill title/author/genre and a cover thumbnail from the EPUB/PDF's
-- own embedded metadata, instead of requiring manual entry.

ALTER TABLE library_books ADD COLUMN cover_key TEXT;
ALTER TABLE library_books ADD COLUMN genre TEXT;
