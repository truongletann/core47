import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getAvatarsBucket() {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.AVATARS) {
    throw new Error(
      "R2 binding 'AVATARS' không tồn tại. Kiểm tra lại wrangler.jsonc đã khai báo r2_buckets chưa.",
    );
  }
  return env.AVATARS;
}
