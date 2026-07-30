import { XMLParser } from "fast-xml-parser";
import { lt } from "drizzle-orm";
import { getDb } from "@/db/client";
import { newsArticles } from "@/db/schema";
import { listEnabledSources } from "./newsService";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
});

interface ParsedArticle {
  title: string;
  link: string;
  summary: string | null;
  imageUrl: string | null;
  publishedAt: string;
}

// RSS/Atom field values come through as either a plain string or, once an
// element carries attributes/CDATA, an object with a "#text" key — this
// normalizes both shapes to a trimmed string.
function textOf(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (v && typeof v === "object" && "#text" in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>)["#text"]).trim();
  }
  return "";
}

function linkOf(v: unknown): string {
  // Atom <link href="..."/> vs RSS <link>text</link>
  if (v && typeof v === "object") {
    const obj = v as Record<string, unknown>;
    if (typeof obj["@_href"] === "string") return obj["@_href"];
    if (Array.isArray(v)) {
      const alt = v.find(
        (l) => typeof l === "object" && (l as Record<string, unknown>)["@_rel"] !== "self",
      );
      if (alt && typeof alt === "object") return String((alt as Record<string, unknown>)["@_href"] ?? "");
    }
  }
  return textOf(v);
}

function parseDate(v: unknown): string {
  const raw = textOf(v);
  const parsed = raw ? new Date(raw) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString();
}

function imageOf(item: Record<string, unknown>): string | null {
  const enclosure = item.enclosure as Record<string, unknown> | undefined;
  if (enclosure && typeof enclosure["@_url"] === "string") return enclosure["@_url"];
  const mediaContent = item["media:content"] as Record<string, unknown> | undefined;
  if (mediaContent && typeof mediaContent["@_url"] === "string") return mediaContent["@_url"];
  return null;
}

function parseFeed(xml: string): ParsedArticle[] {
  const doc = parser.parse(xml) as Record<string, unknown>;
  const rss = doc.rss as Record<string, unknown> | undefined;
  const channel = rss?.channel as Record<string, unknown> | undefined;
  const feed = doc.feed as Record<string, unknown> | undefined;

  const rawItems = channel?.item ?? feed?.entry;
  if (!rawItems) return [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items
    .map((raw): ParsedArticle | null => {
      const item = raw as Record<string, unknown>;
      const title = textOf(item.title);
      const link = linkOf(item.link);
      if (!title || !link) return null;

      const summary = textOf(item.description ?? item.summary ?? item.content) || null;
      return {
        title,
        link,
        summary: summary ? summary.slice(0, 500) : null,
        imageUrl: imageOf(item),
        publishedAt: parseDate(item.pubDate ?? item.published ?? item.updated),
      };
    })
    .filter((a): a is ParsedArticle => a !== null);
}

const ARTICLE_RETENTION_DAYS = 30;
const ROWS_PER_INSERT = 10;

export async function fetchAndStoreNews(): Promise<void> {
  const sources = await listEnabledSources();
  const db = await getDb();

  await Promise.all(
    sources.map(async (source) => {
      try {
        const res = await fetch(source.url, {
          headers: { "User-Agent": "core47-market-news/1.0" },
        });
        if (!res.ok) return;

        const xml = await res.text();
        const articles = parseFeed(xml);
        if (articles.length === 0) return;

        const now = new Date().toISOString();
        const rows = articles.map((a) => ({
          id: crypto.randomUUID(),
          sourceId: source.id,
          title: a.title.slice(0, 300),
          link: a.link,
          summary: a.summary,
          imageUrl: a.imageUrl,
          publishedAt: a.publishedAt,
          fetchedAt: now,
        }));

        // D1 caps bound parameters per statement at 100 — 8 columns per
        // row means batches must stay small enough to fit under that.
        for (let i = 0; i < rows.length; i += ROWS_PER_INSERT) {
          await db
            .insert(newsArticles)
            .values(rows.slice(i, i + ROWS_PER_INSERT))
            .onConflictDoNothing({ target: newsArticles.link });
        }
      } catch (err) {
        // One broken feed should never block the others.
        console.error(`[market/rss] failed to fetch ${source.url}:`, err);
      }
    }),
  );

  const cutoff = new Date(Date.now() - ARTICLE_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await db.delete(newsArticles).where(lt(newsArticles.publishedAt, cutoff));
}
