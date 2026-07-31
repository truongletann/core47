import { getPublicList100Items, getList100Stats } from "@/lib/list100/service";
import { List100ItemRow } from "@/components/list100/List100Item";
import { SuggestionForm } from "@/components/list100/SuggestionForm";

export default async function BucketListPage() {
  const [items, stats] = await Promise.all([getPublicList100Items(), getList100Stats()]);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">Bucket List</h1>
      <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--muted))]">
        Things I want to do, see, and become before my time runs out — big dreams, quiet
        adventures, and a few things that scare me a little. No fixed count, no filler just to hit
        a number — it grows or shrinks as I do. Got a suggestion for something worth adding? Send
        it my way.
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

      <div className="mx-auto mt-20 mb-4 h-px w-24 bg-gradient-to-r from-transparent via-[rgb(var(--border))] to-transparent" />
      <p className="mx-auto max-w-xl px-6 text-center text-[11px] tracking-[0.2em] text-[rgb(var(--muted))] uppercase">
        And, at the end
      </p>
      <p className="font-display mx-auto mt-4 max-w-xl px-6 text-center text-xl leading-relaxed font-medium italic text-[rgb(var(--fg))]">
        Nhìn lại danh sách này vào cuối đời và mỉm cười mãn nguyện vì không hối tiếc điều gì!
      </p>
      <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[rgb(var(--border))] to-transparent" />

      <SuggestionForm />
    </main>
  );
}
