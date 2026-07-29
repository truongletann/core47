import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

/**
 * Returns a Drizzle client bound to the real D1 binding (env.DB).
 * Only works in the Cloudflare Workers runtime or local `next dev`
 * (thanks to initOpenNextCloudflareForDev() enabled in next.config.js).
 */
export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) {
    throw new Error(
      "D1 binding 'DB' does not exist. Check that wrangler.jsonc declares d1_databases.",
    );
  }
  return drizzle(env.DB, { schema });
}
