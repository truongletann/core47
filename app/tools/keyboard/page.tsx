"use client";

import { useState } from "react";
import { Keyboard as KeyboardIcon, Gauge } from "lucide-react";
import { KeyTester } from "@/components/keyboard/KeyTester";
import { TypingTest } from "@/components/keyboard/TypingTest";
import type { OS } from "@/lib/keyboard/layout";
import { cn } from "@/lib/utils/cn";

type Tab = "test" | "speed";

export default function KeyboardPage() {
  const [tab, setTab] = useState<Tab>("test");
  const [os, setOs] = useState<OS>("windows");

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <span className="font-data inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted))]">
          <span className="led-dot bg-[rgb(var(--accent))]" />
          keyboard.core47.xyz
        </span>
        <h1 className="font-display mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Kiểm tra <span className="text-[rgb(var(--accent))]">bàn phím</span>
        </h1>
        <p className="mt-3 text-[rgb(var(--muted))]">
          Test từng phím vật lý (Windows &amp; macOS) và đo tốc độ gõ — chạy hoàn toàn trên trình duyệt.
        </p>
      </div>

      <div className="mx-auto mt-8 flex w-fit gap-1 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1">
        <button
          type="button"
          onClick={() => setTab("test")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            tab === "test" ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
          )}
        >
          <KeyboardIcon size={15} /> Test phím
        </button>
        <button
          type="button"
          onClick={() => setTab("speed")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            tab === "speed" ? "bg-[rgb(var(--accent))] text-white" : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
          )}
        >
          <Gauge size={15} /> Tốc độ gõ
        </button>
      </div>

      <div className="mt-6">
        {tab === "test" ? <KeyTester os={os} onOsChange={setOs} /> : <TypingTest />}
      </div>
    </main>
  );
}
