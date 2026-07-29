"use client";

import { useState } from "react";

export function SuggestionForm() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, phải luôn để trống
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/list100/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, website }),
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
      <h2 className="text-sm font-semibold">Got an idea for the list?</h2>
      <p className="mt-1 text-xs text-[rgb(var(--muted))]">
        Suggest something you think I should add. I'll review it before it goes up.
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
          rows={2}
          maxLength={500}
          required
          placeholder="e.g. Watch the northern lights in Iceland"
          className="w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm outline-none"
        />
        {status === "error" && (
          <p className="text-xs text-red-600">Something went wrong — mind trying again?</p>
        )}
        <button
          type="submit"
          disabled={status === "saving" || content.trim().length < 3}
          className="w-fit rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {status === "saving" ? "Sending..." : "Send suggestion"}
        </button>
      </div>
    </form>
  );
}
