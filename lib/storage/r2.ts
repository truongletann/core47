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

export async function getFocusSoundsBucket() {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.FOCUS_SOUNDS) {
    throw new Error(
      "R2 binding 'FOCUS_SOUNDS' does not exist. Check that wrangler.jsonc declares r2_buckets.",
    );
  }
  return env.FOCUS_SOUNDS;
}

export async function getLibraryBucket() {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.LIBRARY) {
    throw new Error(
      "R2 binding 'LIBRARY' does not exist. Check that wrangler.jsonc declares r2_buckets.",
    );
  }
  return env.LIBRARY;
}
