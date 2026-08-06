-- Cache the rendered HTML for each blog post so the public post page reads
-- pre-rendered HTML instead of parsing markdown (marked/highlight.js/
-- gray-matter/node-emoji) on every request. Nullable until backfilled;
-- admin create/update always sets it going forward.
ALTER TABLE blog_posts ADD COLUMN content_html TEXT;
