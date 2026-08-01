import { eq, and, desc, asc, gte, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  focusTasks,
  focusSessions,
  focusSettings,
  focusSoundTracks,
  focusPlaylists,
  focusThemes,
} from "@/db/schema";
import {
  TaskSchema,
  UpdateTaskSchema,
  SessionSchema,
  FocusSettingsSchema,
  SoundTrackSchema,
  PlaylistSchema,
  ThemeSchema,
  ImportPayloadSchema,
  type TaskInput,
  type UpdateTaskInput,
  type SessionInput,
  type FocusSettingsInput,
  type SoundTrackInput,
  type PlaylistInput,
  type ThemeInput,
  type ImportPayload,
} from "./schema";

const SETTINGS_ID = "default";

// ---------- Tasks ----------

export async function listTasks(userId: string) {
  const db = await getDb();
  return db
    .select()
    .from(focusTasks)
    .where(eq(focusTasks.userId, userId))
    .orderBy(asc(focusTasks.sortOrder), asc(focusTasks.createdAt));
}

export async function createTask(userId: string, raw: TaskInput) {
  const input = TaskSchema.parse(raw);
  const db = await getDb();
  const record = {
    id: crypto.randomUUID(),
    userId,
    title: input.title,
    estimatedPomodoros: input.estimatedPomodoros,
    completedPomodoros: 0,
    isDone: 0,
    sortOrder: 0,
    createdAt: new Date().toISOString(),
  };
  await db.insert(focusTasks).values(record);
  return record;
}

export async function updateTask(userId: string, id: string, raw: UpdateTaskInput) {
  const input = UpdateTaskSchema.parse(raw);
  const db = await getDb();
  const patch: Partial<typeof focusTasks.$inferInsert> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.isDone !== undefined) patch.isDone = input.isDone ? 1 : 0;
  if (input.completedPomodoros !== undefined) patch.completedPomodoros = input.completedPomodoros;
  if (input.sortOrder !== undefined) patch.sortOrder = input.sortOrder;

  await db
    .update(focusTasks)
    .set(patch)
    .where(and(eq(focusTasks.id, id), eq(focusTasks.userId, userId)));
}

export async function deleteTask(userId: string, id: string) {
  const db = await getDb();
  await db.delete(focusTasks).where(and(eq(focusTasks.id, id), eq(focusTasks.userId, userId)));
}

// ---------- Sessions ----------

export async function logSession(userId: string, raw: SessionInput) {
  const input = SessionSchema.parse(raw);
  const db = await getDb();
  const record = {
    id: crypto.randomUUID(),
    userId,
    taskId: input.taskId ?? null,
    type: input.type,
    durationMinutes: input.durationMinutes,
    completedAt: input.completedAt,
    createdAt: new Date().toISOString(),
  };
  await db.insert(focusSessions).values(record);

  if (input.taskId && input.type === "work") {
    await db
      .update(focusTasks)
      .set({ completedPomodoros: sql`${focusTasks.completedPomodoros} + 1` })
      .where(and(eq(focusTasks.id, input.taskId), eq(focusTasks.userId, userId)));
  }
  return record;
}

export async function listSessions(userId: string, sinceIso?: string) {
  const db = await getDb();
  const conditions = sinceIso
    ? and(eq(focusSessions.userId, userId), gte(focusSessions.completedAt, sinceIso))
    : eq(focusSessions.userId, userId);
  return db.select().from(focusSessions).where(conditions).orderBy(desc(focusSessions.completedAt));
}

// ---------- Settings (singleton, admin-editable) ----------

export async function getFocusSettings() {
  const db = await getDb();
  const existing = await db.select().from(focusSettings).where(eq(focusSettings.id, SETTINGS_ID)).get();
  if (existing) return existing;

  const record = {
    id: SETTINGS_ID,
    workMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLongBreak: 4,
    updatedAt: new Date().toISOString(),
  };
  await db.insert(focusSettings).values(record);
  return record;
}

export async function updateFocusSettings(raw: FocusSettingsInput) {
  const input = FocusSettingsSchema.parse(raw);
  const db = await getDb();
  await getFocusSettings();
  await db
    .update(focusSettings)
    .set({ ...input, updatedAt: new Date().toISOString() })
    .where(eq(focusSettings.id, SETTINGS_ID));
}

// ---------- Sound tracks (public read + admin CRUD) ----------

export async function listEnabledSoundTracks() {
  const db = await getDb();
  return db
    .select()
    .from(focusSoundTracks)
    .where(eq(focusSoundTracks.isEnabled, 1))
    .orderBy(asc(focusSoundTracks.sortOrder));
}

export async function listAllSoundTracksAdmin() {
  const db = await getDb();
  return db.select().from(focusSoundTracks).orderBy(asc(focusSoundTracks.sortOrder));
}

export async function createSoundTrack(raw: SoundTrackInput) {
  const input = SoundTrackSchema.parse(raw);
  const db = await getDb();
  const record = {
    id: crypto.randomUUID(),
    name: input.name,
    category: input.category,
    source: input.source,
    urlOrKey: input.urlOrKey,
    isEnabled: input.isEnabled ? 1 : 0,
    sortOrder: input.sortOrder,
    createdAt: new Date().toISOString(),
  };
  await db.insert(focusSoundTracks).values(record);
  return record;
}

export async function updateSoundTrack(id: string, raw: Partial<SoundTrackInput>) {
  const db = await getDb();
  const patch: Partial<typeof focusSoundTracks.$inferInsert> = {};
  if (raw.name !== undefined) patch.name = raw.name;
  if (raw.category !== undefined) patch.category = raw.category;
  if (raw.source !== undefined) patch.source = raw.source;
  if (raw.urlOrKey !== undefined) patch.urlOrKey = raw.urlOrKey;
  if (raw.isEnabled !== undefined) patch.isEnabled = raw.isEnabled ? 1 : 0;
  if (raw.sortOrder !== undefined) patch.sortOrder = raw.sortOrder;
  await db.update(focusSoundTracks).set(patch).where(eq(focusSoundTracks.id, id));
}

export async function deleteSoundTrack(id: string) {
  const db = await getDb();
  await db.delete(focusSoundTracks).where(eq(focusSoundTracks.id, id));
}

// ---------- Playlists (public read + admin CRUD) ----------

// Spotify's public oEmbed endpoint returns official metadata meant for
// embedding (title + cover thumbnail) — no auth needed, safe to call
// server-side and cache, same "lazy refresh, cache in D1" pattern the
// Market module uses for external feeds.
async function fetchSpotifyThumbnail(embedUrl: string): Promise<string | null> {
  try {
    const playlistUrl = embedUrl.replace("/embed/", "/");
    const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(playlistUrl)}`);
    if (!res.ok) return null;
    const json = (await res.json()) as { thumbnail_url?: string };
    return json.thumbnail_url ?? null;
  } catch {
    return null;
  }
}

export async function listEnabledPlaylists() {
  const db = await getDb();
  const rows = await db
    .select()
    .from(focusPlaylists)
    .where(eq(focusPlaylists.isEnabled, 1))
    .orderBy(asc(focusPlaylists.sortOrder));

  const withThumbnails = await Promise.all(
    rows.map(async (r) => {
      if (r.thumbnailUrl) return r;
      const thumbnailUrl = await fetchSpotifyThumbnail(r.spotifyEmbedUrl);
      if (thumbnailUrl) {
        await db.update(focusPlaylists).set({ thumbnailUrl }).where(eq(focusPlaylists.id, r.id));
      }
      return { ...r, thumbnailUrl };
    }),
  );
  return withThumbnails;
}

export async function listAllPlaylistsAdmin() {
  const db = await getDb();
  return db.select().from(focusPlaylists).orderBy(asc(focusPlaylists.sortOrder));
}

export async function createPlaylist(raw: PlaylistInput) {
  const input = PlaylistSchema.parse(raw);
  const db = await getDb();
  const record = {
    id: crypto.randomUUID(),
    name: input.name,
    spotifyEmbedUrl: input.spotifyEmbedUrl,
    category: input.category ?? null,
    isEnabled: input.isEnabled ? 1 : 0,
    sortOrder: input.sortOrder,
    createdAt: new Date().toISOString(),
  };
  await db.insert(focusPlaylists).values(record);
  return record;
}

export async function updatePlaylist(id: string, raw: Partial<PlaylistInput>) {
  const db = await getDb();
  const patch: Partial<typeof focusPlaylists.$inferInsert> = {};
  if (raw.name !== undefined) patch.name = raw.name;
  if (raw.spotifyEmbedUrl !== undefined) patch.spotifyEmbedUrl = raw.spotifyEmbedUrl;
  if (raw.category !== undefined) patch.category = raw.category ?? null;
  if (raw.isEnabled !== undefined) patch.isEnabled = raw.isEnabled ? 1 : 0;
  if (raw.sortOrder !== undefined) patch.sortOrder = raw.sortOrder;
  await db.update(focusPlaylists).set(patch).where(eq(focusPlaylists.id, id));
}

export async function deletePlaylist(id: string) {
  const db = await getDb();
  await db.delete(focusPlaylists).where(eq(focusPlaylists.id, id));
}

// ---------- Themes (public read + admin CRUD) ----------
// Unified Ambience catalog: "canvas" kinds are the built-in lightweight
// animations (seeded once, not admin-creatable — no code exists for
// arbitrary new canvas looks), "image" and "youtube" kinds are fully
// admin-managed content.

// Accepts any common YouTube URL shape (watch?v=, youtu.be/, /embed/,
// /shorts/) or a bare 11-char video ID, and returns just the ID.
export function parseYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0] || null;
    if (url.hostname.includes("youtube.com")) {
      if (url.searchParams.get("v")) return url.searchParams.get("v");
      const match = url.pathname.match(/\/(embed|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[2];
    }
  } catch {
    return null;
  }
  return null;
}

export async function listEnabledThemes() {
  const db = await getDb();
  return db
    .select()
    .from(focusThemes)
    .where(eq(focusThemes.isEnabled, 1))
    .orderBy(asc(focusThemes.category), asc(focusThemes.sortOrder));
}

export async function listAllThemesAdmin() {
  const db = await getDb();
  return db.select().from(focusThemes).orderBy(asc(focusThemes.category), asc(focusThemes.sortOrder));
}

export async function createTheme(raw: ThemeInput) {
  const input = ThemeSchema.parse(raw);
  const db = await getDb();

  let urlOrKey = input.urlOrKey;
  let thumbnailUrl: string | null = null;
  if (input.kind === "youtube") {
    const videoId = parseYoutubeId(input.urlOrKey);
    if (!videoId) throw new Error("INVALID_YOUTUBE_URL");
    urlOrKey = videoId;
    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  } else if (input.source === "external") {
    thumbnailUrl = input.urlOrKey;
  }

  const record = {
    id: crypto.randomUUID(),
    name: input.name,
    category: input.category,
    kind: input.kind,
    source: input.source,
    urlOrKey,
    thumbnailUrl,
    startSeconds: input.startSeconds ?? null,
    endSeconds: input.endSeconds ?? null,
    isEnabled: input.isEnabled ? 1 : 0,
    sortOrder: input.sortOrder,
    createdAt: new Date().toISOString(),
  };
  await db.insert(focusThemes).values(record);
  return record;
}

export async function updateTheme(id: string, raw: Partial<ThemeInput>) {
  const db = await getDb();
  const patch: Partial<typeof focusThemes.$inferInsert> = {};
  if (raw.name !== undefined) patch.name = raw.name;
  if (raw.category !== undefined) patch.category = raw.category;
  if (raw.isEnabled !== undefined) patch.isEnabled = raw.isEnabled ? 1 : 0;
  if (raw.sortOrder !== undefined) patch.sortOrder = raw.sortOrder;
  await db.update(focusThemes).set(patch).where(eq(focusThemes.id, id));
}

export async function deleteTheme(id: string) {
  const db = await getDb();
  await db.delete(focusThemes).where(eq(focusThemes.id, id));
}

// ---------- One-time anonymous -> account import ----------

export async function importLocalData(userId: string, raw: ImportPayload) {
  const input = ImportPayloadSchema.parse(raw);
  const db = await getDb();
  const now = new Date().toISOString();

  for (const t of input.tasks) {
    await db.insert(focusTasks).values({
      id: crypto.randomUUID(),
      userId,
      title: t.title,
      estimatedPomodoros: t.estimatedPomodoros,
      completedPomodoros: t.completedPomodoros,
      isDone: t.isDone ? 1 : 0,
      sortOrder: 0,
      createdAt: now,
    });
  }

  for (const s of input.sessions) {
    await db.insert(focusSessions).values({
      id: crypto.randomUUID(),
      userId,
      taskId: null,
      type: s.type,
      durationMinutes: s.durationMinutes,
      completedAt: s.completedAt,
      createdAt: now,
    });
  }

  return {
    importedTasks: input.tasks.length,
    importedSessions: input.sessions.length,
  };
}
