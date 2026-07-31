-- Additional ambient sounds, sourced the same way as 0030 (Mixkit Free
-- Sound Effects license, 128kbps MP3, R2-hosted). Each candidate's mean
-- volume was checked before upload (-12 to -17dB range, in line with the
-- rest of the library) to avoid a repeat of the near-silent campfire bug
-- fixed in 0031. Fireplace and Library were requested too but Mixkit had
-- no usable ambient recording for either (fireplace = only short fantasy
-- "spell fire" SFX; library = no matching tag/search results at all) —
-- left out rather than shipping a bad substitute.

INSERT INTO focus_sound_tracks (id, name, category, source, url_or_key, sort_order, created_at) VALUES
  ('snd-train',       'Train',       'ambience', 'r2', 'train-mp3',       11, datetime('now')),
  ('snd-fan',         'Fan',         'noise',    'r2', 'fan-mp3',         12, datetime('now')),
  ('snd-underwater',  'Underwater',  'ambience', 'r2', 'underwater-mp3',  13, datetime('now')),
  ('snd-city',        'City',        'ambience', 'r2', 'city-mp3',        14, datetime('now')),
  ('snd-river',       'River',       'nature',   'r2', 'river-mp3',       15, datetime('now'))
ON CONFLICT (id) DO NOTHING;
