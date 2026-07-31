"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
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
  const [draft, setDraft] = useState("");

  function submit() {
    if (!draft.trim()) return;
    onAddTask(draft.trim(), 1);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((t) => (
        <div
          key={t.id}
          onClick={() => onSelectTask(activeTaskId === t.id ? null : t.id)}
          className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-colors ${
            activeTaskId === t.id ? "bg-violet-500/15" : "bg-white/5 hover:bg-white/10"
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
          <span className={`flex-1 truncate text-sm text-white ${t.isDone ? "line-through opacity-50" : ""}`}>
            {t.title}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(t.id);
            }}
            className="shrink-0 text-white/30 hover:text-red-400"
            aria-label="Xóa"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-2">
        <span className="h-4 w-4 shrink-0 rounded border border-white/20" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Type your priority"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
        />
      </div>

      <button onClick={submit} className="mt-1 text-left text-sm font-medium text-white/70 hover:text-white">
        + Add Task
      </button>
    </div>
  );
}
