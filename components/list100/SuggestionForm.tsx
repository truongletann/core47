"use client";

import { useState } from "react";

export function SuggestionForm() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, must always stay empty
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  const items = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/list100/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, items, website }),
      });
      const json = (await res.json()) as { success: boolean };
      if (!json.success) {
        setStatus("error");
        return;
      }
      setName("");
      setContent("");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-10 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 text-sm text-[rgb(var(--muted))]">
        Thanks — got it. I read every suggestion, even if I can't reply to each one.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5"
    >
      <h2 className="text-sm font-semibold">Got ideas for the list?</h2>
      <p className="mt-1 text-xs text-[rgb(var(--muted))]">
        Suggest things you think I should add — one per line if you've got a few. I'll review
        each before it goes up.
      </p>

      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="mt-3 flex flex-col gap-2.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          placeholder="Your name (optional)"
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          maxLength={4000}
          required
          placeholder={"e.g. Watch the northern lights in Iceland\nLearn to surf\nRun a marathon"}
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
        {status === "error" && (
          <p className="text-xs text-red-600">Something went wrong — mind trying again?</p>
        )}
        <button
          type="submit"
          disabled={status === "saving" || items.length === 0}
          className="w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {status === "saving"
            ? "Sending..."
            : items.length > 1
              ? `Send ${items.length} suggestions`
              : "Send suggestion"}
        </button>
      </div>
    </form>
  );
}
