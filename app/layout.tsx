import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Core47 Toolkits",
  description: "Core47's vibe-coding toolkit — fast, lean, edge-native.",
};

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