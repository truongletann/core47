import { List100Grid } from "@/components/list100/List100Grid";
import { List100Progress } from "@/components/list100/List100Progress";
import {
  getPublicList100Items,
  getPublicCategories,
  getList100Stats,
} from "@/lib/list100/service";

export default async function ToolkitsPage() {
  const [items, categories, stats] = await Promise.all([
    getPublicList100Items({}),
    getPublicCategories(),
    getList100Stats(),
  ]);

  return (
    <main>
      <div className="mx-auto max-w-4xl px-6 pb-4 pt-16 text-center">
        <h1 className="font-display text-3xl font-semibold">List 100</h1>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          100 điều muốn làm trước khi chết.
        </p>
        <List100Progress total={stats.total} done={stats.done} />
      </div>
      <div className="pt-4">
        <List100Grid items={items} categories={categories} />
      </div>
    </main>
  );
}
