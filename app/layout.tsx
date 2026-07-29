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

  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="flex min-h-screen flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar isAdminArea={isAdminArea} />
          <div className="flex-1">{children}</div>
          <Footer isAdminArea={isAdminArea} />
        </ThemeProvider>
      </body>
    </html>
  );
}