import { lt } from "drizzle-orm";
import { getDb } from "@/db/client";
import { fxtinNews } from "@/db/schema";

// fxtin.com's real-time flash news feed — used by permission of the
// project author (a prior project of theirs called this same endpoint).
// Unofficial/undocumented: no SLA, could change or block at any time.
const FXTIN_NEWS_URL = "https://www.fxtin.com/page/finance/information";
const FETCH_LIMIT = 40;

interface FxtinNewsItem {
  information_id?: string;
  translate?: string;
  content?: string;
  time?: string;
  important?: string | number;
  pub_time_tz?: string;
}

function nullableString(v: string | undefined): string | null {
  if (!v) return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

const ROWS_PER_INSERT = 10; // fxtin_news has 7 columns — D1 caps at 100 bound params/statement
const ARTICLE_RETENTION_DAYS = 14;

export async function fetchAndStoreFxtinNews(): Promise<void> {
  const res = await fetch(FXTIN_NEWS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
      Referer: "https://fxtin.com/",
    },
    body: JSON.stringify({ limit: FETCH_LIMIT, page: 1 }),
  });
  if (!res.ok) return;

  const json = (await res.json()) as { data?: { list?: FxtinNewsItem[] } };
  const list = json?.data?.list;
  if (!Array.isArray(list) || list.length === 0) return;

  const now = new Date().toISOString();
  const rows = list
    .map((item) => {
      const informationId = nullableString(item.information_id);
      const content = nullableString(item.translate) ?? nullableString(item.content);
      if (!informationId || !content) return null;
      return {
        id: crypto.randomUUID(),
        informationId,
        content: content.slice(0, 1000),
        time: nullableString(item.time),
        important: item.important === "1" || item.important === 1 ? 1 : 0,
        publishedAt: nullableString(item.pub_time_tz) ?? now,
        fetchedAt: now,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
  if (rows.length === 0) return;

  const db = await getDb();
  for (let i = 0; i < rows.length; i += ROWS_PER_INSERT) {
    await db
      .insert(fxtinNews)
      .values(rows.slice(i, i + ROWS_PER_INSERT))
      .onConflictDoNothing({ target: fxtinNews.informationId });
  }

  const cutoff = new Date(Date.now() - ARTICLE_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await db.delete(fxtinNews).where(lt(fxtinNews.publishedAt, cutoff));
}
