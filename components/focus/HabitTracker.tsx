"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { FocusHabit } from "@/lib/focus/types";

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const day = new Date(d.getTime() - i * 86400000);
    days.push(day.toISOString().slice(0, 10));
  }
  return days;
}

interface HabitTrackerProps {
  habits: FocusHabit[];
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
  onToggle: (habitId: string, logDate: string) => void;
}

export function HabitTracker({ habits, onAdd, onDelete, onToggle }: HabitTrackerProps) {
  const [name, setName] = useState("");
  const days = lastNDays(14);

  function submit() {
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
  }

  function streak(habit: FocusHabit) {
    let s = 0;
    const set = new Set(habit.logDates);
    const cursor = new Date();
    for (;;) {
      const key = cursor.toISOString().slice(0, 10);
      if (!set.has(key)) break;
      s += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return s;
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Thói quen mới, vd: Đọc sách..."
          className="flex-1 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={submit}
          className="flex items-center gap-1 rounded-md bg-[rgb(var(--accent))] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={16} /> Thêm
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-1 text-left text-xs text-[rgb(var(--muted))]">Thói quen</th>
              {days.map((d) => (
                <th key={d} className="p-1 text-center text-[10px] text-[rgb(var(--muted))]">
                  {d.slice(8, 10)}
                </th>
              ))}
              <th className="p-1 text-center text-xs text-[rgb(var(--muted))]">Streak</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {habits.map((h) => (
              <tr key={h.id} className="border-t border-[rgb(var(--border))]">
                <td className="p-1 pr-3 font-medium">{h.name}</td>
                {days.map((d) => {
                  const checked = h.logDates.includes(d);
                  return (
                    <td key={d} className="p-1 text-center">
                      <button
                        onClick={() => onToggle(h.id, d)}
                        className={`h-5 w-5 rounded ${
                          checked ? "bg-emerald-500" : "bg-[rgb(var(--border))]"
                        } transition-colors hover:opacity-80`}
                        aria-label={`Toggle ${h.name} on ${d}`}
                      />
                    </td>
                  );
                })}
                <td className="p-1 text-center font-data text-xs">{streak(h)}🔥</td>
                <td className="p-1">
                  <button onClick={() => onDelete(h.id)} className="text-[rgb(var(--muted))] hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {habits.length === 0 && (
              <tr>
                <td colSpan={days.length + 3} className="p-3 text-center text-[rgb(var(--muted))]">
                  Chưa có thói quen nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
