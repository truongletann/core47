import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUserBySessionId } from "@/lib/auth/service";
import { getShortLinksByUser } from "@/lib/shortlink/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { SHORT_DOMAIN } from "@/lib/shortlink/config";

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);

  if (!user) {
    redirect("https://core47.xyz/login");
  }

  const links = await getShortLinksByUser(user.id);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold">Your links</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">Logged in as {user.email}</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-[rgb(var(--border))]">
        {links.length === 0 ? (
          <p className="p-6 text-center text-sm text-[rgb(var(--muted))]">
            You haven't created any links yet.
          </p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3 last:border-0"
            >
              <div className="min-w-0">
                <p className="font-data text-sm text-[rgb(var(--accent))]">
                  {SHORT_DOMAIN}/{link.code}
                </p>
                <p className="mt-0.5 truncate text-xs text-[rgb(var(--muted))]">
                  {link.targetUrl}
                </p>
              </div>
              <span className="font-data shrink-0 text-xs text-[rgb(var(--muted))]">
                {link.clicks} clicks
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}