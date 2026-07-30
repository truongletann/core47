"use client";

import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import type { FocusTask } from "@/lib/focus/types";

interface TaskListProps {
  tasks: FocusTask[];
  activeTaskId: string | null;
  onSelectTask: (id: string | null) => void;
  onAddTask: (title: string, estimatedPomodoros: number) => void;
  onToggleDone: (id: string, isDone: boolean) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, activeTaskId, onSelectTask, onAddTask, onToggleDone, onDeleteTask }: TaskListProps) {
  const [title, setTitle] = useState("");
  const [estimate, setEstimate] = useState(1);

  function submit() {
    if (!title.trim()) return;
    onAddTask(title.trim(), estimate);
    setTitle("");
    setEstimate(1);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Việc cần làm..."
          className="flex-1 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none"
        />
        <input
          type="number"
          min={1}
          max={20}
          value={estimate}
          onChange={(e) => setEstimate(Number(e.target.value))}
          className="w-14 rounded-md border border-white/20 bg-white/10 px-2 py-2 text-center text-sm text-white outline-none"
        />
        <button
          onClick={submit}
          className="flex items-center justify-center rounded-md bg-orange-400 px-3 py-2 text-white hover:opacity-90"
          aria-label="Add task"
        >
          <Plus size={16} />
        </button>
      </div>

      <ul className="flex flex-col gap-1.5">
        {tasks.length === 0 && <li className="text-sm text-white/40">Chưa có task nào.</li>}
        {tasks.map((t) => (
          <li
            key={t.id}
            onClick={() => onSelectTask(activeTaskId === t.id ? null : t.id)}
            className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
              activeTaskId === t.id
                ? "border-orange-400 bg-orange-400/15"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleDone(t.id, !t.isDone);
              }}
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                t.isDone ? "border-emerald-400 bg-emerald-400" : "border-white/40"
              }`}
            >
              {t.isDone && <Check size={11} className="text-slate-900" />}
            </button>
            <span className={`flex-1 truncate text-white ${t.isDone ? "line-through opacity-50" : ""}`}>
              {t.title}
            </span>
            <span className="font-data shrink-0 text-xs text-white/50">
              {t.completedPomodoros}/{t.estimatedPomodoros}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(t.id);
              }}
              className="shrink-0 text-white/30 hover:text-red-400"
              aria-label="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
