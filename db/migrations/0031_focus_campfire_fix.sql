-- The campfire track added in 0030 was audibly near-silent (-59.6dB mean
-- volume vs -22 to -25dB for every other track — roughly 30dB quieter,
-- effectively inaudible at normal listening levels). Swapped in a
-- properly-leveled Mixkit recording ("Campfire night wind", -23.7dB mean)
-- under a fresh R2 key so browsers that already cached the old file under
-- the immutable Cache-Control header pick up the fix immediately.

UPDATE focus_sound_tracks SET url_or_key = 'campfire2-mp3' WHERE id = 'snd-campfire-2';
