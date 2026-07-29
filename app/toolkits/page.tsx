import { getPublicList100Items, getList100Stats } from "@/lib/list100/service";
import { List100ItemRow } from "@/components/list100/List100Item";

export default async function ToolkitsPage() {
  const [items, stats] = await Promise.all([getPublicList100Items(), getList100Stats()]);

  const today = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">List 100</h1>
      <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--muted))]">
        Những điều muốn làm trước khi chết.
        <br />
        Tiến độ tính đến {today}: {stats.done}/{stats.total}.
      </p>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-[rgb(var(--muted))]">Chưa có mục nào.</p>
      ) : (
        <ol className="mt-8 list-decimal space-y-0.5 pl-6 text-sm">
          {items.map((item) => (
            <List100ItemRow key={item.id} item={item} />
          ))}
        </ol>
      )}
    </main>
  );
}
