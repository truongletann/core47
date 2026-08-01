import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const ROOT_DOMAIN = "core47.xyz";
const DESCRIPTION = "Core47's vibe-coding toolkit — fast, lean, edge-native.";

// Friendly per-subdomain tab titles ("Core47 <Tool>") so every tool reads
// as part of the same family instead of every tab saying "Core47 Labs".
// Falls back to a capitalized version of the subdomain for anything not
// listed here, so a new subdomain never regresses to a blank/generic title.
const SUBDOMAIN_TITLES: Record<string, string> = {
  genqr: "Core47 QR",
  beautysql: "Core47 BeautySQL",
  shortlink: "Core47 Shortlink",
  focus: "Core47 Focus",
  random: "Core47 Random",
  keyboard: "Core47 Keyboard",
  tools: "Core47 Tools",
  admin: "Core47 Admin",
  bio: "Core47 Bio",
  yt: "Core47 YT",
};

function titleForHost(host: string): string {
  const hostname = host.split(":")[0];
  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}` || hostname === "localhost") {
    return "Core47 Labs";
  }
  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) return "Core47 Labs";

  const subdomain = hostname.slice(0, -(`.${ROOT_DOMAIN}`.length));
  if (SUBDOMAIN_TITLES[subdomain]) return SUBDOMAIN_TITLES[subdomain];
  return `Core47 ${subdomain.charAt(0).toUpperCase()}${subdomain.slice(1)}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  return { title: titleForHost(host), description: DESCRIPTION };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host") ?? "";
  const isAdminArea = host.startsWith("admin.") || host === "admin";
  // Focus is a full-screen immersive experience (like a focus-room app) —
  // site chrome would eat into the viewport and break the effect.
  const isFocusArea = host.startsWith("focus.") || host === "focus";

  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="flex min-h-screen flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {isFocusArea ? (
            children
          ) : (
            <>
              <Navbar isAdminArea={isAdminArea} />
              <div className="flex-1">{children}</div>
              <Footer isAdminArea={isAdminArea} />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}