import { NextRequest, NextResponse } from "next/server";
import { shouldRefresh, listArticles } from "@/lib/market/newsService";
import { fetchAndStoreNews } from "@/lib/market/rss";

// Public — powers NewsLive's client-side polling. Reuses the same lazy
// refresh gate as the page itself, so frequent polling doesn't turn into
// frequent re-fetching of every RSS source; it just picks up whatever the
// gate already allowed (any visitor's request can trigger the refresh).
const REFRESH_THRESHOLD_MINUTES = 10;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  if (await shouldRefresh(REFRESH_THRESHOLD_MINUTES)) {
    await fetchAndStoreNews();
  }

  const articles = await listArticles({ limit: 50, sourceId: source, category });
  return NextResponse.json({ success: true, data: { articles } });
}
