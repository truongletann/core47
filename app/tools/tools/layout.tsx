import { ToolboxSidebar } from "@/components/toolbox/Sidebar";

export default function ToolboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-10 md:px-6 md:py-12">
      <ToolboxSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
}
