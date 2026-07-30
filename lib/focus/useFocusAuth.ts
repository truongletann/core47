"use client";

import { useEffect, useState } from "react";

interface MeUser {
  id: string;
  email: string;
  name: string | null;
}

// undefined = still checking, null = anonymous, MeUser = logged in.
// Same endpoint/shape UserMenu.tsx already relies on.
export function useFocusAuth() {
  const [user, setUser] = useState<MeUser | null | undefined>(undefined);

  useEffect(() => {
    fetch("https://core47.xyz/api/auth/me", { credentials: "include" })
      .then((r) => r.json() as Promise<{ data?: { user?: MeUser | null } }>)
      .then((json) => setUser(json?.data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  return user;
}
