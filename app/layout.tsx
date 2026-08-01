import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SubdomainTitle } from "@/components/layout/SubdomainTitle";

// Server-rendered fallback title (used for the initial HTML / link
// previews / search results). The actual browser tab title is set
// per-subdomain client-side by <SubdomainTitle /> — see that file for why.
export const metadata: Metadata = {
  title: "Core47 Labs",
  description: "Core47's vibe-coding toolkit — fast, lean, edge-native.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host") ?? "";
  const isAdminArea = host.startsWith("admin.") || host === "admin";
  // Focus is a full-screen immersive experience (like a focus-room app) —
  // site chrome would eat into the viewport and break the effect.
  const isFocusArea = host.startsWith("focus.") || host === "focus";
  // Books' reader needs the full viewport too (PDF/EPUB page area + its own
  // header bar) — same reasoning as Focus above.
  const isBooksArea = host.startsWith("books.") || host === "books";

  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="flex min-h-screen flex-col">
        <SubdomainTitle />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {isFocusArea || isBooksArea ? (
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