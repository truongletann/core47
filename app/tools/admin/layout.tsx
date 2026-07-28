import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { getUserBySessionId } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/users", label: "Users" },
  { href: "/categories", label: "Categories" },
  { href: "/tools", label: "Tools" },
  { href: "/list100", label: "List 100" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);

  if (!user) redirect("https://core47.xyz/login?returnTo=https://admin.core47.xyz/");
  if (!user.isAdmin) redirect("https://core47.xyz/");

  return (
    <main className="mx-auto flex max-w-7xl gap-8 px-6 py-12">
      <nav className="w-40 shrink-0">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-[rgb(var(--muted))]">
          Admin CMS
        </p>
        <ul className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-md px-2 py-1.5 text-sm text-[rgb(var(--muted))] hover:bg-[rgb(var(--border)/0.5)] hover:text-[rgb(var(--fg))]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
}
