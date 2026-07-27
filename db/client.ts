import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

/**
 * Trả về Drizzle client gắn với D1 binding thật (env.DB).
 * Chỉ hoạt động trong Cloudflare Workers runtime hoặc `next dev` local
 * (nhờ initOpenNextCloudflareForDev() đã bật trong next.config.js).
 */
export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) {
    throw new Error(
      "D1 binding 'DB' không tồn tại. Kiểm tra lại wrangler.jsonc đã khai báo d1_databases chưa.",
    );
  }
  return drizzle(env.DB, { schema });
}