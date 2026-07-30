"use client";

import * as Icons from "lucide-react";

export function DynamicIcon({ name, size = 15 }: { name: string; size?: number }) {
  const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[
    name
  ];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} />;
}
