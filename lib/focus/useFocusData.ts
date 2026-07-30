"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusAuth } from "./useFocusAuth";
import {
  loadLocalData,
  addLocalTask,
  updateLocalTask,
  deleteLocalTask,
  logLocalSession,
  getLocalStats,
  hasLocalData,
  buildImportPayload,
  clearLocalData,
} from "./local";
import type { FocusTask, FocusStats } from "./types";

const API = ""; // same-origin: focus.core47.xyz/api/focus/* is served by the same worker

async function api<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API}/api/focus${path}`, {
      ...init,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    const json = (await res.json()) as { success: boolean; data?: T };
    return json.success ? (json.data ?? null) : null;
  } catch {
    return null;
  }
}

export function useFocusData() {
  const user = useFocusAuth();
  const [tasks, setTasks] = useState<FocusTask[]>([]);
  const [stats, setStats] = useState<FocusStats>({
    todayMinutes: 0,
    weekMinutes: 0,
    monthMinutes: 0,
    streakDays: 0,
    totalSessions: 0,
    dayTotals: {},
  });
  const [ready, setReady] = useState(false);
  const importedRef = useRef(false);

  const refreshStats = useCallback(async () => {
    if (user) {
      const data = await api<{ stats: FocusStats }>("/stats");
      if (data) setStats(data.stats);
    } else {
      setStats(getLocalStats());
    }
  }, [user]);

  const refreshTasks = useCallback(async () => {
    if (user) {
      const data = await api<{ tasks: FocusTask[] }>("/tasks");
      setTasks(data?.tasks.map((t) => ({ ...t, isDone: Boolean(t.isDone) })) ?? []);
    } else {
      setTasks(loadLocalData().tasks);
    }
  }, [user]);

  useEffect(() => {
    if (user === undefined) return; // still checking auth

    async function init() {
      if (user && !importedRef.current && hasLocalData()) {
        importedRef.current = true;
        const payload = buildImportPayload();
        await api("/import", { method: "POST", body: JSON.stringify(payload) });
        clearLocalData();
      }
      await Promise.all([refreshTasks(), refreshStats()]);
      setReady(true);
    }
    init();
  }, [user, refreshTasks, refreshStats]);

  const addTask = useCallback(
    async (title: string, estimatedPomodoros: number) => {
      if (user) {
        await api("/tasks", { method: "POST", body: JSON.stringify({ title, estimatedPomodoros }) });
      } else {
        addLocalTask(title, estimatedPomodoros);
      }
      await refreshTasks();
    },
    [user, refreshTasks],
  );

  const toggleTaskDone = useCallback(
    async (id: string, isDone: boolean) => {
      if (user) {
        await api(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ isDone }) });
      } else {
        updateLocalTask(id, { isDone });
      }
      await refreshTasks();
    },
    [user, refreshTasks],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (user) {
        await api(`/tasks/${id}`, { method: "DELETE" });
      } else {
        deleteLocalTask(id);
      }
      await refreshTasks();
    },
    [user, refreshTasks],
  );

  const logSession = useCallback(
    async (type: "work" | "break", durationMinutes: number, taskId: string | null) => {
      if (user) {
        await api("/sessions", {
          method: "POST",
          body: JSON.stringify({ type, durationMinutes, taskId, completedAt: new Date().toISOString() }),
        });
      } else {
        logLocalSession(type, durationMinutes, taskId);
      }
      await Promise.all([refreshTasks(), refreshStats()]);
    },
    [user, refreshTasks, refreshStats],
  );

  return { user, ready, tasks, stats, addTask, toggleTaskDone, deleteTask, logSession, refreshStats };
}
