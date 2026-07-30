"use client";

import Link from "next/link";
import { useFocusHabits } from "@/lib/focus/useFocusHabits";
import { HabitTracker } from "@/components/focus/HabitTracker";

export default function FocusHabitsPage() {
  const { habits, addHabit, deleteHabit, toggleLog } = useFocusHabits();

  return (
    <main className="py-10">
      <Link href="/" className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]">
        ← Quay lại Timer
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold">Thói quen</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">Theo dõi thói quen hàng ngày, tách riêng khỏi Pomodoro.</p>

      <div className="mt-6">
        <HabitTracker habits={habits} onAdd={addHabit} onDelete={deleteHabit} onToggle={toggleLog} />
      </div>
    </main>
  );
}
