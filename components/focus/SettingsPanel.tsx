"use client";

import type { Durations } from "@/components/focus/Timer";

function Stepper({
  label,
  value,
  onChange,
  step = 5,
  max = 180,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
      <span className="text-sm text-white/80">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(1, value - step))}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          −
        </button>
        <span className="font-data w-10 text-center text-sm text-white">{value}p</span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function SettingsPanel({ durations, onChange }: { durations: Durations; onChange: (d: Durations) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <Stepper label="Tập trung" value={durations.workMinutes} onChange={(v) => onChange({ ...durations, workMinutes: v })} />
      <Stepper
        label="Nghỉ ngắn"
        value={durations.shortBreakMinutes}
        onChange={(v) => onChange({ ...durations, shortBreakMinutes: v })}
      />
      <Stepper
        label="Nghỉ dài"
        value={durations.longBreakMinutes}
        onChange={(v) => onChange({ ...durations, longBreakMinutes: v })}
      />
      <Stepper
        label="Số phiên trước nghỉ dài"
        value={durations.longBreakInterval}
        step={1}
        max={12}
        onChange={(v) => onChange({ ...durations, longBreakInterval: v })}
      />
      <p className="mt-2 text-xs text-white/40">Áp dụng cho phiên tiếp theo. Đang chạy dở sẽ không đổi giữa chừng.</p>
    </div>
  );
}
