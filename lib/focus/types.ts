export interface FocusTask {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isDone: boolean;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  taskId: string | null;
  type: "work" | "break";
  durationMinutes: number;
  completedAt: string;
}

export interface FocusHabit {
  id: string;
  name: string;
  logDates: string[];
}

export interface FocusStats {
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  streakDays: number;
  totalSessions: number;
  dayTotals: Record<string, number>;
}

export interface SoundTrack {
  id: string;
  name: string;
  category: string;
  source: "bundled" | "r2" | "external";
  urlOrKey: string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface Playlist {
  id: string;
  name: string;
  spotifyEmbedUrl: string;
  category: string | null;
  isEnabled: boolean;
  sortOrder: number;
  thumbnailUrl?: string | null;
}

export interface FocusPreset {
  id: string;
  name: string;
  soundIds: { id: string; volume: number }[];
  sceneKey: string;
  workMinutes: number;
  breakMinutes: number;
}

// Ambience theme catalog — admin-managed (see admin.core47.xyz/focus/themes),
// fetched from /api/focus/themes. "canvas" kinds render one of the built-in
// lightweight animations (urlOrKey is the scene key SceneBackground knows
// bespoke looks for); "image"/"youtube" are fully admin content.
export interface Theme {
  id: string;
  name: string;
  category: string;
  kind: "canvas" | "image" | "youtube";
  source: "canvas" | "r2" | "external" | "youtube";
  urlOrKey: string;
  thumbnailUrl: string | null;
  startSeconds: number | null;
  endSeconds: number | null;
  isEnabled: boolean;
  sortOrder: number;
}
