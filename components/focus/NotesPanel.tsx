"use client";

import { useEffect, useState } from "react";

const NOTES_KEY = "focus_notes_v1";

export function NotesPanel() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    setText(window.localStorage.getItem(NOTES_KEY) ?? "");
  }, []);

  useEffect(() => {
    setSaved(false);
    const id = setTimeout(() => {
      window.localStorage.setItem(NOTES_KEY, text);
      setSaved(true);
    }, 400);
    return () => clearTimeout(id);
  }, [text]);

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ghi chú nhanh..."
        rows={8}
        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/30 outline-none"
      />
      <p className="text-right text-[11px] text-white/30">{saved ? "Đã lưu" : "Đang lưu..."}</p>
    </div>
  );
}
