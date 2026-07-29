import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Core47 Toolkits",
  description: "Bộ công cụ vibe-coding của Core47 — nhanh, gọn, edge-native.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host") ?? "";
  const isAdminArea = host.startsWith("admin.") || host === "admin";

  return (
    <html lang="vi" suppressHydrationWarning className="h-full">
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