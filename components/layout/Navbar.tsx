import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg)/0.8)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/">
          <LogoMark />
        </Link>

        <div className="flex items-center gap-6">
          <nav className="font-data flex items-center gap-6 text-sm text-[rgb(var(--muted))]">
            <Link href="/blog" className="hover:text-[rgb(var(--fg))] transition-colors">
              Blog
            </Link>
            <Link href="/toolkits" className="hover:text-[rgb(var(--fg))] transition-colors">
              List 100
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}