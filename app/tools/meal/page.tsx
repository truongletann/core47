import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUserBySessionId } from "@/lib/auth/service";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import { MealPlannerClient } from "@/components/meal/MealPlannerClient";

export default async function MealPlannerPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserBySessionId(sessionId);

  if (!user) redirect("https://core47.xyz/login?returnTo=https://meal.core47.xyz/");

  return <MealPlannerClient />;
}
