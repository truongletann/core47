"use client";

import type { FocusTask, FocusSession, FocusHabit } from "./types";
import type { ImportPayload } from "./schema";

const STORAGE_KEY = "focus:v1";

interface LocalData {
  tasks: FocusTask[];
  sessions: FocusSession[];
  habits: FocusHabit[];
}

function emptyData(): LocalData {
  return { tasks: [], sessions: [], habits: [] };
}

export function loadLocalData(): LocalData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw);
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      habits: Array.isArray(parsed.habits) ? parsed.habits : [],
    };
  } catch {
    return emptyData();
  }
}

function saveLocalData(data: LocalData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function hasLocalData(): boolean {
  const data = loadLocalData();
  return data.tasks.length > 0 || data.sessions.length > 0 || data.habits.length > 0;
}

export function clearLocalData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

// ---------- Tasks ----------

export function addLocalTask(title: string, estimatedPomodoros: number): FocusTask {
  const data = loadLocalData();
  const task: FocusTask = {
    id: crypto.randomUUID(),
    title,
    estimatedPomodoros,
    completedPomodoros: 0,
    isDone: false,
    createdAt: new Date().toISOString(),
  };
  data.tasks.push(task);
  saveLocalData(data);
  return task;
}

export function updateLocalTask(id: string, patch: Partial<FocusTask>) {
  const data = loadLocalData();
  data.tasks = data.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
  saveLocalData(data);
}

export function deleteLocalTask(id: string) {
  const data = loadLocalData();
  data.tasks = data.tasks.filter((t) => t.id !== id);
  saveLocalData(data);
}

// ---------- Sessions ----------

export function logLocalSession(
  type: "work" | "break",
  durationMinutes: number,
  taskId: string | null,
): FocusSession {
  const data = loadLocalData();
  const session: FocusSession = {
    id: crypto.randomUUID(),
    taskId,
    type,
    durationMinutes,
    completedAt: new Date().toISOString(),
  };
  data.sessions.push(session);
  if (taskId && type === "work") {
    data.tasks = data.tasks.map((t) =>
      t.id === taskId ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t,
    );
  }
  saveLocalData(data);
  return session;
}

// ---------- Habits ----------

export function addLocalHabit(name: string): FocusHabit {
  const data = loadLocalData();
  const habit: FocusHabit = { id: crypto.randomUUID(), name, logDates: [] };
  data.habits.push(habit);
  saveLocalData(data);
  return habit;
}

export function deleteLocalHabit(id: string) {
  const data = loadLocalData();
  data.habits = data.habits.filter((h) => h.id !== id);
  saveLocalData(data);
}

export function toggleLocalHabitLog(habitId: string, logDate: string): boolean {
  const data = loadLocalData();
  let checked = false;
  data.habits = data.habits.map((h) => {
    if (h.id !== habitId) return h;
    if (h.logDates.includes(logDate)) {
      return { ...h, logDates: h.logDates.filter((d) => d !== logDate) };
    }
    checked = true;
    return { ...h, logDates: [...h.logDates, logDate].sort() };
  });
  saveLocalData(data);
  return checked;
}

// ---------- Stats (computed client-side from local sessions) ----------

export function getLocalStats() {
  const data = loadLocalData();
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
  const startOfWeek = new Date(now.getTime() - 6 * 86400000).toISOString();

  let today = 0;
  let week = 0;
  let month = 0;
  const dayTotals: Record<string, number> = {};

  for (const s of data.sessions) {
    if (s.type !== "work") continue;
    month += s.durationMinutes;
    if (s.completedAt >= startOfWeek) week += s.durationMinutes;
    if (s.completedAt >= startOfToday) today += s.durationMinutes;
    const day = s.completedAt.slice(0, 10);
    dayTotals[day] = (dayTotals[day] ?? 0) + s.durationMinutes;
  }

  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!(key in dayTotals)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return {
    todayMinutes: today,
    weekMinutes: week,
    monthMinutes: month,
    streakDays: streak,
    totalSessions: data.sessions.filter((s) => s.type === "work").length,
    dayTotals,
  };
}

// ---------- Import payload (one-time merge into the account on login) ----------

export function buildImportPayload(): ImportPayload {
  const data = loadLocalData();
  return {
    tasks: data.tasks.map((t) => ({
      title: t.title,
      estimatedPomodoros: t.estimatedPomodoros,
      completedPomodoros: t.completedPomodoros,
      isDone: t.isDone,
    })),
    sessions: data.sessions.map((s) => ({
      type: s.type,
      durationMinutes: s.durationMinutes,
      completedAt: s.completedAt,
    })),
    habits: data.habits.map((h) => ({ name: h.name, logDates: h.logDates })),
  };
}
