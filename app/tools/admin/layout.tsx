import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { getUserBySessionId } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { listSuggestionsAdmin } from "@/lib/admin/service";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/users", label: "Users" },
  { href: "/categories", label: "Categories" },
  { href: "/tools", label: "Tools" },
  { href: "/list100", label: "List 100" },
  { href: "/blog", label: "Blog" },
  { href: "/market/news-sources", label: "Market: News Sources" },
  { href: "/market/portfolios", label: "Market: Portfolios" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);

  if (!user) redirect("https://core47.xyz/login?returnTo=https://admin.core47.xyz/");
  if (!user.isAdmin) redirect("https://core47.xyz/");

  const suggestionCount = (await listSuggestionsAdmin()).length;

  return (
    <main className="flex w-full gap-8 px-6 py-8">
      <nav className="w-40 shrink-0">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-[rgb(var(--muted))]">
          Admin CMS
        </p>
        <ul className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)] hover:text-[rgb(var(--fg))]"
              >
                <span>{item.label}</span>
                {item.href === "/list100" && suggestionCount > 0 && (
                  <span className="font-data rounded-full bg-[rgb(var(--accent))] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {suggestionCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
}
