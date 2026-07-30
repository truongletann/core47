"use client";

import { useCallback, useEffect, useState } from "react";
import { useFocusAuth } from "./useFocusAuth";
import { loadLocalData, addLocalHabit, deleteLocalHabit, toggleLocalHabitLog } from "./local";
import type { FocusHabit } from "./types";

async function api<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`/api/focus${path}`, {
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

export function useFocusHabits() {
  const user = useFocusAuth();
  const [habits, setHabits] = useState<FocusHabit[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (user) {
      const data = await api<{ habits: FocusHabit[] }>("/habits");
      setHabits(data?.habits ?? []);
    } else {
      setHabits(loadLocalData().habits);
    }
  }, [user]);

  useEffect(() => {
    if (user === undefined) return;
    refresh().then(() => setReady(true));
  }, [user, refresh]);

  const addHabit = useCallback(
    async (name: string) => {
      if (user) {
        await api("/habits", { method: "POST", body: JSON.stringify({ name }) });
      } else {
        addLocalHabit(name);
      }
      await refresh();
    },
    [user, refresh],
  );

  const deleteHabit = useCallback(
    async (id: string) => {
      if (user) {
        await api(`/habits/${id}`, { method: "DELETE" });
      } else {
        deleteLocalHabit(id);
      }
      await refresh();
    },
    [user, refresh],
  );

  const toggleLog = useCallback(
    async (habitId: string, logDate: string) => {
      if (user) {
        await api(`/habits/${habitId}/logs`, { method: "POST", body: JSON.stringify({ logDate }) });
      } else {
        toggleLocalHabitLog(habitId, logDate);
      }
      await refresh();
    },
    [user, refresh],
  );

  return { ready, habits, addHabit, deleteHabit, toggleLog };
}
