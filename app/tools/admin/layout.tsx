import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUserBySessionId } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { listSuggestionsAdmin } from "@/lib/admin/service";
import { AdminNav, type AdminNavSection } from "@/components/admin/AdminNav";

const NAV: AdminNavSection[] = [
  {
    section: "General",
    items: [
      { href: "/", label: "Overview", icon: "LayoutDashboard" },
      { href: "/users", label: "Users", icon: "Users" },
      { href: "/categories", label: "Categories", icon: "FolderTree" },
      { href: "/tools", label: "Tools", icon: "Wrench" },
    ],
  },
  {
    section: "Content",
    items: [
      { href: "/blog", label: "Blog", icon: "Newspaper" },
      { href: "/bucket-list", label: "Bucket List", icon: "ListChecks" },
    ],
  },
  {
    section: "Market",
    items: [
      { href: "/market/news-sources", label: "News Sources", icon: "Rss" },
      { href: "/market/calendar-settings", label: "Calendar Settings", icon: "CalendarClock" },
      { href: "/market/price-settings", label: "Price Settings", icon: "Settings2" },
      { href: "/market/price-symbols", label: "Price Symbols", icon: "Tags" },
      { href: "/market/portfolios", label: "Portfolios", icon: "Briefcase" },
    ],
  },
  {
    section: "Meal",
    items: [{ href: "/meal/recipes", label: "Recipes", icon: "Utensils" }],
  },
  {
    section: "Focus",
    items: [
      { href: "/focus/settings", label: "Settings", icon: "SlidersHorizontal" },
      { href: "/focus/themes", label: "Themes", icon: "Palette" },
      { href: "/focus/sounds", label: "Sounds", icon: "Music2" },
      { href: "/focus/playlists", label: "Playlists", icon: "ListMusic" },
    ],
  },
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
      <AdminNav sections={NAV} suggestionCount={suggestionCount} />
      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
}
