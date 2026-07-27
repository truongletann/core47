import { Hero } from "@/components/home/Hero";
import { ToolGrid } from "@/components/home/ToolGrid";
import { getAllCategories, getTools } from "@/lib/tools/service";

export default async function HomePage() {
  const categories = await getAllCategories();
  const tools = await getTools({});

  return (
    <main>
      <Hero tools={tools} />
      <ToolGrid tools={tools} categories={categories} />
    </main>
  );
}
