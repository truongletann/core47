"use client";

import { useState } from "react";

const ALLOWED_HOSTS_SUFFIX = ["core47.xyz", "to2.site"];

function getSafeReturnTo(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("returnTo");
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const isSafe = ALLOWED_HOSTS_SUFFIX.some(
      (suffix) => url.hostname === suffix || url.hostname.endsWith(`.${suffix}`),
    );
    return isSafe ? raw : null;
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [identifier, setIdentifier] = useState(""); // login: email hoặc username
  const [email, setEmail] = useState(""); // register: email is required
  const [username, setUsername] = useState(""); // register: optional
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const body =
        mode === "login" ? { identifier, password } : { email, username: username || undefined, password };

      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { success: boolean; error?: string };

      if (!json.success) {
        setError(
          json.error === "EMAIL_TAKEN"
            ? "This email is already registered."
            : json.error === "USERNAME_TAKEN"
              ? "This username is already taken."
              : json.error === "INVALID_CREDENTIALS"
                ? "Wrong email/username or password."
                : "Something went wrong, please try again.",
        );
        return;
      }

      const returnTo = getSafeReturnTo();
      window.location.href = returnTo || "https://core47.xyz/";
    } catch {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    mode === "login" ? Boolean(identifier && password) : Boolean(email && password.length >= 8);

  return (
    <main className="mx-auto max-w-sm px-6 py-20">
      <h1 className="font-display text-2xl font-semibold">
        {mode === "login" ? "Log in" : "Create an account"}
      </h1>
      <p className="mt-2 text-sm text-[rgb(var(--muted))]">
        {mode === "login" ? "See your link history." : "Track the links you shorten."}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {mode === "login" ? (
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email or username"
            className="font-data rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
          />
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="font-data rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username (optional)"
              className="font-data rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.3)]"
            />
          </>
        )}
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
          disabled={loading || !canSubmit}
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
