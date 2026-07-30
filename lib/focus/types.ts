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
}

export interface FocusPreset {
  id: string;
  name: string;
  soundIds: { id: string; volume: number }[];
  sceneKey: string;
  workMinutes: number;
  breakMinutes: number;
}

export const SCENES = [
  { key: "rainy-window", name: "Cửa sổ mưa" },
  { key: "thunderstorm", name: "Giông bão" },
  { key: "forest", name: "Rừng đom đóm" },
  { key: "campfire", name: "Lửa trại" },
  { key: "ocean", name: "Sóng biển" },
  { key: "snowfall", name: "Tuyết rơi" },
  { key: "coffee-shop", name: "Quán cà phê" },
  { key: "starry-night", name: "Bầu trời sao" },
  { key: "library", name: "Thư viện" },
] as const;

export type SceneKey = (typeof SCENES)[number]["key"];
