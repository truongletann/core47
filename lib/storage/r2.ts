import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getAvatarsBucket() {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.AVATARS) {
    throw new Error(
      "R2 binding 'AVATARS' does not exist. Check that wrangler.jsonc declares r2_buckets.",
    );
  }
  return env.AVATARS;
}

// Blog cover images share the "AVATARS" R2 bucket (under its own key
// namespace: blog-covers/) so we don't need to provision a separate bucket.
export const getBlogBucket = getAvatarsBucket;
