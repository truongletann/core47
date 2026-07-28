import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUserBySessionId } from "@/lib/auth/service";
import { getAllShortLinks } from "@/lib/shortlink/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { SHORT_DOMAIN } from "@/lib/shortlink/config";
import { DeleteLinkButton } from "@/components/ui/DeleteLinkButton";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);

  if (!user) redirect("/login");
  if (!user.isAdmin) redirect("/");

  const links = await getAllShortLinks();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold">Admin — All links</h1>
      <p className="mt-1 text-sm text-[rgb(var(--muted))]">
        {links.length} link(s) total across all users
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[rgb(var(--border))]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--border))] text-xs uppercase text-[rgb(var(--muted))]">
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Target URL</th>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">IP address</th>
              <th className="px-4 py-2">Device / Browser</th>
              <th className="px-4 py-2">Created at</th>
              <th className="px-4 py-2">Clicks</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-b border-[rgb(var(--border))] last:border-0">
                <td className="font-data px-4 py-2 text-[rgb(var(--accent))]">
                  {SHORT_DOMAIN}/{link.code}
                </td>
                <td className="max-w-xs truncate px-4 py-2">{link.targetUrl}</td>
                <td className="font-data px-4 py-2 text-xs">
                  {link.userId ? link.userId.slice(0, 8) : "guest"}
                </td>
                <td className="font-data px-4 py-2 text-xs">{link.ipAddress ?? "—"}</td>
                <td className="max-w-[200px] truncate px-4 py-2 text-xs">
                  {link.userAgent ?? "—"}
                </td>
                <td className="px-4 py-2 text-xs">
                  {new Date(link.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">{link.clicks}</td>
                <td className="px-4 py-2">
                  <DeleteLinkButton code={link.code} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}