-- Migration: 0026_focus_playlist_thumbnails
ALTER TABLE focus_playlists ADD COLUMN thumbnail_url TEXT;
