"use client";

import type { FocusTask, FocusSession } from "./types";
import type { ImportPayload } from "./schema";

const STORAGE_KEY = "focus:v1";

interface LocalData {
  tasks: FocusTask[];
  sessions: FocusSession[];
}

function emptyData(): LocalData {
  return { tasks: [], sessions: [] };
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
  return data.tasks.length > 0 || data.sessions.length > 0;
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
  };
}
