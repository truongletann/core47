import { getPublicList100Items, getList100Stats } from "@/lib/list100/service";
import { List100ItemRow } from "@/components/list100/List100Item";

export default async function ToolkitsPage() {
  const [items, stats] = await Promise.all([getPublicList100Items(), getList100Stats()]);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">List 100</h1>
      <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--muted))]">
        A hundred things I want to do, see, and become before my time runs out — big dreams,
        quiet adventures, and a few things that scare me a little. This list keeps changing as I
        do; got a suggestion for something worth adding? Send it my way.
      </p>
      <p className="mt-3 text-xs text-[rgb(var(--muted))]">
        Progress as of {today} — {stats.done} of {stats.total} lived.
      </p>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-[rgb(var(--muted))]">Nothing here yet.</p>
      ) : (
        <div className="mt-8">
          {items.map((item) => (
            <List100ItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
