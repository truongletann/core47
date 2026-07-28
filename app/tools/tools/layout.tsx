import { ToolboxSidebar } from "@/components/toolbox/Sidebar";

export default function ToolboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex max-w-7xl gap-10 px-6 py-12">
      <ToolboxSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
}
