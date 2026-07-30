import { eq, and, desc, asc, gte, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  focusTasks,
  focusSessions,
  focusHabits,
  focusHabitLogs,
  focusPresets,
  focusSettings,
  focusSoundTracks,
  focusPlaylists,
  focusSceneBackgrounds,
} from "@/db/schema";
import {
  TaskSchema,
  UpdateTaskSchema,
  SessionSchema,
  HabitSchema,
  HabitLogSchema,
  PresetSchema,
  FocusSettingsSchema,
  SoundTrackSchema,
  PlaylistSchema,
  SceneBackgroundSchema,
  ImportPayloadSchema,
  type TaskInput,
  type UpdateTaskInput,
  type SessionInput,
  type HabitInput,
  type HabitLogInput,
  type PresetInput,
  type FocusSettingsInput,
  type SoundTrackInput,
  type PlaylistInput,
  type SceneBackgroundInput,
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

export async function getStats(userId: string) {
  const db = await getDb();
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
  const startOfWeek = new Date(now.getTime() - 6 * 86400000).toISOString();
  const startOfMonth = new Date(now.getTime() - 29 * 86400000).toISOString();

  const rows = await db
    .select()
    .from(focusSessions)
    .where(and(eq(focusSessions.userId, userId), eq(focusSessions.type, "work"), gte(focusSessions.completedAt, startOfMonth)));

  let today = 0;
  let week = 0;
  let month = 0;
  const dayTotals = new Map<string, number>();
  for (const r of rows) {
    month += r.durationMinutes;
    if (r.completedAt >= startOfWeek) week += r.durationMinutes;
    if (r.completedAt >= startOfToday) today += r.durationMinutes;
    const day = r.completedAt.slice(0, 10);
    dayTotals.set(day, (dayTotals.get(day) ?? 0) + r.durationMinutes);
  }

  // streak: consecutive days (including today) with at least one work session
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!dayTotals.has(key)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return {
    todayMinutes: today,
    weekMinutes: week,
    monthMinutes: month,
    streakDays: streak,
    totalSessions: rows.length,
    dayTotals: Object.fromEntries(dayTotals),
  };
}

// ---------- Habits ----------

export async function listHabits(userId: string) {
  const db = await getDb();
  const habits = await db
    .select()
    .from(focusHabits)
    .where(eq(focusHabits.userId, userId))
    .orderBy(asc(focusHabits.sortOrder), asc(focusHabits.createdAt));

  const logsByHabit = new Map<string, string[]>();
  for (const h of habits) {
    const logs = await db
      .select({ logDate: focusHabitLogs.logDate })
      .from(focusHabitLogs)
      .where(eq(focusHabitLogs.habitId, h.id));
    logsByHabit.set(
      h.id,
      logs.map((l) => l.logDate).sort(),
    );
  }

  return habits.map((h) => ({ ...h, logDates: logsByHabit.get(h.id) ?? [] }));
}

export async function createHabit(userId: string, raw: HabitInput) {
  const input = HabitSchema.parse(raw);
  const db = await getDb();
  const record = {
    id: crypto.randomUUID(),
    userId,
    name: input.name,
    sortOrder: 0,
    createdAt: new Date().toISOString(),
  };
  await db.insert(focusHabits).values(record);
  return record;
}

export async function deleteHabit(userId: string, id: string) {
  const db = await getDb();
  await db.delete(focusHabitLogs).where(eq(focusHabitLogs.habitId, id));
  await db.delete(focusHabits).where(and(eq(focusHabits.id, id), eq(focusHabits.userId, userId)));
}

export async function toggleHabitLog(userId: string, habitId: string, raw: HabitLogInput) {
  const input = HabitLogSchema.parse(raw);
  const db = await getDb();

  const habit = await db
    .select()
    .from(focusHabits)
    .where(and(eq(focusHabits.id, habitId), eq(focusHabits.userId, userId)))
    .get();
  if (!habit) throw new Error("HABIT_NOT_FOUND");

  const existing = await db
    .select()
    .from(focusHabitLogs)
    .where(and(eq(focusHabitLogs.habitId, habitId), eq(focusHabitLogs.logDate, input.logDate)))
    .get();

  if (existing) {
    await db.delete(focusHabitLogs).where(eq(focusHabitLogs.id, existing.id));
    return { checked: false };
  }
  await db.insert(focusHabitLogs).values({
    id: crypto.randomUUID(),
    habitId,
    logDate: input.logDate,
    createdAt: new Date().toISOString(),
  });
  return { checked: true };
}

// ---------- Presets ----------

export async function listPresets(userId: string) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(focusPresets)
    .where(eq(focusPresets.userId, userId))
    .orderBy(desc(focusPresets.createdAt));
  return rows.map((r) => ({ ...r, soundIds: JSON.parse(r.soundIds) }));
}

export async function createPreset(userId: string, raw: PresetInput) {
  const input = PresetSchema.parse(raw);
  const db = await getDb();
  const record = {
    id: crypto.randomUUID(),
    userId,
    name: input.name,
    soundIds: JSON.stringify(input.soundIds),
    sceneKey: input.sceneKey,
    workMinutes: input.workMinutes,
    breakMinutes: input.breakMinutes,
    createdAt: new Date().toISOString(),
  };
  await db.insert(focusPresets).values(record);
  return { ...record, soundIds: input.soundIds };
}

export async function deletePreset(userId: string, id: string) {
  const db = await getDb();
  await db.delete(focusPresets).where(and(eq(focusPresets.id, id), eq(focusPresets.userId, userId)));
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

// ---------- Scene backgrounds (public read + admin upsert/delete) ----------

export async function listSceneBackgrounds() {
  const db = await getDb();
  return db.select().from(focusSceneBackgrounds);
}

export async function listSceneBackgroundsAdmin() {
  const db = await getDb();
  return db.select().from(focusSceneBackgrounds);
}

export async function upsertSceneBackground(raw: SceneBackgroundInput) {
  const input = SceneBackgroundSchema.parse(raw);
  const db = await getDb();
  const now = new Date().toISOString();

  const existing = await db
    .select()
    .from(focusSceneBackgrounds)
    .where(eq(focusSceneBackgrounds.sceneKey, input.sceneKey))
    .get();

  if (existing) {
    await db
      .update(focusSceneBackgrounds)
      .set({ mediaType: input.mediaType, source: input.source, urlOrKey: input.urlOrKey, updatedAt: now })
      .where(eq(focusSceneBackgrounds.sceneKey, input.sceneKey));
    return { ...existing, ...input, updatedAt: now };
  }

  const record = { id: crypto.randomUUID(), ...input, updatedAt: now };
  await db.insert(focusSceneBackgrounds).values(record);
  return record;
}

export async function deleteSceneBackground(sceneKey: string) {
  const db = await getDb();
  const existing = await db
    .select()
    .from(focusSceneBackgrounds)
    .where(eq(focusSceneBackgrounds.sceneKey, sceneKey))
    .get();
  await db.delete(focusSceneBackgrounds).where(eq(focusSceneBackgrounds.sceneKey, sceneKey));
  return existing ?? null;
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

  for (const h of input.habits) {
    const habitId = crypto.randomUUID();
    await db.insert(focusHabits).values({ id: habitId, userId, name: h.name, sortOrder: 0, createdAt: now });
    for (const logDate of h.logDates) {
      await db
        .insert(focusHabitLogs)
        .values({ id: crypto.randomUUID(), habitId, logDate, createdAt: now })
        .onConflictDoNothing();
    }
  }

  return {
    importedTasks: input.tasks.length,
    importedSessions: input.sessions.length,
    importedHabits: input.habits.length,
  };
}
