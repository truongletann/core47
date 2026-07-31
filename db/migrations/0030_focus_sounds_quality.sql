-- Replace the placeholder synthesized ambient tracks (all byte-identical,
-- procedurally generated, audibly crackly/"rè") with real recordings from
-- Mixkit (Free Sound Effects license — free for commercial/personal use,
-- no attribution required), transcoded to 128kbps MP3 and hosted in R2.
-- Keeps 'Rừng cây' (forest) and 'Gió tuyết' (snow-wind) untouched — the
-- user confirmed forest already sounds fine, and snow-wind wasn't part of
-- the requested list.

DELETE FROM focus_sound_tracks WHERE id IN (
  'snd-rain-light', 'snd-rain-heavy', 'snd-rain-window',
  'snd-thunder', 'snd-rain-thunder',
  'snd-campfire', 'snd-ocean', 'snd-coffee-shop'
);

INSERT INTO focus_sound_tracks (id, name, category, source, url_or_key, sort_order, created_at) VALUES
  ('snd-rain-2',        'Rain',          'nature',   'r2', 'rain-mp3',          0,  datetime('now')),
  ('snd-birds',         'Birds',         'nature',   'r2', 'birds-mp3',         1,  datetime('now')),
  ('snd-campfire-2',    'Campfire',      'nature',   'r2', 'campfire-mp3',      2,  datetime('now')),
  ('snd-waves',         'Waves',         'nature',   'r2', 'waves-mp3',         3,  datetime('now')),
  ('snd-thunderstorm',  'Thunderstorm',  'nature',   'r2', 'thunderstorm-mp3',  4,  datetime('now')),
  ('snd-crickets',      'Crickets',      'nature',   'r2', 'crickets-mp3',      5,  datetime('now')),
  ('snd-keyboard',      'Keyboard',      'ambience', 'r2', 'keyboard-mp3',      6,  datetime('now')),
  ('snd-cafe',          'Cafe',          'ambience', 'r2', 'cafe-mp3',          7,  datetime('now')),
  ('snd-wind-chimes',   'Wind Chimes',   'chimes',   'r2', 'wind_chimes-mp3',   8,  datetime('now')),
  ('snd-singing-bowl',  'Singing Bowl',  'chimes',   'r2', 'singing_bowl-mp3',  9,  datetime('now')),
  ('snd-white-noise',   'White Noise',   'noise',    'r2', 'white_noise-mp3',   10, datetime('now'))
ON CONFLICT (id) DO NOTHING;
