import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUserBySessionId } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { PortfolioClient } from "@/components/market/PortfolioClient";

export default async function MarketPortfolioPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);

  if (!user) redirect("/login");

  return (
    <main className="py-10">
      <PortfolioClient />
    </main>
  );
}
