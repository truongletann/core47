import { List100Grid } from "@/components/list100/List100Grid";
import { getPublishedList100Items, getPublishedCategories } from "@/lib/list100/service";

export default async function ToolkitsPage() {
  const [items, categories] = await Promise.all([
    getPublishedList100Items({}),
    getPublishedCategories(),
  ]);

  return (
    <main>
      <div className="mx-auto max-w-4xl px-6 pb-8 pt-16 text-center">
        <h1 className="font-display text-3xl font-semibold">List 100</h1>
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          {items.length} mục được tuyển chọn và xếp hạng.
        </p>
      </div>
      <List100Grid items={items} categories={categories} />
    </main>
  );
}
