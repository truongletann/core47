import { eq, asc, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { bioPages, bioLinks, users } from "@/db/schema";
import { getOrCreateInternalShortLink } from "@/lib/shortlink/service";
import { SHORT_DOMAIN } from "@/lib/shortlink/config";
import { getAvatarsBucket } from "@/lib/storage/r2";
import {
  UpdateBioPageSchema,
  CreateBioLinkSchema,
  UpdateBioLinkSchema,
  type UpdateBioPageInput,
  type CreateBioLinkInput,
  type UpdateBioLinkInput,
} from "./schema";

export async function getOrCreateBioPage(userId: string) {
  const db = await getDb();
  const existing = await db.select().from(bioPages).where(eq(bioPages.userId, userId)).get();
  if (existing) return existing;

  const record = {
    userId,
    title: "",
    bio: "",
    theme: "sunset" as const,
    buttonStyle: "solid" as const,
    isPublished: 1,
    shortCode: null,
    bannerKey: null,
    backgroundColor: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.insert(bioPages).values(record);
  return record;
}

export async function getBioLinks(userId: string) {
  const db = await getDb();
  return db.select().from(bioLinks).where(eq(bioLinks.userId, userId)).orderBy(asc(bioLinks.sortOrder));
}

export async function getMyBio(userId: string) {
  const [page, links] = await Promise.all([getOrCreateBioPage(userId), getBioLinks(userId)]);
  return { page, links };
}

export async function updateBioPage(userId: string, raw: UpdateBioPageInput) {
  const input = UpdateBioPageSchema.parse(raw);
  const db = await getDb();
  await getOrCreateBioPage(userId); // ensure row exists

  await db
    .update(bioPages)
    .set({
      title: input.title,
      bio: input.bio,
      theme: input.theme,
      buttonStyle: input.buttonStyle,
      isPublished: input.isPublished ? 1 : 0,
      backgroundColor: input.backgroundColor === undefined ? undefined : input.backgroundColor,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(bioPages.userId, userId));

  return db.select().from(bioPages).where(eq(bioPages.userId, userId)).get();
}

// Sets or clears the wide cover banner image key — called from the banner
// upload/delete route, bypasses UpdateBioPageSchema since it's not part of
// the regular page-settings form submit.
export async function setBioBanner(userId: string, bannerKey: string | null) {
  const db = await getDb();
  await getOrCreateBioPage(userId);
  await db.update(bioPages).set({ bannerKey, updatedAt: new Date().toISOString() }).where(eq(bioPages.userId, userId));
}

export async function addBioLink(userId: string, raw: CreateBioLinkInput) {
  const input = CreateBioLinkSchema.parse(raw);
  const db = await getDb();

  const existing = await db.select({ so: bioLinks.sortOrder }).from(bioLinks).where(eq(bioLinks.userId, userId)).all();
  const maxSort = existing.reduce((max, r) => Math.max(max, r.so), -1);

  const record = {
    id: crypto.randomUUID(),
    userId,
    kind: input.kind,
    platform: input.platform ?? null,
    title: input.title ?? null,
    url: input.url,
    icon: input.icon ?? null,
    isEnabled: 1,
    clicks: 0,
    sortOrder: maxSort + 1,
    color: input.color ?? null,
    subtitle: input.subtitle ?? null,
    thumbnailKey: null,
    isHeader: input.isHeader ? 1 : 0,
    createdAt: new Date().toISOString(),
  };
  await db.insert(bioLinks).values(record);
  return record;
}

export async function updateBioLink(userId: string, id: string, raw: UpdateBioLinkInput) {
  const input = UpdateBioLinkSchema.parse(raw);
  const db = await getDb();

  const link = await db.select().from(bioLinks).where(eq(bioLinks.id, id)).get();
  if (!link || link.userId !== userId) throw new Error("NOT_FOUND");

  const patch: Partial<typeof bioLinks.$inferInsert> = {};
  if (input.kind !== undefined) patch.kind = input.kind;
  if (input.platform !== undefined) patch.platform = input.platform;
  if (input.title !== undefined) patch.title = input.title;
  if (input.url !== undefined) patch.url = input.url;
  if (input.icon !== undefined) patch.icon = input.icon;
  if (input.isEnabled !== undefined) patch.isEnabled = input.isEnabled ? 1 : 0;
  if (input.color !== undefined) patch.color = input.color ?? null;
  if (input.subtitle !== undefined) patch.subtitle = input.subtitle ?? null;
  if (input.isHeader !== undefined) patch.isHeader = input.isHeader ? 1 : 0;

  await db.update(bioLinks).set(patch).where(eq(bioLinks.id, id));
  return db.select().from(bioLinks).where(eq(bioLinks.id, id)).get();
}

// Sets or clears a link's thumbnail image key — called from the per-link
// thumbnail upload/delete route, bypasses UpdateBioLinkSchema since it's a
// file upload, not a JSON field on the regular link-edit form.
export async function setBioLinkThumbnail(userId: string, id: string, thumbnailKey: string | null) {
  const db = await getDb();
  const link = await db.select().from(bioLinks).where(eq(bioLinks.id, id)).get();
  if (!link || link.userId !== userId) throw new Error("NOT_FOUND");
  await db.update(bioLinks).set({ thumbnailKey }).where(eq(bioLinks.id, id));
}

export async function deleteBioLink(userId: string, id: string) {
  const db = await getDb();
  const link = await db.select().from(bioLinks).where(eq(bioLinks.id, id)).get();
  if (!link || link.userId !== userId) throw new Error("NOT_FOUND");

  if (link.thumbnailKey) {
    const bucket = await getAvatarsBucket();
    await bucket.delete(link.thumbnailKey);
  }

  await db.delete(bioLinks).where(eq(bioLinks.id, id));
}

export async function reorderBioLinks(userId: string, orderedIds: string[]) {
  const db = await getDb();
  const links = await getBioLinks(userId);
  const ownedIds = new Set(links.map((l) => l.id));

  for (let i = 0; i < orderedIds.length; i++) {
    const id = orderedIds[i];
    if (!ownedIds.has(id)) continue;
    await db.update(bioLinks).set({ sortOrder: i }).where(eq(bioLinks.id, id));
  }
}

export async function incrementBioLinkClicks(id: string) {
  const db = await getDb();
  await db.update(bioLinks).set({ clicks: sql`${bioLinks.clicks} + 1` }).where(eq(bioLinks.id, id));
}

export interface PublicBioLink {
  id: string;
  kind: string;
  platform: string | null;
  title: string | null;
  url: string;
  icon: string | null;
  color: string | null;
  subtitle: string | null;
  thumbnailKey: string | null;
  isHeader: boolean;
}

export interface PublicBioData {
  userId: string;
  username: string;
  name: string | null;
  title: string;
  bio: string;
  theme: string;
  buttonStyle: string;
  bannerKey: string | null;
  backgroundColor: string | null;
  links: PublicBioLink[];
}

export async function getPublicBioByUsername(username: string): Promise<PublicBioData | null> {
  const db = await getDb();
  const user = await db.select().from(users).where(eq(users.username, username)).get();
  if (!user || user.isDisabled) return null;

  const page = await db.select().from(bioPages).where(eq(bioPages.userId, user.id)).get();
  if (!page || !page.isPublished) return null;

  const links = await db
    .select()
    .from(bioLinks)
    .where(eq(bioLinks.userId, user.id))
    .orderBy(asc(bioLinks.sortOrder))
    .all();

  return {
    userId: user.id,
    username: user.username!,
    name: user.name,
    title: page.title,
    bio: page.bio,
    theme: page.theme,
    buttonStyle: page.buttonStyle,
    bannerKey: page.bannerKey,
    backgroundColor: page.backgroundColor,
    links: links
      .filter((l) => l.isEnabled)
      .map((l) => ({
        id: l.id,
        kind: l.kind,
        platform: l.platform,
        title: l.title,
        url: l.url,
        icon: l.icon,
        color: l.color,
        subtitle: l.subtitle,
        thumbnailKey: l.thumbnailKey,
        isHeader: Boolean(l.isHeader),
      })),
  };
}

// Mints (or reuses) a to2.site short link pointing at the user's public bio
// page. Requires a username since the public page is served at
// bio.core47.xyz/<username>.
export async function getBioShareLink(userId: string, username: string): Promise<string> {
  const db = await getDb();
  const page = await getOrCreateBioPage(userId);
  const targetUrl = `https://bio.core47.xyz/${username}`;

  const link = await getOrCreateInternalShortLink(targetUrl, userId, page.shortCode);

  if (link.code !== page.shortCode) {
    await db.update(bioPages).set({ shortCode: link.code }).where(eq(bioPages.userId, userId));
  }

  return `https://${SHORT_DOMAIN}/${link.code}`;
}
