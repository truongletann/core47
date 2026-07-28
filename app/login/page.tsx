"use client";

import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as { success: boolean; error?: string };

      if (!json.success) {
        setError(
          json.error === "EMAIL_TAKEN"
            ? "This email is already registered."
            : json.error === "INVALID_CREDENTIALS"
              ? "Wrong email or password."
              : "Something went wrong, please try again.",
        );
        return;
      }

      window.location.href = "https://shortlink.core47.xyz/history";
    } catch {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-20">
      <h1 className="font-display text-2xl font-semibold">
        {mode === "login" ? "Log in" : "Create an account"}
      </h1>
      <p className="mt-2 text-sm text-[rgb(var(--muted))]">
        {mode === "login" ? "See your link history." : "Track the links you shorten."}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="font-data rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="font-data rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="rounded-lg bg-[rgb(var(--accent))] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-4 text-xs text-[rgb(var(--muted))] underline underline-offset-2 hover:text-[rgb(var(--accent))]"
      >
        {mode === "login" ? "No account yet? Sign up" : "Already have an account? Log in"}
      </button>
    </main>
  );
}