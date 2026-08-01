import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUserBySessionId } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { listSuggestionsAdmin } from "@/lib/admin/service";
import { AdminNav } from "@/components/admin/AdminNav";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/users", label: "Users" },
  { href: "/categories", label: "Categories" },
  { href: "/tools", label: "Tools" },
  { href: "/bucket-list", label: "Bucket List" },
  { href: "/blog", label: "Blog" },
  { href: "/market/news-sources", label: "Market: News Sources" },
  { href: "/market/calendar-settings", label: "Market: Calendar Settings" },
  { href: "/market/price-settings", label: "Market: Price Settings" },
  { href: "/market/price-symbols", label: "Market: Price Symbols" },
  { href: "/market/portfolios", label: "Market: Portfolios" },
  { href: "/focus/settings", label: "Focus: Settings" },
  { href: "/focus/themes", label: "Focus: Themes" },
  { href: "/focus/sounds", label: "Focus: Sounds" },
  { href: "/focus/playlists", label: "Focus: Playlists" },
  { href: "/download-settings", label: "Downloader: Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);

  if (!user) redirect("https://core47.xyz/login?returnTo=https://admin.core47.xyz/");
  if (!user.isAdmin) redirect("https://core47.xyz/");

  const suggestionCount = (await listSuggestionsAdmin()).length;

  return (
    <main className="flex w-full flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-6 md:py-8">
      <AdminNav items={NAV} suggestionCount={suggestionCount} />
      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
}
