import Link from "next/link";

const SECTIONS = [
  {
    href: "/market/calendar",
    title: "Forex / World Calendar",
    description: "Lịch kinh tế quan trọng của các nước — Việt Nam, Mỹ, châu Âu...",
  },
  {
    href: "/market/prices",
    title: "Prices",
    description: "Giá vàng, bạc, cà phê, hồ tiêu — Việt Nam & thế giới.",
  },
  {
    href: "/market/portfolio",
    title: "Portfolio",
    description: "Theo dõi tài sản, giá vốn trung bình (DCA) và lời/lỗ (PnL).",
  },
  {
    href: "/market/news",
    title: "News",
    description: "Tin tức tài chính tổng hợp từ nhiều nguồn trong và ngoài nước.",
  },
];

export default function MarketPage() {
  return (
    <main className="py-10">
      <h1 className="font-display text-3xl font-semibold">Market</h1>
      <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--muted))]">
        Theo dõi thị trường, quản lý tài sản, và cập nhật tin tức tài chính — tất cả trong một chỗ.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-[rgb(var(--border))] p-5 transition-colors hover:border-[rgb(var(--accent))]"
          >
            <h2 className="font-display text-base font-semibold">{s.title}</h2>
            <p className="mt-1.5 text-sm text-[rgb(var(--muted))]">{s.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
