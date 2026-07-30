"use client";

interface PomoModalProps {
  workMinutes: number;
  breakMinutes: number;
  onChange: (durations: { workMinutes: number; breakMinutes: number }) => void;
}

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
      <span className="text-sm text-white/80">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(1, value - 5))}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          −
        </button>
        <span className="font-data w-10 text-center text-sm text-white">{value}p</span>
        <button
          onClick={() => onChange(Math.min(180, value + 5))}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function PomoModal({ workMinutes, breakMinutes, onChange }: PomoModalProps) {
  return (
    <div className="flex flex-col gap-2">
      <Stepper label="Tập trung" value={workMinutes} onChange={(v) => onChange({ workMinutes: v, breakMinutes })} />
      <Stepper label="Nghỉ" value={breakMinutes} onChange={(v) => onChange({ workMinutes, breakMinutes: v })} />
      <p className="mt-2 text-xs text-white/40">Áp dụng cho phiên tiếp theo. Đang chạy dở sẽ không đổi giữa chừng.</p>
    </div>
  );
}
