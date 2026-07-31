"use client";

import { X } from "lucide-react";

export function ResetDialog({
  onClose,
  onResetSegment,
  onResetSession,
}: {
  onClose: () => void;
  onResetSegment: () => void;
  onResetSession: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-[#141019] p-6 text-center text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute left-4 top-4 text-white/60 hover:text-white" aria-label="Đóng">
          <X size={18} />
        </button>
        <h2 className="font-display text-xl font-bold">Reset Timer</h2>
        <p className="mt-2 text-sm text-white/70">
          Would you like to reset your current segment, or your full session?
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={onResetSegment}
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Reset Current Segment
          </button>
          <button
            onClick={onResetSession}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Reset Full Session
          </button>
        </div>
      </div>
    </div>
  );
}
